import { ethers } from "ethers"

// Konfigurasi RPC URL dari environment variable
// Pastikan Anda memiliki NEXT_PUBLIC_RPC_URL di .env.local atau Vercel Environment Variables
const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL || "YOUR_DEFAULT_RPC_URL_HERE"

let provider: ethers.providers.JsonRpcProvider

/**
 * Menginisialisasi dan mengembalikan instance Ethers.js JsonRpcProvider.
 * Menggunakan singleton pattern untuk memastikan hanya ada satu instance provider.
 * @returns {ethers.providers.JsonRpcProvider} Instance Ethers.js provider.
 */
export function getEthersProvider(): ethers.providers.JsonRpcProvider {
  if (!provider) {
    if (!RPC_URL || RPC_URL === "YOUR_DEFAULT_RPC_URL_HERE") {
      console.warn(
        "NEXT_PUBLIC_RPC_URL is not set. Using a placeholder RPC URL. Please configure it for real integration.",
      )
      // Fallback to a public testnet RPC for demonstration if not set
      // Ganti 'YOUR_INFURA_PROJECT_ID' dengan ID proyek Infura atau Alchemy Anda
      provider = new ethers.providers.JsonRpcProvider("https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID")
    } else {
      provider = new ethers.providers.JsonRpcProvider(RPC_URL)
    }
  }
  return provider
}

// Anda juga bisa menambahkan fungsi untuk mendapatkan signer jika Anda perlu mengirim transaksi
// export function getEthersSigner(): ethers.Signer {
//   const provider = getEthersProvider();
//   // Ini akan membutuhkan koneksi ke wallet seperti MetaMask atau private key
//   // return provider.getSigner();
//   throw new Error("Signer not implemented for this example. Requires wallet connection.");
// }
