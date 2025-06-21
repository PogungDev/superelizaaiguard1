// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

/**
 * @title ProofOfReserveVerifier
 * @dev Contract to verify the reserve of an off-chain asset using Chainlink Proof of Reserve feeds.
 * This can be used by other contracts (e.g., VaultGuardOracle) to ensure collateral integrity.
 */
contract ProofOfReserveVerifier {
    AggregatorV3Interface internal immutable i_porFeed;

    // Event to log when a reserve check is performed
    event ReserveChecked(address indexed caller, string assetName, uint256 currentReserve, uint256 requiredReserve, bool sufficient);

    /**
     * @param _porFeedAddress The address of the Chainlink Proof of Reserve AggregatorV3Interface.
     */
    constructor(address _porFeedAddress) {
        i_porFeed = AggregatorV3Interface(_porFeedAddress);
    }

    /**
     * @notice Gets the latest verified reserve amount for the configured asset.
     * @return currentReserve The latest verified reserve amount (scaled by decimals of the feed).
     * @return timestamp The timestamp of the latest update.
     */
    function getLatestReserve() public view returns (uint256 currentReserve, uint256 timestamp) {
        (
            uint80 roundID,
            int256 answer,
            uint256 startedAt,
            uint256 timeStamp,
            uint80 answeredInRound
        ) = i_porFeed.latestRoundData();
        
        require(answer >= 0, "Invalid reserve data"); // Reserve should not be negative
        return (uint256(answer), timeStamp);
    }

    /**
     * @notice Checks if the current verified reserve is sufficient for a required amount.
     * @param _requiredReserve The minimum required reserve amount (in the same units as the PoR feed).
     * @param _assetName A descriptive name for the asset being checked (for logging).
     * @return isSufficient True if the current reserve is greater than or equal to the required reserve, false otherwise.
     */
    function checkReserveSufficiency(uint256 _requiredReserve, string memory _assetName) public returns (bool isSufficient) {
        (uint256 currentReserve, ) = getLatestReserve();
        isSufficient = currentReserve >= _requiredReserve;
        emit ReserveChecked(msg.sender, _assetName, currentReserve, _requiredReserve, isSufficient);
        return isSufficient;
    }

    /**
     * @notice Returns the number of decimals used by the PoR feed.
     */
    function decimals() public view returns (uint8) {
        return i_porFeed.decimals();
    }

    /**
     * @notice Returns the description of the PoR feed.
     */
    function description() public view returns (string memory) {
        return i_porFeed.description();
    }
}
