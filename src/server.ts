// src/server.ts
import express, { Request, Response, NextFunction } from "express"
import "express-async-errors"
import createError, { HttpError } from "http-errors"
import dotenv from "dotenv"
dotenv.config()

import logger from "@utils/logger"
import { initDatabase } from "@config/db"
import { StatusCodes } from "@utils/statusCodes"

import stockRoutes from "./routes/stockSearchRoutes"
import portfolioRoutes from "./routes/portfolioRoutes"
import "./models"
import { requestLogger } from "@middleware/requestLogger" // DB 모델 등록

export const createServer = () => {
  const app = express()

  // DB 연결
  initDatabase()

  // 미들웨어
  app.use(express.json())

  // 로그
  app.use(requestLogger)

  // 라우트
  app.use("/api/stocks", stockRoutes)
  app.use("/api/portfolio", portfolioRoutes)

  // 기본 라우트
  app.get("/", (req, res) => {
    res.send("Stock API is running!")
  })

  // 없는 라우트 처리
  app.use((req, res, next) => {
    next(
      createError(StatusCodes.NOT_FOUND, "요청한 페이지를 찾을 수 없습니다."),
    )
  })

  // 글로벌 에러 핸들러
  app.use(
    (err: HttpError, req: Request, res: Response, _next: NextFunction) => {
      logger.error(err.stack)
      res.status(err.status || StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: err.message || "서버 내부 오류가 발생했습니다.",
      })
    },
  )

  return app
}
