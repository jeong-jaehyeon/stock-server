import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import sequelize, { initDatabase } from "@config/db"

let isDbInitialized = false

export const initTestDatabase = async () => {
  if (!isDbInitialized) {
    await initDatabase()
    isDbInitialized = true
  }
}

export const cleanupDatabase = async () => {
  try {
    // SQLite에서는 TRUNCATE 대신 DELETE 사용 (역순으로 삭제: FK 제약)
    await sequelize.query(`DELETE FROM trade_history`, { raw: true })
    await sequelize.query(`DELETE FROM portfolios`, { raw: true })
    await sequelize.query(`DELETE FROM users`, { raw: true })
  } catch (error) {
    // 테이블이 없는 경우 무시
    const err = error as Error
    if (!err.message?.includes("no such table")) {
      console.error("Database cleanup failed:", error)
      throw error
    }
  }
}

export const createTestUser = async (
  email: string = "test@example.com",
  password: string = "password123",
) => {
  try {
    const hashedPassword = await bcrypt.hash(password, 10)
    const [results] = await sequelize.query(
      `INSERT INTO users (email, password, createdAt, updatedAt) VALUES (?, ?, datetime('now'), datetime('now'))`,
      { replacements: [email, hashedPassword] },
    )

    const [[user]] = await sequelize.query(
      `SELECT * FROM users WHERE email = ?`,
      { replacements: [email] },
    )

    return user as any
  } catch (error) {
    console.error("createTestUser failed:", error)
    throw error
  }
}

export const generateAuthToken = (userId: number): string => {
  const secret = process.env.JWT_SECRET || "test_secret"
  return jwt.sign({ id: userId }, secret, { expiresIn: "1h" })
}

export const createTestPortfolio = async (
  userId: number,
  symbol: string = "AAPL",
  name: string = "Apple Inc.",
  quantity: number = 10,
  buyPrice: number = 150.0,
) => {
  const { Portfolio } = await import("@models/index")
  const portfolio = await Portfolio.create({
    userId,
    symbol,
    name,
    quantity,
    buyPrice,
  })
  return portfolio
}

export const createTestTradeHistory = async (
  portfolioId: number,
  symbol: string = "AAPL",
  name: string = "Apple Inc.",
  tradeType: "BUY" | "SELL" = "BUY",
  tradePrice: number = 150.0,
  quantity: number = 10,
  profitLoss: number | null = null,
) => {
  const { TradeHistory } = await import("@models/index")
  const tradeHistory = await TradeHistory.create({
    portfolioId,
    symbol,
    name,
    tradeType,
    tradePrice,
    quantity,
    profitLoss: profitLoss ?? undefined,
  })
  return tradeHistory
}
