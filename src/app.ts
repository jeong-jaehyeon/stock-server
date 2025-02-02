import express from "express"
import dotenv from "dotenv"
dotenv.config() // 환경 변수 로드
import sequelize from "./config/db"
import "./models/Portfolio" // Portfolio 모델 등록

import stockRoutes from "./routes/stockSearchRoutes" // ✅ 주식 검색 라우트 추가
// import portfolioRoutes from "./routes/portfolioRoutes" // ✅ 포트폴리오 라우트 추가

// 데이터베이스 연결 테스트
sequelize
  .authenticate()
  .then(() => console.log("Database connected successfully!"))
  .catch((error) => console.error("Unable to connect to the database:", error))

// Sequelize 모델과 데이터베이스 동기화
sequelize
  .sync({ alter: true }) // 모든 등록된 모델 동기화
  .then(() => {
    console.log("All tables synchronized successfully.")
  })
  .catch((err) => {
    console.error("Error synchronizing the database:", err)
  })

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json())

// ✅ 주식 검색 API 라우트 등록
app.use("/api", stockRoutes)

// ✅ 포트폴리오 API 라우트 등록
// app.use("/api", portfolioRoutes)

// 기본 라우트
app.get("/", (req, res) => {
  res.send("Stock API is running!")
})

// 서버 실행
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
