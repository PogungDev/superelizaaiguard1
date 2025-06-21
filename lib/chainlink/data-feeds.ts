import { ethers } from "ethers"
// Import ABI dan Typechain dari @chainlink/contracts
// Anda mungkin perlu menjalankan `npx typechain --target ethers-v5 --out-dir typechain 'node_modules/@chainlink/contracts/abi/*.json'`
// atau mengimpor ABI secara langsung jika tidak menggunakan Typechain.
import { AggregatorV3Interface__factory } from "@chainlink/contracts/typechain/factories/AggregatorV3Interface__factory"
import { getEthersProvider } from "../web3-client"

// --- ALAMAT KONTRAK CHAINLINK PRICE FEED ---
// GANTI DENGAN ALAMAT YANG BENAR UNTUK JARINGAN ANDA!
// Contoh: ETH/USD di Sepolia: 0x694AA1769357215Ee4EfB405d263a5d35cC61bE7
const ETH_USD_PRICE_FEED_ADDRESS = "0xPLACEHOLDER_ETH_USD_PRICE_FEED_ADDRESS"
const BTC_USD_PRICE_FEED_ADDRESS = "0xPLACEHOLDER_BTC_USD_PRICE_FEED_ADDRESS"
const USDC_USD_PRICE_FEED_ADDRESS = "0xPLACEHOLDER_USDC_USD_PRICE_FEED_ADDRESS"

interface PriceFeedData {
  asset: string
  price: number
  timestamp: number
}

export async function getLatestPrice(assetPair: string): Promise<PriceFeedData> {
  const provider = getEthersProvider()
  let feedAddress: string

  switch (assetPair.toUpperCase()) {
    case "ETH/USD":
      feedAddress = ETH_USD_PRICE_FEED_ADDRESS
      break
    case "BTC/USD":
      feedAddress = BTC_USD_PRICE_FEED_ADDRESS
      break
    case "USDC/USD":
      feedAddress = USDC_USD_PRICE_FEED_ADDRESS
      break
    default:
      throw new Error(`Unsupported asset pair: ${assetPair}`)
  }

  if (feedAddress.includes("PLACEHOLDER")) {
    console.warn(`Using placeholder address for ${assetPair}. Please update with a real Chainlink Price Feed address.`)
    // Fallback for demonstration if address is not set
    return { asset: assetPair, price: Math.random() * 1000 + 1000, timestamp: Date.now() }
  }

  try {
    const priceFeed = AggregatorV3Interface__factory.connect(feedAddress, provider)
    const roundData = await priceFeed.latestRoundData()
    const decimals = await priceFeed.decimals()

    const price = Number.parseFloat(ethers.utils.formatUnits(roundData.answer, decimals))
    const timestamp = roundData.updatedAt.toNumber() * 1000 // Convert to milliseconds

    return { asset: assetPair, price, timestamp }
  } catch (error) {
    console.error(`Error fetching ${assetPair} price from Chainlink:`, error)
    throw new Error(`Failed to fetch price data for ${assetPair}.`)
  }
}
