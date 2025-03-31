import express, { Request, Response, NextFunction } from "express"
import "express-async-errors"
import createError from "http-errors"
import { HttpError } from "http-errors"
import dotenv from "dotenv"
dotenv.config() // 환경 변수 로드
import sequelize from "./config/db"
import "./models" // DB 모델 등록
import { StatusCodes } from "@utils/statusCodes"

import stockRoutes from "./routes/stockSearchRoutes" // ✅ 주식 검색 라우트 추가
import portfolioRoutes from "./routes/portfolioRoutes" // ✅ 포트폴리오 라우트 추가
import logger from "@utils/logger"

logger.info("🚀 app 시작 준비 완료")

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

app.use("/api/stocks", stockRoutes)
app.use("/api/portfolio", portfolioRoutes)

// 기본 라우트
app.get("/", (req, res) => {
  res.send("Stock API is running!")
})

// ✅ 없는 라우트 처리 (404 에러 처리)
app.use((req, res, next) => {
  next(createError(StatusCodes.NOT_FOUND, "요청한 페이지를 찾을 수 없습니다."))
})

// ✅ 글로벌 에러 핸들링 미들웨어
app.use((err: HttpError, req: Request, res: Response, _next: NextFunction) => {
  console.error(err.stack)
  res.status(err.status || StatusCodes.INTERNAL_SERVER_ERROR).json({
    message: err.message || "서버 내부 오류가 발생했습니다.",
  })
})

// 서버 실행
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
