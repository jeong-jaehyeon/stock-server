import Portfolio from "./Portfolio"
import TradeHistory from "./TradeHistory"
// 다른 모델들도 여기서 임포트합니다
// import AnotherModel from './AnotherModel';

const models = {
  Portfolio,
  TradeHistory,
  // 다른 모델들을 여기에 추가
  // AnotherModel,
}

// 관계 설정
Portfolio.hasMany(TradeHistory, {
  foreignKey: "portfolioId",
  onDelete: "CASCADE",
})
TradeHistory.belongsTo(Portfolio, {
  foreignKey: "portfolioId",
  onDelete: "CASCADE",
})

export { Portfolio, TradeHistory }

export default models
