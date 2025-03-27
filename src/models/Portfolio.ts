// models/Portfolio.ts

import { DataTypes, Model, Optional } from "sequelize"
import sequelize from "../config/db"

// 타입 정의
interface PortfolioAttributes {
  id: number
  symbol: string
  name: string
  buyPrice: number
  quantity: number
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
  },
  {
    sequelize,
    tableName: "portfolios",
  },
)

export default Portfolio
