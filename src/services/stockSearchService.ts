import axios from "axios"
import createError from "http-errors"

const BASE_URL = "https://api.twelvedata.com/time_series" // Twelve Data API 기본 URL
const API_KEY = process.env.TWELVE_DATA_API_KEY // 환경 변수에서 API 키 가져오기
const BASE_PRICE_URL = "https://api.twelvedata.com/price" // Twelve Data API 기본 URL

// 모든 주식 정보 가져오기 (Twelve Data는 종목 리스트를 제공하지 않음 -> 특정 종목별 조회 필요)
export const getStockBySymbol = async (symbol: string) => {
  try {
    if (!symbol) {
      throw new Error("symbol 값이 없습니다.")
    }

    // 주식 데이터 요청
    const response = await axios.get(BASE_URL, {
      params: {
        symbol,
        apikey: API_KEY,
        interval: "1min",
        outputsize: 1, // 최근 1개의 데이터만 가져오기
      },
    })

    if (!response.data || response.data.status === "error") {
      throw new Error(
        `주식 데이터를 가져올 수 없습니다: ${response.data.message}`,
      )
    }

    const meta = response.data.meta
    const latestData = response.data.values?.[0] // 가장 최근 가격 데이터

    console.log(meta, ":meta")
    console.log(latestData, ":latestData")

    /*
    {
      datetime: '2025-01-31 15:59:00',
      open: '27.014999',
      high: '27.090000',
      low: '26.96000',
      close: '26.97000',
      volume: '1418646'
    }

    datetime	주식 데이터가 기록된 시간 (YYYY-MM-DD HH:mm:ss 형식)
    open	해당 시간 동안의 시가 (Opening Price)
    high	해당 시간 동안의 최고가 (Highest Price)
    low	해당 시간 동안의 최저가 (Lowest Price)
    close	해당 시간 동안의 종가 (Closing Price)
    volume	해당 시간 동안의 거래량 (Trading Volume, 주식이 거래된 수량)
     */

    if (!latestData) {
      throw new Error("주식 가격 정보를 가져올 수 없습니다.")
    }

    // ✅ 주식 심볼로 `name` 가져오기 (추가된 부분)
    const stockName = await getStockName(symbol)

    return {
      symbol: meta.symbol, // 주식 심볼
      name: stockName, // 가져온 주식 명칭
      price: parseFloat(latestData.close), // 최신 종가
      currency: meta.currency, // 통화 정보
      exchange: meta.exchange, // 거래소
    }
  } catch (error) {
    console.error("Error searching stock:", error)
    throw error
  }
}

// 예: 여러 종목 데이터를 가져오는 로직 추가
export const getMultipleStocks = async (symbols: string[]) => {
  try {
    // 여러 종목 심볼을 콤마로 연결하여 요청
    const response = await axios.get(`${BASE_URL}/time_series`, {
      params: {
        symbol: symbols.join(","), // 예: "AAPL,TSLA,MSFT"
        interval: "1min",
        apikey: API_KEY,
      },
    })

    return response.data // API 응답 데이터 반환
  } catch (error) {
    console.error("Error fetching multiple stocks:", error)
    throw error
  }
}

interface StockInfo {
  symbol: string
  name: string
  exchange: string
  currency: string
}

// ✅ 주식 심볼을 이용하여 주식의 정식 명칭(name) 가져오기
export const getStockName = async (symbol: string): Promise<string> => {
  const BASE_URL = "https://api.twelvedata.com"
  try {
    console.log(`[getStockName] 실행, 요청 심볼: ${symbol}`)

    const response = await axios.get(`${BASE_URL}/stocks`, {
      params: { apikey: API_KEY },
    })

    if (!response.data || !response.data.data) {
      throw new Error("주식 목록을 가져올 수 없습니다.")
    }

    // ✅ 주식 목록에서 해당 심볼(symbol)에 해당하는 name 찾기
    const stockInfo = response.data.data.find(
      (stock: StockInfo) => stock.symbol === symbol,
    )

    return stockInfo ? stockInfo.name : "Unknown" // name이 없으면 Unknown 반환
  } catch (error) {
    console.error("Error fetching stock name:", error)
    return "Unknown"
  }
}

/**
 * ✅ 특정 주식의 현재 가격을 Twelve Data API를 통해 가져오는 함수
 *
 * @param symbol - 주식 심볼 (예: AAPL, TSLA)
 * @returns 주식의 현재 가격 (숫자형)
 * @throws 404 에러 - API에서 해당 심볼의 주식 데이터를 찾지 못한 경우
 */
export const getStockPriceFromAPI = async (symbol: string): Promise<number> => {
  const response = await axios.get(BASE_PRICE_URL, {
    params: {
      symbol,
      apikey: API_KEY,
    },
  })

  // ✅ 주식 데이터가 없을 경우 에러 발생
  if (!response.data || !response.data.price) {
    throw createError(404, `주식 데이터가 존재하지 않습니다: ${symbol}`)
  }

  // ✅ price를 숫자형으로 반환
  return parseFloat(response.data.price)
}
