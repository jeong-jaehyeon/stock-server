import { Request, Response } from "express"
import {
  addStockToPortfolioService,
  deleteStockFromPortfolioService,
  sellStockFromPortfolioService,
  getPortfolioSummaryService,
} from "../services/portfolioService"
import createError from "http-errors"
import { sendSuccessResponse } from "../utils/sendSuccessResponse"

// ✅ 주식 매수 컨트롤러
export const addStockToPortfolio = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  const { symbol, name, buyPrice, quantity } = req.body

  if (!symbol || !name || buyPrice === undefined || quantity === undefined) {
    throw createError(400, "모든 필드를 입력해야 합니다.")
  }

  if (quantity <= 0) {
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

  return sendSuccessResponse(
    res,
    `${symbol} 주식을 포트폴리오에 매수하였습니다.`,
    addedStock,
    201,
  )
}

// ✅ 주식 매도 컨트롤러
export const sellStockFromPortfolio = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  const { symbol } = req.params
  const { sellPrice, quantity } = req.body

  if (!symbol || sellPrice === undefined || quantity === undefined) {
    throw createError(400, "symbol, sellPrice, quantity는 필수 입력값입니다.")
  }

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

  return sendSuccessResponse(
    res,
    `${symbol} 주식을 ${quantity}개 매도했습니다.`,
    soldStock,
    201,
  )
}

// ✅ 주식 삭제 컨트롤러
export const deleteStockFromPortfolio = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  const { symbol } = req.params

  const result = await deleteStockFromPortfolioService(symbol)

  if (result.message.includes("존재하지 않습니다")) {
    throw createError(404, "존재하지 않는 주식은 삭제할 수 없습니다.")
  }

  return sendSuccessResponse(res, result.message, result)
}

// ✅ 포트폴리오 요약 조회 컨트롤러
export const getPortfolioSummary = async (
  _req: Request,
  res: Response,
): Promise<Response> => {
  const summary = await getPortfolioSummaryService()
  return sendSuccessResponse(res, "포트폴리오 요약 조회 성공", summary)
}
