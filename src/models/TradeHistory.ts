import { DataTypes, Model } from "sequelize"
import sequelize from "../config/db"
import Portfolio from "./Portfolio"

/*
매도를 한다면, 손익 계산 및 매매 기록이 필요하기 때문에 trade_history 테이블
주식을 매도할 때 현재 가격과 매수 가격의 차이로 손익(profit/loss)을 계산해야 함
이 데이터를 포트폴리오 테이블에 저장하면 안 되는 이유:
포트폴리오는 보유 중인 주식만 저장
매도한 주식은 보유하지 않으므로 포트폴리오에서 삭제되면 기록이 사라짐
 */

class TradeHistory extends Model {
  public id!: number
  public portfolioId!: number // ✅ 외래키 설정
  public symbol!: string
  public name!: string
  public tradeType!: "BUY" | "SELL"
  public tradePrice!: number
  public quantity!: number
  public profitLoss?: number
}

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
        model: Portfolio,
        key: "id",
      },
      onDelete: "CASCADE", // 포트폴리오가 삭제되면 히스토리도 삭제
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
  },
)

// TradeHistory.ts
TradeHistory.belongsTo(Portfolio, {
  foreignKey: "portfolioId", // ✅ FK 컬럼명 지정
  onDelete: "CASCADE", // ✅ 포트폴리오 삭제 시 관련 거래 기록도 삭제
})

export default TradeHistory
