import type { Sequelize } from "sequelize"
import { Portfolio as _Portfolio } from "./Portfolio"
import type {
  PortfolioAttributes,
  PortfolioCreationAttributes,
} from "./Portfolio"
import { TradeHistory as _TradeHistory } from "./TradeHistory"
import type {
  TradeHistoryAttributes,
  TradeHistoryCreationAttributes,
} from "./TradeHistory"
import { User as _User } from "./User"
import type { UserAttributes, UserCreationAttributes } from "./User"

export { _Portfolio as Portfolio, _TradeHistory as TradeHistory, _User as User }

export type {
  PortfolioAttributes,
  PortfolioCreationAttributes,
  TradeHistoryAttributes,
  TradeHistoryCreationAttributes,
  UserAttributes,
  UserCreationAttributes,
}

export function initModels(sequelize: Sequelize) {
  const Portfolio = _Portfolio.initModel(sequelize)
  const TradeHistory = _TradeHistory.initModel(sequelize)
  const User = _User.initModel(sequelize)

  TradeHistory.belongsTo(Portfolio, {
    as: "portfolio",
    foreignKey: "portfolioId",
  })
  Portfolio.hasMany(TradeHistory, {
    as: "trade_histories",
    foreignKey: "portfolioId",
  })
  Portfolio.belongsTo(User, { as: "user", foreignKey: "userId" })
  User.hasMany(Portfolio, { as: "portfolios", foreignKey: "userId" })

  return {
    Portfolio: Portfolio,
    TradeHistory: TradeHistory,
    User: User,
  }
}
