// src/models/Portfolio.ts

import { DataTypes, Model, Optional } from "sequelize"
import sequelize from "@config/db"
import User from "./User"

interface PortfolioAttributes {
  id: number
  symbol: string
  name: string
  buyPrice: number
  quantity: number
  userId: number
}

type PortfolioCreationAttributes = Optional<PortfolioAttributes, "id">

class Portfolio
  extends Model<PortfolioAttributes, PortfolioCreationAttributes>
  implements PortfolioAttributes
{
  declare id: number
  declare symbol: string
  declare name: string
  declare buyPrice: number
  declare quantity: number
  declare userId: number
}

Portfolio.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    symbol: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
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
      onDelete: "CASCADE",
    },
  },
  {
    sequelize,
    tableName: "portfolios",
  },
)

Portfolio.belongsTo(User, { foreignKey: "userId", onDelete: "CASCADE" })
User.hasMany(Portfolio, { foreignKey: "userId", onDelete: "CASCADE" })

export default Portfolio
