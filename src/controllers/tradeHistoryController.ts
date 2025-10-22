import { Request, Response } from "express"
import {
  getUserTradeHistoryService,
  getUserTradeHistoryBySymbolService,
} from "@services/tradeHistoryService"
import createError from "http-errors"
import { StatusCodes } from "@utils/statusCodes"
import { sendSuccessResponse } from "@utils/sendSuccessResponse"
import { UserPayload } from "types/custom"

interface AuthenticatedRequest extends Request {
  user?: UserPayload
}

export const getUserTradeHistory = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> => {
  const userId = req.user?.id

  if (!userId) {
    throw createError(StatusCodes.UNAUTHORIZED, "인증된 사용자가 아닙니다.")
  }

  const trades = await getUserTradeHistoryService(userId)

  sendSuccessResponse(
    res,
    "거래 내역 조회 성공",
    trades,
    StatusCodes.OK,
  )
}

export const getUserTradeHistoryBySymbol = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> => {
  const userId = req.user?.id
  const { symbol } = req.params

  if (!userId) {
    throw createError(StatusCodes.UNAUTHORIZED, "인증된 사용자가 아닙니다.")
  }

  if (!symbol) {
    throw createError(StatusCodes.BAD_REQUEST, "종목 심볼은 필수입니다.")
  }

  const trades = await getUserTradeHistoryBySymbolService(userId, symbol)

  sendSuccessResponse(
    res,
    `${symbol} 거래 내역 조회 성공`,
    trades,
    StatusCodes.OK,
  )
}
