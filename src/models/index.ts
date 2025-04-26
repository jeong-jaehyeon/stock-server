import * as Sequelize from "sequelize"
import { Portfolio } from "./Portfolio"
import { TradeHistory } from "./TradeHistory"
import { User } from "./User"
// 다른 모델들도 여기에 import

const sequelize = new Sequelize.Sequelize(
  process.env.DB_NAME!,
  process.env.DB_USER!,
  process.env.DB_PASSWORD!,
  {
    host: process.env.DB_HOST,
    dialect: "mariadb",
  },
)

// 모델 초기화 (init 호출)
Portfolio.initModel(sequelize)
TradeHistory.initModel(sequelize)
User.initModel(sequelize)

// 관계 설정
Portfolio.hasMany(TradeHistory, {
  foreignKey: "portfolioId",
  onDelete: "CASCADE",
})
TradeHistory.belongsTo(Portfolio, {
  foreignKey: "portfolioId",
  onDelete: "CASCADE",
})

const models = {
  Portfolio,
  TradeHistory,
  User,
}

export { Portfolio, TradeHistory, User }
export default models
export { sequelize } // 필요하면 sequelize 객체도 export
