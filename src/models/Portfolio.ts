import { DataTypes, Model } from "sequelize"
import sequelize from "../config/db"

class Portfolio extends Model {
  public id!: number
  public stockSymbol!: string // 주식 심볼 (예: AAPL, TSLA)
  public stockName!: string // 주식 이름
  public buyPrice!: number // 매수 단가
  public sellPrice!: number | null // 매도 단가 (선택적)
  public quantity!: number // 보유 주식 수
}

// Portfolio 모델 정의
Portfolio.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    stockSymbol: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    stockName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    buyPrice: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    sellPrice: {
      type: DataTypes.FLOAT,
      allowNull: true, // 매도 단가는 선택적
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Portfolio",
    tableName: "portfolios",
    timestamps: true, // createdAt, updatedAt 자동 추가
  },
)

export default Portfolio
