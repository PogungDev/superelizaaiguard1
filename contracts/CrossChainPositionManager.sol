// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@chainlink/contracts-ccip/src/v0.8/ccip/applications/CCIPReceiver.sol";
import "@chainlink/contracts-ccip/src/v0.8/ccip/libraries/Client.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @title CrossChainPositionManager
 * @dev Manages cross-chain asset transfers and messages using Chainlink CCIP.
 * This enables the Yield Optimizer and Liquidation Guard to operate across chains.
 */
contract CrossChainPositionManager is CCIPReceiver {
    // Mapping to track received messages (for demo/logging purposes)
    mapping(bytes32 => bool) public receivedMessages;

    // Events for logging cross-chain operations
    event MessageSent(bytes32 indexed messageId, uint64 indexed destinationChainSelector, address indexed receiver, bytes data);
    event MessageReceived(bytes32 indexed messageId, uint64 indexed sourceChainSelector, address indexed sender, bytes data);
    event TokensTransferred(bytes32 indexed messageId, uint64 indexed destinationChainSelector, address indexed receiver, address token, uint256 amount);
    event TokensReceived(bytes32 indexed messageId, uint64 indexed sourceChainSelector, address indexed sender, address token, uint256 amount);

    /**
     * @param _router The address of the CCIP Router contract on this chain.
     */
    constructor(address _router) CCIPReceiver(_router) {}

    /**
     * @notice Sends a generic cross-chain message to a destination chain.
     * @param _destinationChainSelector The Chainlink CCIP selector for the destination chain.
     * @param _receiver The address of the receiving contract on the destination chain.
     * @param _message The arbitrary data payload to send.
     * @return messageId The ID of the sent message.
     */
    function sendMessage(
        uint64 _destinationChainSelector,
        address _receiver,
        bytes calldata _message
    ) external returns (bytes32 messageId) {
        Client.EVM2AnyMessage memory evm2AnyMessage = Client.EVM2AnyMessage({
            receiver: _receiver,
            data: _message,
            tokenAmounts: new Client.EVMTokenAmount[](0), // No tokens sent with this message
            extraArgs: Client.EVM2AnyMessage.ExtraArgsV1({
                gasLimit: 200_000 // Example gas limit for the destination transaction
            })
        });

        messageId = _ccipSend(
            _destinationChainSelector,
            evm2AnyMessage
        );

        emit MessageSent(messageId, _destinationChainSelector, _receiver, _message);
    }

    /**
     * @notice Sends tokens along with a generic cross-chain message.
     * @param _destinationChainSelector The Chainlink CCIP selector for the destination chain.
     * @param _receiver The address of the receiving contract on the destination chain.
     * @param _message The arbitrary data payload to send.
     * @param _token The address of the ERC20 token to send.
     * @param _amount The amount of tokens to send.
     * @return messageId The ID of the sent message.
     */
    function sendTokensAndMessage(
        uint64 _destinationChainSelector,
        address _receiver,
        bytes calldata _message,
        address _token,
        uint256 _amount
    ) external returns (bytes32 messageId) {
        // Approve the router to spend the tokens
        IERC20(_token).transferFrom(msg.sender, address(this), _amount);
        IERC20(_token).approve(this.getRouter(), _amount);

        Client.EVMTokenAmount[] memory tokenAmounts = new Client.EVMTokenAmount[](1);
        tokenAmounts[0] = Client.EVMTokenAmount({
            token: _token,
            amount: _amount
        });

        Client.EVM2AnyMessage memory evm2AnyMessage = Client.EVM2AnyMessage({
            receiver: _receiver,
            data: _message,
            tokenAmounts: tokenAmounts,
            extraArgs: Client.EVM2AnyMessage.ExtraArgsV1({
                gasLimit: 200_000
            })
        });

        messageId = _ccipSend(
            _destinationChainSelector,
            evm2AnyMessage
        );

        emit TokensTransferred(messageId, _destinationChainSelector, _receiver, _token, _amount);
        emit MessageSent(messageId, _destinationChainSelector, _receiver, _message);
    }

    /**
     * @notice Handles incoming CCIP messages.
     * @dev This function is called by the CCIP Router when a message arrives.
     * It processes the message and emits an event.
     * @param _message The received CCIP message.
     */
    function _ccipReceive(Client.Any2EVMMessage memory _message) internal override {
        // Mark message as received
        receivedMessages[_message.messageId] = true;

        // Process the message data
        // Example: If the message contains a command for rebalancing a yield position
        // You would decode _message.data and call the appropriate function on YieldOptimizer.sol
        // For this example, we just log it.
        emit MessageReceived(_message.messageId, _message.sourceChainSelector, _message.sender, _message.data);

        // Handle received tokens, if any
        for (uint256 i = 0; i < _message.tokenAmounts.length; i++) {
            Client.EVMTokenAmount memory tokenAmount = _message.tokenAmounts[i];
            emit TokensReceived(_message.messageId, _message.sourceChainSelector, _message.sender, tokenAmount.token, tokenAmount.amount);
            // Further logic to handle received tokens (e.g., deposit into a vault)
        }
    }

    /**
     * @notice Returns the address of the CCIP Router used by this contract.
     */
    function getRouterAddress() public view returns (address) {
        return s_router;
    }
}
