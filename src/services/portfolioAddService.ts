import Portfolio from "../models/Portfolio"

// 포트폴리오에 주식 추가 (기존 주식이면 평균 매수 단가 업데이트)
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
