import * as Sequelize from "sequelize"
import { DataTypes, Model, Optional } from "sequelize"
import type { Portfolio, PortfolioId } from "./Portfolio"

export interface UserAttributes {
  id: number
  email: string
  password: string
  createdAt: Date
  updatedAt: Date
}

export type UserPk = "id"
export type UserId = User[UserPk]
export type UserOptionalAttributes = "id" | "createdAt" | "updatedAt"
export type UserCreationAttributes = Optional<
  UserAttributes,
  UserOptionalAttributes
>

export class User
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  declare id: number
  declare email: string
  declare password: string
  declare createdAt: Date
  declare updatedAt: Date

  // User hasMany Portfolio via userId
  declare portfolios: Portfolio[]
  getPortfolios!: Sequelize.HasManyGetAssociationsMixin<Portfolio>
  setPortfolios!: Sequelize.HasManySetAssociationsMixin<Portfolio, PortfolioId>
  addPortfolio!: Sequelize.HasManyAddAssociationMixin<Portfolio, PortfolioId>
  addPortfolios!: Sequelize.HasManyAddAssociationsMixin<Portfolio, PortfolioId>
  createPortfolio!: Sequelize.HasManyCreateAssociationMixin<Portfolio>
  removePortfolio!: Sequelize.HasManyRemoveAssociationMixin<
    Portfolio,
    PortfolioId
  >
  removePortfolios!: Sequelize.HasManyRemoveAssociationsMixin<
    Portfolio,
    PortfolioId
  >
  hasPortfolio!: Sequelize.HasManyHasAssociationMixin<Portfolio, PortfolioId>
  hasPortfolios!: Sequelize.HasManyHasAssociationsMixin<Portfolio, PortfolioId>
  countPortfolios!: Sequelize.HasManyCountAssociationsMixin

  static initModel(sequelize: Sequelize.Sequelize): typeof User {
    return User.init(
      {
        id: {
          autoIncrement: true,
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
        },
        email: {
          type: DataTypes.STRING(255),
          allowNull: false,
          unique: true,
        },
        password: {
          type: DataTypes.STRING(255),
          allowNull: false,
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
        tableName: "users",
        timestamps: true,
      },
    )
  }
}
