import { Request, Response } from "express"
import { addStockToPortfolioService } from "../services/portfolioAddService"

// 포트폴리오에 주식 추가 컨트롤러
export const addStockToPortfolio = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { symbol, name, buyPrice, quantity } = req.body

    if (!symbol || !name || !buyPrice || !quantity) {
      res.status(400).json({ message: "모든 필드를 입력해야 합니다." })
      return
    }

    const addedStock = await addStockToPortfolioService(
      symbol,
      name,
      buyPrice,
      quantity,
    )

    res.status(201).json(addedStock)
    return
  } catch (error) {
    console.error("Error adding stock to portfolio:", error)
    res.status(500).json({ error: "Internal server error" })
  }
}
