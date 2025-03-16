import { Request, Response } from "express"
import {
  addStockToPortfolioService,
  deleteStockFromPortfolioService,
  sellStockFromPortfolioService,
  getPortfolioSummaryService,
} from "../services/portfolioService"
import createError from "http-errors"

// 포트폴리오에 주식 추가 컨트롤러
export const addStockToPortfolio = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { symbol, name, buyPrice, quantity } = req.body

  if (!symbol || !name || buyPrice === undefined || quantity === undefined) {
    res.status(400).json({ message: "모든 필드를 입력해야 합니다." })
    return
  }

  // ✅ 수량과 매수 단가에 대한 유효성 검사
  if (quantity <= 0) {
    // quantity 0일때는 안들어옴 -1 일때는 들어옴 확인하기.
    throw createError(400, "수량은 0보다 커야 합니다.")
  }

  if (buyPrice <= 0) {
    throw createError(400, "매수 단가는 0보다 커야 합니다.")
  }

  const addedStock = await addStockToPortfolioService(
    symbol,
    name,
    buyPrice,
    quantity,
  )

  res.status(201).json(addedStock)
}

// ✅ 주식 매도 컨트롤러 (이름 변경: sellStockFromPortfolio)
export const sellStockFromPortfolio = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { symbol } = req.params
  const { sellPrice, quantity } = req.body

  if (!symbol || sellPrice === undefined || quantity === undefined) {
    res
      .status(400)
      .json({ message: "symbol, sellPrice, quantity는 필수 입력값입니다." })
    return
  }

  // ✅ 수량과 가격 유효성 검사
  if (quantity <= 0) {
    throw createError(400, "매도 수량은 0보다 커야 합니다.")
  }

  if (sellPrice <= 0) {
    throw createError(400, "매도 단가는 0보다 커야 합니다.")
  }

  const soldStock = await sellStockFromPortfolioService(
    symbol,
    Number(sellPrice),
    Number(quantity),
  )

  res.status(201).json(soldStock)
}

export const deleteStockFromPortfolio = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { symbol } = req.params

  const result = await deleteStockFromPortfolioService(symbol)

  if (result.message.includes("존재하지 않습니다")) {
    throw createError(404, "존재하지 않는 주식은 삭제할 수 없습니다.")
  }

  res.status(200).json(result)
}

export const getPortfolioSummary = async (req: Request, res: Response) => {
  const summary = await getPortfolioSummaryService()
  res.status(200).json(summary)
}
