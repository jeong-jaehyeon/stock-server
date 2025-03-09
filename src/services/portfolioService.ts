import Portfolio from "../models/Portfolio"
import TradeHistory from "../models/TradeHistory"

// 포트폴리오에 주식 매수 (기존 주식이면 평균 매수 단가 업데이트)
export const addStockToPortfolioService = async (
  symbol: string,
  name: string,
  buyPrice: number,
  quantity: number,
) => {
  try {
    console.log("[addStockToPortfolioService] 실행")
    // 기존에 있는 주식인지 확인
    // 이미 보유 중인 주식인지 확인
    const existingStock = await Portfolio.findOne({ where: { symbol } })

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
      return existingStock
    }

    // ✅ 신규 주식 추가
    const newStock = await Portfolio.create({
      symbol, // ✅ 변경된 필드명
      name, // ✅ 변경된 필드명
      buyPrice,
      quantity,
    })

    return newStock
  } catch (error) {
    console.error("Error adding stock to portfolio:", error)
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

    // 1️⃣ 해당 주식이 포트폴리오에 있는지 확인
    const existingStock = await Portfolio.findOne({ where: { symbol } })
    if (!existingStock) {
      throw new Error("포트폴리오에 해당 주식이 없습니다.")
    }

    // 2️⃣ 보유 수량보다 많이 매도하려는 경우 오류
    if (existingStock.quantity < quantity) {
      throw new Error("보유 수량보다 많은 수량을 매도할 수 없습니다.")
    }

    // 3️⃣ 손익 계산 (수익 또는 손실)
    // 판매 가격(sellPrice)과 매수 가격(buyPrice)의 차이를 계산한 후, 매도한 수량(quantity)만큼 곱하는 공식
    const profitLoss = (sellPrice - existingStock.buyPrice) * quantity

    // 4️⃣ 매도 기록 저장 (trade_history 테이블)
    await TradeHistory.create({
      symbol,
      name: existingStock.name,
      sellPrice,
      quantity,
      profitLoss,
    })

    // 5️⃣ 보유 수량 업데이트 또는 삭제
    if (existingStock.quantity === quantity) {
      await existingStock.destroy() // 전량 매도 시 삭제
      return {
        message: `${symbol} 주식을 ${quantity}개 매도 완료. (전량 매도)`,
      }
    }

    // 현재 보유 수량에서 매도한 만큼 빼고 업데이트
    existingStock.quantity -= quantity
    await existingStock.save()

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
