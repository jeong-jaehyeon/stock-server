import { Request, Response } from "express"
import {
  getStockBySymbol,
  getMultipleStocks,
} from "../services/stockSearchService"

// 특정 주식 데이터 가져오기
export const getStockBySymbolController = async (
  req: Request,
  res: Response,
) => {
  const { symbol } = req.params

  try {
    const stockData = await getStockBySymbol(symbol)
    console.log(stockData, ":stockData")
    res.status(200).json(stockData)
  } catch (error) {
    console.error(`Error fetching stock data for symbol: ${symbol}`, error)
    res.status(500).json({
      message: `Failed to fetch stock data for symbol: ${symbol}`,
      error: error instanceof Error ? error.message : error,
    })
  }
}

// 여러 주식 데이터 가져오기
export const getMultipleStocksController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { symbols } = req.query

  if (!symbols) {
    res.status(400).json({ message: "Symbols query parameter is required" })
    return
  }

  try {
    const stockData = await getMultipleStocks((symbols as string).split(","))
    res.status(200).json(stockData)
  } catch (error) {
    console.error("Error fetching multiple stocks data:", error)
    res.status(500).json({
      message: "Failed to fetch multiple stocks data",
      error: error instanceof Error ? error.message : error,
    })
  }
}
