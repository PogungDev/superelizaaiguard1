// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "@chainlink/contracts/src/v0.8/automation/AutomationCompatible.sol";

contract VaultGuardOracle is AutomationCompatibleInterface {
    AggregatorV3Interface internal priceFeed;
    
    struct Vault {
        address owner;
        uint256 collateralAmount;
        uint256 debtAmount;
        uint256 liquidationThreshold; // in basis points (e.g., 8000 = 80%)
        bool isActive;
        uint256 lastUpdateTime;
    }
    
    struct PriceAlert {
        uint256 targetPrice;
        bool isAbove; // true for above, false for below
        bool isTriggered;
        uint256 timestamp;
    }
    
    mapping(address => Vault) public vaults;
    mapping(address => PriceAlert[]) public priceAlerts;
    mapping(address => bool) public authorizedAgents;
    
    address[] public vaultOwners;
    uint256 public constant LIQUIDATION_BUFFER = 500; // 5% buffer
    
    event VaultCreated(address indexed owner, uint256 collateral, uint256 debt);
    event LiquidationWarning(address indexed owner, uint256 currentLTV, uint256 threshold);
    event PriceAlertTriggered(address indexed user, uint256 price, bool isAbove);
    event AutoRebalance(address indexed owner, uint256 newCollateral);
    event AgentAuthorized(address indexed agent);
    
    modifier onlyAuthorizedAgent() {
        require(authorizedAgents[msg.sender], "Not authorized agent");
        _;
    }
    
    constructor(address _priceFeed) {
        priceFeed = AggregatorV3Interface(_priceFeed);
        authorizedAgents[msg.sender] = true;
    }
    
    function authorizeAgent(address _agent) external {
        require(msg.sender == address(this) || authorizedAgents[msg.sender], "Not authorized");
        authorizedAgents[_agent] = true;
        emit AgentAuthorized(_agent);
    }
    
    function createVault(
        uint256 _collateralAmount,
        uint256 _debtAmount,
        uint256 _liquidationThreshold
    ) external {
        require(_liquidationThreshold > 5000 && _liquidationThreshold < 9500, "Invalid threshold");
        
        vaults[msg.sender] = Vault({
            owner: msg.sender,
            collateralAmount: _collateralAmount,
            debtAmount: _debtAmount,
            liquidationThreshold: _liquidationThreshold,
            isActive: true,
            lastUpdateTime: block.timestamp
        });
        
        vaultOwners.push(msg.sender);
        emit VaultCreated(msg.sender, _collateralAmount, _debtAmount);
    }
    
    function getLatestPrice() public view returns (int256, uint256) {
        (
            uint80 roundID,
            int256 price,
            uint256 startedAt,
            uint256 timeStamp,
            uint80 answeredInRound
        ) = priceFeed.latestRoundData();
        
        return (price, timeStamp);
    }
    
    function calculateLTV(address _owner) public view returns (uint256) {
        Vault memory vault = vaults[_owner];
        if (vault.collateralAmount == 0) return 0;
        
        (int256 price,) = getLatestPrice();
        uint256 collateralValue = vault.collateralAmount * uint256(price) / 1e8;
        
        return (vault.debtAmount * 10000) / collateralValue;
    }
    
    function checkLiquidationRisk(address _owner) public view returns (bool, uint256) {
        uint256 currentLTV = calculateLTV(_owner);
        Vault memory vault = vaults[_owner];
        
        bool atRisk = currentLTV >= (vault.liquidationThreshold - LIQUIDATION_BUFFER);
        return (atRisk, currentLTV);
    }
    
    function setPriceAlert(uint256 _targetPrice, bool _isAbove) external {
        priceAlerts[msg.sender].push(PriceAlert({
            targetPrice: _targetPrice,
            isAbove: _isAbove,
            isTriggered: false,
            timestamp: block.timestamp
        }));
    }
    
    // Chainlink Automation functions
    function checkUpkeep(bytes calldata) external view override returns (bool upkeepNeeded, bytes memory performData) {
        address[] memory needsRebalance = new address[](vaultOwners.length);
        uint256 count = 0;
        
        for (uint256 i = 0; i < vaultOwners.length; i++) {
            address owner = vaultOwners[i];
            if (vaults[owner].isActive) {
                (bool atRisk,) = checkLiquidationRisk(owner);
                if (atRisk) {
                    needsRebalance[count] = owner;
                    count++;
                }
            }
        }
        
        upkeepNeeded = count > 0;
        performData = abi.encode(needsRebalance, count);
    }
    
    function performUpkeep(bytes calldata performData) external override {
        (address[] memory needsRebalance, uint256 count) = abi.decode(performData, (address[], uint256));
        
        for (uint256 i = 0; i < count; i++) {
            address owner = needsRebalance[i];
            (bool atRisk, uint256 currentLTV) = checkLiquidationRisk(owner);
            
            if (atRisk) {
                emit LiquidationWarning(owner, currentLTV, vaults[owner].liquidationThreshold);
                // Auto-rebalance logic would go here
                _autoRebalance(owner);
            }
        }
    }
    
    function _autoRebalance(address _owner) internal {
        Vault storage vault = vaults[_owner];
        // Simulate adding 20% more collateral
        uint256 additionalCollateral = vault.collateralAmount * 20 / 100;
        vault.collateralAmount += additionalCollateral;
        vault.lastUpdateTime = block.timestamp;
        
        emit AutoRebalance(_owner, vault.collateralAmount);
    }
    
    function updateVault(uint256 _collateralAmount, uint256 _debtAmount) external {
        require(vaults[msg.sender].isActive, "Vault not active");
        
        vaults[msg.sender].collateralAmount = _collateralAmount;
        vaults[msg.sender].debtAmount = _debtAmount;
        vaults[msg.sender].lastUpdateTime = block.timestamp;
    }
    
    function getVaultInfo(address _owner) external view returns (
        uint256 collateral,
        uint256 debt,
        uint256 ltv,
        uint256 threshold,
        bool isActive,
        uint256 lastUpdate
    ) {
        Vault memory vault = vaults[_owner];
        return (
            vault.collateralAmount,
            vault.debtAmount,
            calculateLTV(_owner),
            vault.liquidationThreshold,
            vault.isActive,
            vault.lastUpdateTime
        );
    }
}
