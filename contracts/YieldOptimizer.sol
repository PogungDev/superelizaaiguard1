// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract YieldOptimizer {
    struct YieldStrategy {
        string name;
        address protocol;
        uint256 currentAPR; // in basis points (e.g., 500 = 5%)
        uint256 tvl;
        uint256 riskScore; // 1-10, 10 being highest risk
        bool isActive;
        uint256 lastUpdated;
    }
    
    struct UserPosition {
        address user;
        uint256 amount;
        uint256 strategyId;
        uint256 entryTime;
        uint256 lastRebalance;
        uint256 totalYieldEarned;
        bool autoRebalanceEnabled;
    }
    
    mapping(uint256 => YieldStrategy) public strategies;
    mapping(address => UserPosition) public userPositions;
    mapping(address => uint256[]) public userStrategyHistory;
    
    uint256 public strategyCount;
    uint256 public totalValueLocked;
    uint256 public rebalanceThreshold = 100; // 1% APR difference triggers rebalance
    
    event StrategyAdded(uint256 indexed strategyId, string name, uint256 apr);
    event PositionCreated(address indexed user, uint256 amount, uint256 strategyId);
    event AutoRebalance(address indexed user, uint256 fromStrategy, uint256 toStrategy, uint256 amount);
    event YieldHarvested(address indexed user, uint256 amount);
    event StrategyUpdated(uint256 indexed strategyId, uint256 newAPR);
    
    constructor() {
        // Initialize with some dummy strategies
        _addStrategy("Aave USDC", address(0x1), 450, 1000000e6, 3);
        _addStrategy("Compound DAI", address(0x2), 380, 800000e18, 2);
        _addStrategy("Yearn USDT", address(0x3), 520, 600000e6, 5);
        _addStrategy("Curve 3Pool", address(0x4), 290, 2000000e18, 1);
        _addStrategy("Convex stETH", address(0x5), 680, 500000e18, 7);
    }
    
    function _addStrategy(
        string memory _name,
        address _protocol,
        uint256 _apr,
        uint256 _tvl,
        uint256 _riskScore
    ) internal {
        strategies[strategyCount] = YieldStrategy({
            name: _name,
            protocol: _protocol,
            currentAPR: _apr,
            tvl: _tvl,
            riskScore: _riskScore,
            isActive: true,
            lastUpdated: block.timestamp
        });
        
        emit StrategyAdded(strategyCount, _name, _apr);
        strategyCount++;
    }
    
    function createPosition(
        uint256 _amount,
        uint256 _strategyId,
        bool _autoRebalance
    ) external {
        require(_strategyId < strategyCount, "Invalid strategy");
        require(strategies[_strategyId].isActive, "Strategy not active");
        require(_amount > 0, "Amount must be positive");
        
        userPositions[msg.sender] = UserPosition({
            user: msg.sender,
            amount: _amount,
            strategyId: _strategyId,
            entryTime: block.timestamp,
            lastRebalance: block.timestamp,
            totalYieldEarned: 0,
            autoRebalanceEnabled: _autoRebalance
        });
        
        userStrategyHistory[msg.sender].push(_strategyId);
        totalValueLocked += _amount;
        
        emit PositionCreated(msg.sender, _amount, _strategyId);
    }
    
    function findOptimalStrategy(
        uint256 _amount,
        uint256 _maxRiskScore
    ) external view returns (uint256 bestStrategyId, uint256 bestAPR) {
        uint256 highestAPR = 0;
        uint256 bestStrategy = 0;
        
        for (uint256 i = 0; i < strategyCount; i++) {
            YieldStrategy memory strategy = strategies[i];
            if (strategy.isActive && 
                strategy.riskScore <= _maxRiskScore && 
                strategy.currentAPR > highestAPR) {
                highestAPR = strategy.currentAPR;
                bestStrategy = i;
            }
        }
        
        return (bestStrategy, highestAPR);
    }
    
    function checkRebalanceOpportunity(address _user) external view returns (
        bool shouldRebalance,
        uint256 currentStrategy,
        uint256 recommendedStrategy,
        uint256 aprDifference
    ) {
        UserPosition memory position = userPositions[_user];
        if (!position.autoRebalanceEnabled) {
            return (false, 0, 0, 0);
        }
        
        uint256 currentAPR = strategies[position.strategyId].currentAPR;
        uint256 maxRiskScore = strategies[position.strategyId].riskScore;
        
        (uint256 bestStrategy, uint256 bestAPR) = this.findOptimalStrategy(
            position.amount,
            maxRiskScore
        );
        
        uint256 difference = bestAPR > currentAPR ? bestAPR - currentAPR : 0;
        bool shouldRebal = difference >= rebalanceThreshold && bestStrategy != position.strategyId;
        
        return (shouldRebal, position.strategyId, bestStrategy, difference);
    }
    
    function executeRebalance(address _user, uint256 _newStrategyId) external {
        require(userPositions[_user].autoRebalanceEnabled, "Auto-rebalance not enabled");
        require(_newStrategyId < strategyCount, "Invalid strategy");
        require(strategies[_newStrategyId].isActive, "Strategy not active");
        
        UserPosition storage position = userPositions[_user];
        uint256 oldStrategy = position.strategyId;
        
        // Simulate yield harvest before rebalance
        uint256 yieldEarned = _calculateYieldEarned(_user);
        position.totalYieldEarned += yieldEarned;
        
        position.strategyId = _newStrategyId;
        position.lastRebalance = block.timestamp;
        userStrategyHistory[_user].push(_newStrategyId);
        
        emit AutoRebalance(_user, oldStrategy, _newStrategyId, position.amount);
        
        if (yieldEarned > 0) {
            emit YieldHarvested(_user, yieldEarned);
        }
    }
    
    function _calculateYieldEarned(address _user) internal view returns (uint256) {
        UserPosition memory position = userPositions[_user];
        if (position.amount == 0) return 0;
        
        uint256 timeElapsed = block.timestamp - position.lastRebalance;
        uint256 apr = strategies[position.strategyId].currentAPR;
        
        // Simple yield calculation: (amount * apr * timeElapsed) / (365 days * 10000)
        return (position.amount * apr * timeElapsed) / (365 days * 10000);
    }
    
    function updateStrategyAPR(uint256 _strategyId, uint256 _newAPR) external {
        require(_strategyId < strategyCount, "Invalid strategy");
        
        strategies[_strategyId].currentAPR = _newAPR;
        strategies[_strategyId].lastUpdated = block.timestamp;
        
        emit StrategyUpdated(_strategyId, _newAPR);
    }
    
    function getUserPosition(address _user) external view returns (
        uint256 amount,
        uint256 strategyId,
        string memory strategyName,
        uint256 currentAPR,
        uint256 totalYieldEarned,
        uint256 pendingYield,
        bool autoRebalanceEnabled
    ) {
        UserPosition memory position = userPositions[_user];
        YieldStrategy memory strategy = strategies[position.strategyId];
        
        return (
            position.amount,
            position.strategyId,
            strategy.name,
            strategy.currentAPR,
            position.totalYieldEarned,
            _calculateYieldEarned(_user),
            position.autoRebalanceEnabled
        );
    }
    
    function getAllStrategies() external view returns (YieldStrategy[] memory) {
        YieldStrategy[] memory allStrategies = new YieldStrategy[](strategyCount);
        for (uint256 i = 0; i < strategyCount; i++) {
            allStrategies[i] = strategies[i];
        }
        return allStrategies;
    }
    
    function getStrategyPerformance(uint256 _strategyId) external view returns (
        uint256 apr,
        uint256 tvl,
        uint256 riskScore,
        uint256 lastUpdated,
        bool isActive
    ) {
        YieldStrategy memory strategy = strategies[_strategyId];
        return (
            strategy.currentAPR,
            strategy.tvl,
            strategy.riskScore,
            strategy.lastUpdated,
            strategy.isActive
        );
    }
}
