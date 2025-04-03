import { Request, Response, NextFunction } from "express"
import logger from "@utils/logger"

export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { method, originalUrl } = req
  const startTime = process.hrtime() // 고해상도 시간 측정

  logger.info(`📥 요청 시작: ${method} ${originalUrl}`)

  // Express에서 모든 API 응답이 완료되었을 때 자동으로 발생하는 이벤트
  res.on("finish", () => {
    const [seconds, nanoseconds] = process.hrtime(startTime)
    const duration = (seconds * 1e3 + nanoseconds / 1e6).toFixed(2)
    logger.info(
      `✅ 응답 완료: ${method} ${originalUrl} ${res.statusCode} - ${duration}ms`,
    )
  })

  // 연결이 비정상적으로 끊긴 경우
  res.on("close", () => {
    if (!res.writableEnded) {
      logger.warn(
        `⚠️ 연결 종료 (close): ${method} ${originalUrl} - 클라이언트가 중단`,
      )
    }
  })

  // 에러 발생 시
  res.on("error", (err) => {
    logger.error(
      `❌ 응답 중 에러 발생: ${method} ${originalUrl} - ${err.message}`,
    )
  })

  next()
}
