import { Request, Response } from "express"
import {
  getStockBySymbol,
  getMultipleStocks,
} from "../services/stockSearchService"
import { StatusCodes } from "../utils/statusCodes"
import { sendSuccessResponse } from "../utils/sendSuccessResponse"
import createError from "http-errors"

// 특정 주식 데이터 가져오기
export const getStockBySymbolController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { symbol } = req.params

  const stockData = await getStockBySymbol(symbol)
  console.log(stockData, ":stockData")
  sendSuccessResponse(
    res,
    `${symbol} 주식을 검색했습니다.`,
    stockData,
    StatusCodes.OK,
  )
}

// 여러 주식 데이터 가져오기
export const getMultipleStocksController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { symbols } = req.query

  if (!symbols) {
    throw createError(StatusCodes.BAD_REQUEST, "모든 필드를 입력해야 합니다.")
  }

  const stockData = await getMultipleStocks((symbols as string).split(","))
  sendSuccessResponse(
    res,
    `모든 주식을 검색했습니다.`,
    stockData,
    StatusCodes.OK,
  )
}
