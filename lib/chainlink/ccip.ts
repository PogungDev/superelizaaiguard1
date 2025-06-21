import { ethers } from "ethers"
import { getEthersProvider, getEthersSigner } from "../web3-client"

// --- ALAMAT KONTRAK CROSS CHAIN POSITION MANAGER ---
// GANTI DENGAN ALAMAT YANG BENAR UNTUK JARINGAN ANDA!
const CROSS_CHAIN_MANAGER_ADDRESS = "0xPLACEHOLDER_CROSS_CHAIN_MANAGER_ADDRESS" // Replace with the deployed address of CrossChainPositionManager.sol

// ABI untuk berinteraksi dengan CrossChainPositionManager
const CROSS_CHAIN_MANAGER_ABI = [
  "function sendCrossChainMessage(uint64 destinationChainSelector, address receiver, bytes calldata message) external",
  "function getFee(uint64 destinationChainSelector, address receiver, bytes memory message) view returns (uint256 fee)",
  // Tambahkan fungsi lain yang relevan
]

interface CCIPMessage {
  destinationChainSelector: ethers.BigNumberish
  receiver: string
  message: string // Hex string of the message
}

/**
 * Mengirim pesan lintas rantai menggunakan kontrak CrossChainPositionManager.
 * @param {CCIPMessage} messageData Data pesan yang akan dikirim.
 * @returns {Promise<void>}
 */
export async function sendCrossChainMessage(messageData: CCIPMessage): Promise<void> {
  const provider = getEthersProvider()
  const signer = getEthersSigner()

  if (CROSS_CHAIN_MANAGER_ADDRESS.includes("PLACEHOLDER")) {
    console.warn(
      "Using placeholder address for Cross Chain Position Manager. Please update with a real Cross Chain Position Manager address.",
    )
    return
  }

  try {
    const crossChainManager = new ethers.Contract(CROSS_CHAIN_MANAGER_ADDRESS, CROSS_CHAIN_MANAGER_ABI, signer)

    // Dapatkan biaya pengiriman pesan
    const fee = await crossChainManager.getFee(
      messageData.destinationChainSelector,
      messageData.receiver,
      ethers.utils.arrayify(messageData.message),
    )

    // Kirim pesan
    const tx = await crossChainManager.sendCrossChainMessage(
      messageData.destinationChainSelector,
      messageData.receiver,
      ethers.utils.arrayify(messageData.message),
      { value: fee },
    )
    await tx.wait()
  } catch (error) {
    console.error("Error sending cross-chain message:", error)
    throw new Error("Failed to send cross-chain message.")
  }
}

/**
 * Mendapatkan estimasi biaya untuk pesan CCIP.
 * @param {ethers.BigNumberish} destinationChainSelector Chain selector tujuan.
 * @param {string} receiver Alamat penerima di rantai tujuan.
 * @param {string} message Pesan dalam format hex string.
 * @returns {Promise<ethers.BigNumber>} Estimasi biaya dalam LINK.
 */
export async function getCCIPMessageFee(
  destinationChainSelector: ethers.BigNumberish,
  receiver: string,
  message: string,
): Promise<ethers.BigNumber> {
  const provider = getEthersProvider()

  if (CROSS_CHAIN_MANAGER_ADDRESS.includes("PLACEHOLDER")) {
    console.warn("Using placeholder address for CCIP Router. Cannot get real fee.")
    return ethers.BigNumber.from(ethers.utils.parseEther("0.1")) // Dummy fee
  }

  try {
    const crossChainManager = new ethers.Contract(CROSS_CHAIN_MANAGER_ADDRESS, CROSS_CHAIN_MANAGER_ABI, provider)
    const fee = await crossChainManager.getFee(destinationChainSelector, receiver, ethers.utils.arrayify(message))
    return fee
  } catch (error) {
    console.error("Error getting CCIP message fee:", error)
    throw new Error("Failed to get CCIP message fee.")
  }
}
