import { DataTypes, Model, Optional } from "sequelize"
import sequelize from "../config/db"

/*
매도를 한다면, 손익 계산 및 매매 기록이 필요하기 때문에 trade_history 테이블
주식을 매도할 때 현재 가격과 매수 가격의 차이로 손익(profit/loss)을 계산해야 함
이 데이터를 포트폴리오 테이블에 저장하면 안 되는 이유:
포트폴리오는 보유 중인 주식만 저장
매도한 주식은 보유하지 않으므로 포트폴리오에서 삭제되면 기록이 사라짐
 */
// ✅ TradeHistory 테이블 속성 정의
interface TradeHistoryAttributes {
  id: number
  portfolioId: number
  symbol: string
  name: string
  tradeType: "BUY" | "SELL"
  tradePrice: number
  quantity: number
  profitLoss?: number
}

// ✅ 생성 시 필요한 속성 정의 (id는 자동 생성이므로 제외)
type TradeHistoryCreationAttributes = Optional<
  TradeHistoryAttributes,
  "id" | "profitLoss"
>

// ✅ 모델 클래스 선언 (⚠️ 모든 필드는 declare 사용)
class TradeHistory
  extends Model<TradeHistoryAttributes, TradeHistoryCreationAttributes>
  implements TradeHistoryAttributes
{
  declare id: number
  declare portfolioId: number
  declare symbol: string
  declare name: string
  declare tradeType: "BUY" | "SELL"
  declare tradePrice: number
  declare quantity: number
  declare profitLoss?: number

  declare readonly createdAt: Date
  declare readonly updatedAt: Date
}

// ✅ 모델 초기화
TradeHistory.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    portfolioId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "portfolios", // 또는 Portfolio
        key: "id",
      },
      onDelete: "CASCADE",
    },
    symbol: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
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
  },
  {
    sequelize,
    tableName: "trade_history",
    modelName: "TradeHistory",
  },
)

export default TradeHistory
