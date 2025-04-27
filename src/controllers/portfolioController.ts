import { Request, Response } from "express"
import {
  addStockToPortfolioService,
  deleteStockFromPortfolioService,
  sellStockFromPortfolioService,
  getPortfolioSummaryService,
  getUserPortfolioService,
} from "@services/portfolioService"
import createError from "http-errors"
import { StatusCodes } from "@utils/statusCodes"
import { sendSuccessResponse } from "@utils/sendSuccessResponse"
import { UserPayload } from "types/custom"

interface AuthenticatedRequest extends Request {
  user?: UserPayload
}

export const getUserPortfolio = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> => {
  const userId = req.user?.id
  if (!userId) {
    throw createError(StatusCodes.UNAUTHORIZED, "인증된 사용자가 아닙니다.")
  }

  const portfolio = await getUserPortfolioService(userId)

  sendSuccessResponse(
    res,
    `사용자의 포트폴리오를 조회하였습니다.`, // 이메일 혹은 이름 가져와서 넣어도 괜찮을 듯
    portfolio,
    StatusCodes.OK,
  )
}

// ✅ 주식 매수 컨트롤러
export const addStockToPortfolio = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> => {
  const { symbol, name, buyPrice, quantity } = req.body

  if (!symbol || !name || buyPrice === undefined || quantity === undefined) {
    throw createError(StatusCodes.BAD_REQUEST, "모든 필드를 입력해야 합니다.")
  }

  if (quantity <= 0) {
    throw createError(StatusCodes.BAD_REQUEST, "수량은 0보다 커야 합니다.")
  }

  if (buyPrice <= 0) {
    throw createError(StatusCodes.BAD_REQUEST, "매수 단가는 0보다 커야 합니다.")
  }

  const userId = req.user?.id

  if (!userId) {
    throw createError(StatusCodes.UNAUTHORIZED, "로그인이 필요합니다.")
  }

  const addedStock = await addStockToPortfolioService(
    userId,
    symbol,
    name,
    buyPrice,
    quantity,
  )

  sendSuccessResponse(
    res,
    `${symbol} 주식을 포트폴리오에 매수하였습니다.`,
    addedStock,
    StatusCodes.CREATED,
  )
}

// ✅ 주식 매도 컨트롤러
export const sellStockFromPortfolio = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> => {
  const { symbol } = req.params
  const { sellPrice, quantity } = req.body

  if (!symbol || sellPrice === undefined || quantity === undefined) {
    throw createError(
      StatusCodes.BAD_REQUEST,
      "symbol, sellPrice, quantity는 필수 입력값입니다.",
    )
  }

  if (quantity <= 0) {
    throw createError(StatusCodes.BAD_REQUEST, "매도 수량은 0보다 커야 합니다.")
  }

  if (sellPrice <= 0) {
    throw createError(StatusCodes.BAD_REQUEST, "매도 단가는 0보다 커야 합니다.")
  }

  const userId = req.user?.id

  if (!userId) {
    throw createError(StatusCodes.UNAUTHORIZED, "로그인이 필요합니다.")
  }

  const soldStock = await sellStockFromPortfolioService(
    userId,
    symbol,
    Number(sellPrice),
    Number(quantity),
  )

  sendSuccessResponse(
    res,
    `${symbol} 주식을 ${quantity}개 매도했습니다.`,
    soldStock,
    StatusCodes.CREATED,
  )
}

// ✅ 주식 삭제 컨트롤러
export const deleteStockFromPortfolio = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> => {
  const { symbol } = req.params
  const userId = req.user?.id

  if (!userId) {
    throw createError(StatusCodes.UNAUTHORIZED, "로그인이 필요합니다.")
  }

  const result = await deleteStockFromPortfolioService(userId, symbol)

  if (result.message.includes("존재하지 않습니다")) {
    throw createError(
      StatusCodes.NOT_FOUND,
      "존재하지 않는 주식은 삭제할 수 없습니다.",
    )
  }

  sendSuccessResponse(res, result.message, result)
}

// ✅ 포트폴리오 요약 조회 컨트롤러
export const getPortfolioSummary = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> => {
  const userId = req.user?.id

  if (!userId) {
    throw createError(StatusCodes.UNAUTHORIZED, "로그인이 필요합니다.")
  }

  const summary = await getPortfolioSummaryService(userId)

  sendSuccessResponse(res, "포트폴리오 요약 조회 성공", summary)
}
