import { Request, Response } from "express"
import { addStockToPortfolioService } from "../services/portfolioAddService"

// 포트폴리오에 주식 추가 컨트롤러
export const addStockToPortfolio = async (
  req: Request,
  res: Response,
): Promise<void> => {
  // 주식검색 api는 실제는 이거
  // {
  //   "symbol": "AAPL",
  //   "name": "Apple Inc.",
  //   "price": 235.86,
  //   "currency": "USD",
  //   "exchange": "NASDAQ"
  // }

  // 지금 받는다고 예상한건 이거
  /*
    {
    "stockSymbol": "AAPL",
    "stockName": "Apple Inc.",
    "buyPrice": 150.5,
    "quantity": 10
  }
   */
  try {
    const { stockSymbol, stockName, buyPrice, quantity } = req.body

    if (!stockSymbol || !stockName || !buyPrice || !quantity) {
      res.status(400).json({ error: "모든 필드를 입력해야 합니다." })
      return
    }

    const portfolioEntry = await addStockToPortfolioService(
      stockSymbol,
      stockName,
      buyPrice,
      quantity,
    )

    res.status(201).json(portfolioEntry) // ✅ res.json()만 호출하고 반환값 없음
  } catch (error) {
    console.error("Error adding stock to portfolio:", error)
    res.status(500).json({ error: "Internal server error" })
  }
}
