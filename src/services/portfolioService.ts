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
    console.log(
      `[addStockToPortfolioService] 실행 - ${symbol}, ${quantity}개 추가`,
    )
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
    } else {
      // ✅ 새로운 주식이면 포트폴리오에 추가
      await Portfolio.create({ symbol, name, buyPrice, quantity })
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
    })

    return { message: `${symbol} 주식을 ${quantity}개 매수 완료.` }
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
