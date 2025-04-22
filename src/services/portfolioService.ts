import Portfolio from "../models/Portfolio"
import TradeHistory from "../models/TradeHistory"
import { getStockPriceFromAPI } from "./stockSearchService"
import logger from "@utils/logger" // pino 로거 import

// 포트폴리오에 주식 매수 (기존 주식이면 평균 매수 단가 업데이트)
export const addStockToPortfolioService = async (
  userId: number,
  symbol: string,
  name: string,
  buyPrice: number,
  quantity: number,
) => {
  try {
    logger.info(
      `[addStockToPortfolioService] 실행 - ${symbol}, ${quantity}개 추가`,
    )
    // 기존에 있는 주식인지 확인
    // 이미 보유 중인 주식인지 확인
    let existingStock = await Portfolio.findOne({ where: { symbol } })

    if (existingStock) {
      // 이미 보유 중인 주식이면 개수와 평균 매수 단가 업데이트
      const newTotalQuantity = existingStock.quantity + quantity
      // (기존 총 금액 + 신규 매수 금액) ÷ 총 보유 주식 수
      const newBuyPrice =
        (existingStock.buyPrice * existingStock.quantity +
          buyPrice * quantity) /
        newTotalQuantity

      existingStock.buyPrice = newBuyPrice
      existingStock.quantity = newTotalQuantity
      await existingStock.save()
    } else {
      // ✅ 3. 존재하지 않으면 새로 추가
      existingStock = await Portfolio.create({
        userId,
        symbol,
        name,
        buyPrice,
        quantity,
      })
      logger.info(`[${symbol}] 신규 주식 추가 완료`)
    }

    // ✅ 매수 기록을 trade_history에 추가
    // 매번 새로운 거래가 발생하면, 기존 데이터를 수정하는 게 아니라 새로운 거래 기록을 남겨야 함.
    // 주식 매매는 독립적인 이벤트라서 기존 데이터를 업데이트하는 것이 아니라, 새로운 행(row)을 추가하는 게 맞음.
    await TradeHistory.create({
      symbol,
      name,
      tradeType: "BUY", // ✅ 매수 기록 추가
      tradePrice: buyPrice,
      quantity,
      portfolioId: existingStock.id, // ✅ portfolioId 추가
    })
    logger.info(`[${symbol}] 매수 기록 생성 완료 (수량: ${quantity})`)
    return { message: `${symbol} 주식을 ${quantity}개 매수 완료.` }
  } catch (error) {
    logger.error("Error adding stock to portfolio:", error)
    throw new Error("포트폴리오에 주식을 추가하는 중 오류 발생")
  }
}

// ✅ 포트폴리오에서 주식 매도 (일부 또는 전체)
export const sellStockFromPortfolioService = async (
  symbol: string,
  sellPrice: number,
  quantity: number,
) => {
  try {
    console.log(
      `[sellStockFromPortfolioService] 실행 - symbol: ${symbol}, quantity: ${quantity}`,
    )

    // 1️⃣ 포트폴리오에서 해당 주식 조회
    const existingStock = await Portfolio.findOne({ where: { symbol } })
    if (!existingStock) {
      throw new Error(`${symbol} 주식이 포트폴리오에 없습니다.`)
    }

    // 2️⃣ 보유한 주식 수량보다 많이 팔 수 없음
    if (existingStock.quantity < quantity) {
      throw new Error(
        `보유 수량(${existingStock.quantity})보다 많이 매도할 수 없습니다.`,
      )
    }

    // 3️⃣ 손익 계산 (수익 또는 손실)
    // 판매 가격(sellPrice)과 매수 가격(buyPrice)의 차이를 계산한 후, 매도한 수량(quantity)만큼 곱하는 공식
    const profitLoss = (sellPrice - existingStock.buyPrice) * quantity

    // 4️⃣ 매도 기록 저장 (trade_history 테이블)
    // 매번 새로운 거래가 발생하면, 기존 데이터를 수정하는 게 아니라 새로운 거래 기록을 남겨야 함.
    // 주식 매매는 독립적인 이벤트라서 기존 데이터를 업데이트하는 것이 아니라, 새로운 행(row)을 추가하는 게 맞음.
    await TradeHistory.create({
      symbol,
      name: existingStock.name,
      tradeType: "SELL", // ✅ 매도 기록 추가
      tradePrice: sellPrice,
      quantity,
      profitLoss, // 수익/손실 추가
      portfolioId: existingStock.id, // ✅ portfolioId 추가
    })

    // 5️⃣ 보유 수량 업데이트 또는 삭제
    if (existingStock.quantity === quantity) {
      await existingStock.destroy() // 포트폴리오에서 삭제
    } else {
      existingStock.quantity -= quantity
      await existingStock.save() // 남은 수량 저장
    }
    // 프론트에서 "AAPL 주식을 5개 매도 완료. 총 수익: 50달러" 같은 메시지를 띄울 수 있게 리턴
    return {
      message: `${symbol} 주식을 ${quantity}개 매도 완료.`,
      remainingQuantity: existingStock.quantity,
      profitLoss,
    }
  } catch (error) {
    console.error("Error selling stock:", error)
    throw new Error("포트폴리오에서 주식을 매도하는 중 오류 발생")
  }
}

export const deleteStockFromPortfolioService = async (symbol: string) => {
  const existingStock = await Portfolio.findOne({ where: { symbol } })

  if (!existingStock) {
    return {
      message: `${symbol} 주식이 존재하지 않습니다.`,
    }
  }

  // ✅ 해당 주식의 거래 기록 먼저 삭제
  await TradeHistory.destroy({ where: { symbol: symbol } })

  // ✅ 포트폴리오에서 주식 삭제
  await existingStock.destroy()

  return {
    message: `${symbol} 주식을 삭제 완료.`,
  }
}

/**
 * ✅ 포트폴리오 요약 서비스
 * - 사용자의 포트폴리오에 있는 모든 주식의 현재 가치와 손익을 계산하여 반환
 */
export const getPortfolioSummaryService = async () => {
  // 포트폴리오에 등록된 모든 주식 가져오기
  const portfolios = await Portfolio.findAll()

  // 각 주식의 현재가와 손익을 계산하여 반환
  return await Promise.all(
    portfolios.map(async (stock) => {
      // ✅ Twelve Data API를 통해 실시간 주가 가져오기
      const currentPrice = await getStockPriceFromAPI(stock.symbol)

      // ✅ 손익 계산: (현재가 - 매수 단가) * 수량
      const profitLoss = (currentPrice - stock.buyPrice) * stock.quantity

      return {
        symbol: stock.symbol,
        name: stock.name,
        quantity: stock.quantity,
        buyPrice: stock.buyPrice,
        currentPrice,
        profitLoss,
      }
    }),
  )
}
