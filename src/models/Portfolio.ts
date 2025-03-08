import { DataTypes, Model } from "sequelize"
import sequelize from "../config/db"

class Portfolio extends Model {
  public id!: number
  public symbol!: string
  public name!: string
  public buyPrice!: number
  public quantity!: number
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
