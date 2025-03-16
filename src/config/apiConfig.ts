import dotenv from "dotenv"

dotenv.config()

export const TWELVE_DATA_CONFIG = {
  BASE_URL: "https://api.twelvedata.com", // 고정된 URL은 config에서 관리
  PRICE_URL: "https://api.twelvedata.com/price",
  TIME_SERIES_URL: "https://api.twelvedata.com/time_series",
  STOCKS_URL: "https://api.twelvedata.com/stocks",
}
