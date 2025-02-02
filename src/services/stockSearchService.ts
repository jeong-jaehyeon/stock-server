import axios from "axios"

const BASE_URL = "https://api.twelvedata.com" // Twelve Data API 기본 URL
const API_KEY = process.env.TWELVE_DATA_API_KEY // 환경 변수에서 API 키 가져오기

// 모든 주식 정보 가져오기 (Twelve Data는 종목 리스트를 제공하지 않음 -> 특정 종목별 조회 필요)
export const getStockBySymbol = async (symbol: string) => {
  if (!symbol) {
    throw new Error("주식 심볼을 입력하세요.")
  }

  try {
    console.log("[getStockBySymbol] 실행")
    // 실시간 주식 데이터 요청
    const response = await axios.get(BASE_URL, {
      params: {
        symbol,
        apikey: API_KEY,
      },
    })

    console.log(response, ":[getStockBySymbol] response")

    if (!response.data || response.data.status === "error") {
      throw new Error("해당 주식을 찾을 수 없습니다.")
    }

    return {
      symbol: response.data.symbol,
      name: response.data.name,
      price: parseFloat(response.data.close),
      currency: response.data.currency,
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
