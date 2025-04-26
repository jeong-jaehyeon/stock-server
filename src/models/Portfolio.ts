import * as Sequelize from "sequelize"
import { DataTypes, Model, Optional } from "sequelize"
import type { TradeHistory, TradeHistoryId } from "./TradeHistory"
import type { User, UserId } from "./User"

export interface PortfolioAttributes {
  id: number
  symbol: string
  name: string
  buyPrice: number
  quantity: number
  userId: number
  createdAt: Date
  updatedAt: Date
}

export type PortfolioPk = "id"
export type PortfolioId = Portfolio[PortfolioPk]
export type PortfolioOptionalAttributes = "id" | "createdAt" | "updatedAt"
export type PortfolioCreationAttributes = Optional<
  PortfolioAttributes,
  PortfolioOptionalAttributes
>

export class Portfolio
  extends Model<PortfolioAttributes, PortfolioCreationAttributes>
  implements PortfolioAttributes
{
  declare id: number
  declare symbol: string
  declare name: string
  declare buyPrice: number
  declare quantity: number
  declare userId: number
  declare createdAt: Date
  declare updatedAt: Date

  // Portfolio hasMany TradeHistory via portfolioId
  declare trade_histories: TradeHistory[]
  getTrade_histories!: Sequelize.HasManyGetAssociationsMixin<TradeHistory>
  setTrade_histories!: Sequelize.HasManySetAssociationsMixin<
    TradeHistory,
    TradeHistoryId
  >
  addTrade_history!: Sequelize.HasManyAddAssociationMixin<
    TradeHistory,
    TradeHistoryId
  >
  addTrade_histories!: Sequelize.HasManyAddAssociationsMixin<
    TradeHistory,
    TradeHistoryId
  >
  createTrade_history!: Sequelize.HasManyCreateAssociationMixin<TradeHistory>
  removeTrade_history!: Sequelize.HasManyRemoveAssociationMixin<
    TradeHistory,
    TradeHistoryId
  >
  removeTrade_histories!: Sequelize.HasManyRemoveAssociationsMixin<
    TradeHistory,
    TradeHistoryId
  >
  hasTrade_history!: Sequelize.HasManyHasAssociationMixin<
    TradeHistory,
    TradeHistoryId
  >
  hasTrade_histories!: Sequelize.HasManyHasAssociationsMixin<
    TradeHistory,
    TradeHistoryId
  >
  countTrade_histories!: Sequelize.HasManyCountAssociationsMixin
  // Portfolio belongsTo User via userId
  declare user: User
  getUser!: Sequelize.BelongsToGetAssociationMixin<User>
  setUser!: Sequelize.BelongsToSetAssociationMixin<User, UserId>
  createUser!: Sequelize.BelongsToCreateAssociationMixin<User>

  static initModel(sequelize: Sequelize.Sequelize): typeof Portfolio {
    return Portfolio.init(
      {
        id: {
          autoIncrement: true,
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
        },
        symbol: {
          type: DataTypes.STRING(255),
          allowNull: false,
        },
        name: {
          type: DataTypes.STRING(255),
          allowNull: false,
        },
        buyPrice: {
          type: DataTypes.FLOAT,
          allowNull: false,
        },
        quantity: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        userId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: "users",
            key: "id",
          },
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
        tableName: "portfolios",
        timestamps: true,
        indexes: [
          {
            name: "PRIMARY",
            unique: true,
            using: "BTREE",
            fields: [{ name: "id" }],
          },
          {
            name: "userId",
            using: "BTREE",
            fields: [{ name: "userId" }],
          },
        ],
      },
    )
  }
}
