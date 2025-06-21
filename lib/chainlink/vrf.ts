import { ethers } from "ethers"
import { getEthersProvider, getEthersSigner } from "../web3-client"

// --- ALAMAT KONTRAK RANDOM TX SCHEDULER ---
// GANTI DENGAN ALAMAT YANG BENAR UNTUK JARINGAN ANDA!
const RANDOM_TX_SCHEDULER_ADDRESS = "0xPLACEHOLDER_RANDOM_TX_SCHEDULER_ADDRESS" // Replace with the deployed address of RandomTxScheduler.sol

// ABI untuk berinteraksi dengan RandomTxScheduler
const RANDOM_TX_SCHEDULER_ABI = [
  "function requestRandomness(uint256 minDelay, uint256 maxDelay) external returns (uint256 requestId)",
  // Tambahkan fungsi lain yang relevan
]

/**
 * Meminta penjadwalan transaksi acak menggunakan kontrak RandomTxScheduler.
 * @param {number} minDelay Penundaan minimum dalam detik.
 * @param {number} maxDelay Penundaan maksimum dalam detik.
 * @returns {Promise<string>} ID permintaan.
 */
export async function requestRandomTxSchedule(minDelay: number, maxDelay: number): Promise<string> {
  const provider = getEthersProvider()
  const signer = getEthersSigner()

  if (RANDOM_TX_SCHEDULER_ADDRESS.includes("PLACEHOLDER")) {
    console.warn(
      "Using placeholder address for Random Tx Scheduler. Please update with a real Random Tx Scheduler address.",
    )
    return "0xSIMULATED_REQUEST_ID"
  }

  try {
    const randomTxScheduler = new ethers.Contract(RANDOM_TX_SCHEDULER_ADDRESS, RANDOM_TX_SCHEDULER_ABI, signer)

    // Panggil fungsi requestRandomness pada kontrak
    const tx = await randomTxScheduler.requestRandomness(minDelay, maxDelay)
    const receipt = await tx.wait()

    // Dapatkan ID permintaan dari log transaksi
    const requestId = receipt.events?.[0].args?.requestId.toString() || "0xSIMULATED_REQUEST_ID"
    return requestId
  } catch (error) {
    console.error("Error requesting random transaction schedule:", error)
    throw new Error("Failed to request random transaction schedule.")
  }
}
