import { Router } from "express"
import {
  addStockToPortfolio,
  deleteStockFromPortfolio,
  sellStockFromPortfolio,
  getPortfolioSummary,
  getUserPortfolio,
} from "@controllers/portfolioController"
import { authenticateUser } from "@middleware/authMiddleware"

const router = Router()

// 인증이 필요한 API만 이 미들웨어를 적용
router.use(authenticateUser)

// 사용자별 포트폴리오 조회
router.get("/", getUserPortfolio)

// ✅ 포트폴리오에 주식 매수
router.post("/", addStockToPortfolio)

// ✅ 포트폴리오에 주식 매도
router.post("/sell/:symbol", sellStockFromPortfolio)

// ✅ 포트폴리오에서 주식 삭제 API
router.delete("/:symbol", deleteStockFromPortfolio)

// ✅ 포트폴리오 전체 수익률 요약 API
router.get("/summary", getPortfolioSummary)

export default router
