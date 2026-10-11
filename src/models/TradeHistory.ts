import * as Sequelize from "sequelize"
import { DataTypes, Model, Optional } from "sequelize"
import type { Portfolio, PortfolioId } from "./Portfolio"

export interface TradeHistoryAttributes {
  id: number
  portfolioId: number
  symbol: string
  name: string
  tradeType: "BUY" | "SELL"
  tradePrice: number
  quantity: number
  profitLoss?: number
  createdAt: Date
  updatedAt: Date
}

export type TradeHistoryPk = "id"
export type TradeHistoryId = TradeHistory[TradeHistoryPk]
export type TradeHistoryOptionalAttributes =
  | "id"
  | "profitLoss"
  | "createdAt"
  | "updatedAt"
export type TradeHistoryCreationAttributes = Optional<
  TradeHistoryAttributes,
  TradeHistoryOptionalAttributes
>

export class TradeHistory
  extends Model<TradeHistoryAttributes, TradeHistoryCreationAttributes>
  implements TradeHistoryAttributes
{
  declare id: number
  declare portfolioId: number
  declare symbol: string
  declare name: string
  tradeType!: "BUY" | "SELL"
  declare tradePrice: number
  declare quantity: number
  profitLoss?: number
  declare createdAt: Date
  declare updatedAt: Date

  // TradeHistory belongsTo Portfolio via portfolioId
  declare portfolio: Portfolio
  getPortfolio!: Sequelize.BelongsToGetAssociationMixin<Portfolio>
  setPortfolio!: Sequelize.BelongsToSetAssociationMixin<Portfolio, PortfolioId>
  createPortfolio!: Sequelize.BelongsToCreateAssociationMixin<Portfolio>

  static initModel(sequelize: Sequelize.Sequelize): typeof TradeHistory {
    return TradeHistory.init(
      {
        id: {
          autoIncrement: true,
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
        },
        portfolioId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: "portfolios",
            key: "id",
          },
        },
        symbol: {
          type: DataTypes.STRING(255),
          allowNull: false,
        },
        name: {
          type: DataTypes.STRING(255),
          allowNull: false,
        },
        tradeType: {
          type: DataTypes.ENUM("BUY", "SELL"),
          allowNull: false,
        },
        tradePrice: {
          type: DataTypes.FLOAT,
          allowNull: false,
        },
        quantity: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        profitLoss: {
          type: DataTypes.FLOAT,
          allowNull: true,
        },

        createdAt: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        updatedAt: {
          type: DataTypes.DATE,
          allowNull: false,
        },
      },
      {
        sequelize,
        tableName: "trade_history",
        timestamps: true,
      },
    )
  }
}
