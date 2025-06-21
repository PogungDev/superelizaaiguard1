// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@chainlink/contracts/src/v0.8/functions/v1_0_0/FunctionsClient.sol";
import "@chainlink/contracts/src/v0.8/functions/v1_0_0/libraries/FunctionsRequest.sol";

contract MEVProtector is FunctionsClient {
    struct Transaction {
        address user;
        bytes32 txHash;
        uint256 gasPrice;
        uint256 timestamp;
        bool isProtected;
        uint256 slippageProtection; // in basis points
    }
    
    struct MEVAttempt {
        bytes32 originalTxHash;
        address attacker;
        uint256 attemptedProfit;
        uint256 timestamp;
        bool wasBlocked;
        string attackType; // "frontrun", "sandwich", "backrun"
    }
    
    mapping(bytes32 => Transaction) public transactions;
    mapping(address => MEVAttempt[]) public mevAttempts;
    mapping(address => bool) public protectedUsers;
    mapping(address => uint256) public userNonces;
    
    bytes32[] public transactionHashes;
    uint256 public totalMEVBlocked;
    uint256 public totalTransactionsProtected;
    
    event TransactionProtected(bytes32 indexed txHash, address indexed user, uint256 slippage);
    event MEVAttemptBlocked(bytes32 indexed originalTx, address indexed attacker, string attackType);
    event UserProtectionEnabled(address indexed user);
    event SlippageProtectionTriggered(bytes32 indexed txHash, uint256 actualSlippage);
    
    modifier onlyProtectedUser() {
        require(protectedUsers[msg.sender], "User not protected");
        _;
    }

    using FunctionsRequest for FunctionsRequest.Request;

    // Chainlink Functions specific variables
    address public s_functionsRouter;
    bytes32 public s_functionsDonId;
    uint64 public s_functionsSubscriptionId;
    uint32 public s_functionsGasLimit;

    // Mapping to store pending Functions requests
    mapping(bytes32 => bytes32) public s_functionsRequests; // requestId => originalTxHash
    
    function enableProtection(uint256 _defaultSlippage) external {
        protectedUsers[msg.sender] = true;
        emit UserProtectionEnabled(msg.sender);
    }

    constructor(
        address _functionsRouter,
        bytes32 _functionsDonId,
        uint64 _functionsSubscriptionId,
        uint32 _functionsGasLimit
    ) FunctionsClient(_functionsRouter) {
        s_functionsRouter = _functionsRouter;
        s_functionsDonId = _functionsDonId;
        s_functionsSubscriptionId = _functionsSubscriptionId;
        s_functionsGasLimit = _functionsGasLimit;
    }
    
    function submitProtectedTransaction(
        bytes32 _txHash,
        uint256 _gasPrice,
        uint256 _slippageProtection
    ) external onlyProtectedUser {
        require(_slippageProtection <= 1000, "Slippage too high"); // Max 10%
        
        transactions[_txHash] = Transaction({
            user: msg.sender,
            txHash: _txHash,
            gasPrice: _gasPrice,
            timestamp: block.timestamp,
            isProtected: true,
            slippageProtection: _slippageProtection
        });
        
        transactionHashes.push(_txHash);
        totalTransactionsProtected++;
        
        emit TransactionProtected(_txHash, msg.sender, _slippageProtection);

        // --- NEW: Request off-chain mempool data via Chainlink Functions ---
        // Example JavaScript source code for a Chainlink Function
        // In a real scenario, this would be more complex, fetching from a mempool API
        string memory sourceCode = "const txHash = args[0]; console.log(`Checking mempool for ${txHash}`); return Functions.encodeString(JSON.stringify({ isSuspicious: Math.random() < 0.5, reason: 'Simulated mempool analysis' }));";
        string[] memory args = new string[](1);
        args[0] = FunctionsRequest.toHex(_txHash); // Pass the transaction hash as an argument

        requestMempoolData(_txHash, sourceCode, args);
        // --- END NEW ---
    }

    /**
     * @notice Requests off-chain mempool data using Chainlink Functions for a given transaction.
     * @param _originalTxHash The hash of the transaction to monitor.
     * @param _sourceCode The JavaScript source code for the Chainlink Function.
     * @param _args Arguments to pass to the Chainlink Function.
     * @return requestId The ID of the Functions request.
     */
    function requestMempoolData(
        bytes32 _originalTxHash,
        string calldata _sourceCode,
        string[] calldata _args
    ) external returns (bytes32 requestId) {
        FunctionsRequest.Request memory req;
        req.initializeRequestForInlineJavaScript(_sourceCode);
        if (_args.length > 0) req.setArgs(_args);

        requestId = _sendRequest(
            req.encodeCBOR(),
            s_functionsSubscriptionId,
            s_functionsGasLimit,
            s_functionsDonId
        );
        s_functionsRequests[requestId] = _originalTxHash; // Map request ID to original transaction hash
        return requestId;
    }

    /**
     * @notice Callback function that is called by the Chainlink Functions Router when the request is fulfilled.
     * @param _requestId The ID of the request.
     * @param _response The raw CBOR encoded response from the DON.
     * @param _err The raw CBOR encoded error from the DON, if any.
     */
    function fulfill(
        bytes32 _requestId,
        bytes memory _response,
        bytes memory _err
    ) internal override {
        bytes32 originalTxHash = s_functionsRequests[_requestId];
        require(originalTxHash != bytes32(0), "Request not found");

        if (_err.length > 0) {
            // Handle error from Functions execution
            emit MEVAttemptBlocked(originalTxHash, address(0), "Functions Error"); // Simplified error logging
            return;
        }

        // Decode the response from the Chainlink Function
        // Assuming the response is a boolean indicating MEV risk and a string reason
        (bool isSuspicious, string memory reason) = abi.decode(_response, (bool, string));

        if (isSuspicious) {
            // Trigger MEV protection logic based on the off-chain data
            // For example, you might want to:
            // 1. Delay the transaction (if using RandomTxScheduler)
            // 2. Reroute the transaction to a private mempool
            // 3. Increase slippage tolerance
            emit MEVAttemptBlocked(originalTxHash, msg.sender, reason); // Log the detected MEV attempt
            totalMEVBlocked += 1; // Increment a counter for blocked attempts
            // Further actions would be implemented here
        }
    }
    
    function reportMEVAttempt(
        bytes32 _originalTxHash,
        address _attacker,
        uint256 _attemptedProfit,
        string memory _attackType
    ) external {
        MEVAttempt memory attempt = MEVAttempt({
            originalTxHash: _originalTxHash,
            attacker: _attacker,
            attemptedProfit: _attemptedProfit,
            timestamp: block.timestamp,
            wasBlocked: true,
            attackType: _attackType
        });
        
        mevAttempts[transactions[_originalTxHash].user].push(attempt);
        totalMEVBlocked += _attemptedProfit;
        
        emit MEVAttemptBlocked(_originalTxHash, _attacker, _attackType);
    }
    
    function getTransactionInfo(bytes32 _txHash) external view returns (
        address user,
        uint256 gasPrice,
        uint256 timestamp,
        bool isProtected,
        uint256 slippageProtection
    ) {
        Transaction memory tx = transactions[_txHash];
        return (tx.user, tx.gasPrice, tx.timestamp, tx.isProtected, tx.slippageProtection);
    }
    
    function getUserMEVAttempts(address _user) external view returns (MEVAttempt[] memory) {
        return mevAttempts[_user];
    }
    
    function getProtectionStats() external view returns (
        uint256 totalBlocked,
        uint256 totalProtected,
        uint256 totalUsers
    ) {
        uint256 userCount = 0;
        // This is a simplified count - in production, you'd track this more efficiently
        for (uint256 i = 0; i < transactionHashes.length; i++) {
            if (protectedUsers[transactions[transactionHashes[i]].user]) {
                userCount++;
            }
        }
        
        return (totalMEVBlocked, totalTransactionsProtected, userCount);
    }
    
    function simulateMEVDetection(
        bytes32 _txHash,
        uint256 _suspiciousGasPrice,
        address _suspiciousAddress
    ) external view returns (bool isSuspicious, string memory reason) {
        Transaction memory originalTx = transactions[_txHash];
        
        if (_suspiciousGasPrice > originalTx.gasPrice * 110 / 100) {
            return (true, "Gas price manipulation detected");
        }
        
        if (_suspiciousAddress == originalTx.user) {
            return (true, "Same user attempting manipulation");
        }
        
        return (false, "Transaction appears safe");
    }
}
