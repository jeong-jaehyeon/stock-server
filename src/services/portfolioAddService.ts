import Portfolio from "../models/Portfolio"

// 포트폴리오에 주식 추가 (기존 주식이면 평균 매수 단가 업데이트)
export const addStockToPortfolioService = async (
  stockSymbol: string,
  stockName: string,
  buyPrice: number,
  quantity: number,
) => {
  // 기존에 있는 주식인지 확인
  // 이미 보유 중인 주식인지 확인
  const existingStock = await Portfolio.findOne({ where: { stockSymbol } })

  if (existingStock) {
    // 이미 보유 중인 주식이면 개수와 평균 매수 단가 업데이트
    const newTotalQuantity = existingStock.quantity + quantity
    // (기존 총 금액 + 신규 매수 금액) ÷ 총 보유 주식 수
    const newBuyPrice =
      (existingStock.buyPrice * existingStock.quantity + buyPrice * quantity) /
      newTotalQuantity

    existingStock.quantity = newTotalQuantity
    existingStock.buyPrice = newBuyPrice
    await existingStock.save()

    return existingStock
  }

  // 새 주식 추가
  return await Portfolio.create({ stockSymbol, stockName, buyPrice, quantity })
}
