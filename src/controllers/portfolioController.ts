import { Request, Response } from "express"
import {
  addStockToPortfolioService,
  deleteStockFromPortfolioService,
  sellStockFromPortfolioService,
} from "../services/portfolioService"

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

// ✅ 주식 매도 컨트롤러 (이름 변경: sellStockFromPortfolio)
export const sellStockFromPortfolio = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { symbol } = req.params
    const { sellPrice, quantity } = req.body

    if (!symbol || !sellPrice || !quantity) {
      res
        .status(400)
        .json({ message: "symbol, sellPrice, quantity는 필수 입력값입니다." })
      return
    }

    const result = await sellStockFromPortfolioService(
      symbol,
      Number(sellPrice),
      Number(quantity),
    )
    res.status(200).json(result)
    return
  } catch (error) {
    console.error("Error selling stock:", error)
    res.status(500).json({ message: "서버 오류 발생" })
    return
  }
}

export const deleteStockFromPortfolio = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { symbol } = req.params

  try {
    const result = await deleteStockFromPortfolioService(symbol)

    if (result.message.includes("존재하지 않습니다")) {
      res.status(404).json(result)
      return
    }

    res.status(200).json(result)
    return
  } catch (error) {
    console.error("Error deleting stock from portfolio:", error)
    res
      .status(500)
      .json({ message: "포트폴리오에서 주식을 삭제하는데 실패했습니다." })
    return
  }
}
