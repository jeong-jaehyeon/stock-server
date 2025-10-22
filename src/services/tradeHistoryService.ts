import { TradeHistory } from "@models/TradeHistory"
import { Portfolio } from "@models/Portfolio"
import logger from "@utils/logger"

export const getUserTradeHistoryService = async (userId: number) => {
  try {
    logger.info(`[getUserTradeHistoryService] userId: ${userId}`)

    const trades = await TradeHistory.findAll({
      include: [
        {
          model: Portfolio,
          as: "portfolio",
          where: { userId },
          attributes: [],
        },
      ],
      order: [["createdAt", "DESC"]],
    })

    return trades
  } catch (error) {
    logger.error("Error fetching trade history:", error)
    throw new Error("거래 내역 조회 중 오류 발생")
  }
}

export const getUserTradeHistoryBySymbolService = async (
  userId: number,
  symbol: string,
) => {
  try {
    logger.info(
      `[getUserTradeHistoryBySymbolService] userId: ${userId}, symbol: ${symbol}`,
    )

    const trades = await TradeHistory.findAll({
      where: { symbol },
      include: [
        {
          model: Portfolio,
          as: "portfolio",
          where: { userId },
          attributes: [],
        },
      ],
      order: [["createdAt", "DESC"]],
    })

    return trades
  } catch (error) {
    logger.error("Error fetching trade history by symbol:", error)
    throw new Error("거래 내역 조회 중 오류 발생")
  }
}
