// 이 API는 "인증된 사용자만 사용 가능하다"는 걸 서버가 판단해야할 인증 미들웨어
// 모든 API마다 jwt.verify(...)를 직접 쓰면 코드가 중복되고 실수할 가능성도 커지기 때문에,
// 인증 미들웨어로 만들어 두면, 한 곳에서만 관리하니까 훨씬 효율적이고 깔끔함.
// 그리고 필요한 API의 라우트 부분에서 선언.

import { NextFunction, Request, Response } from "express"
import jwt from "jsonwebtoken"
import createError from "http-errors"
import { StatusCodes } from "@utils/statusCodes"
import logger from "@utils/logger"
import { UserPayload } from "types/custom"

interface AuthenticatedRequest extends Request {
  user?: UserPayload
}

export const authenticateUser = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization

  console.log(authHeader, ":authHeader")
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw createError(StatusCodes.UNAUTHORIZED, "인증 토큰이 없습니다.")
  }

  const token = authHeader.split(" ")[1]

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as UserPayload
    req.user = decoded
    next()
  } catch (err) {
    logger.warn("인증 실패: 유효하지 않은 토큰", err)
    throw createError(StatusCodes.UNAUTHORIZED, "유효하지 않은 토큰입니다.")
  }
}
