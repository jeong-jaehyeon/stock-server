import { Router } from "express"
import {
  addStockToPortfolio,
  deleteStockFromPortfolio,
  sellStockFromPortfolio,
  getPortfolioSummary,
} from "../controllers/portfolioController"

const router = Router()

// ✅ 포트폴리오에 주식 매수
router.post("/portfolio", addStockToPortfolio)

// ✅ 포트폴리오에 주식 매도
router.post("/portfolio/sell/:symbol", sellStockFromPortfolio)

// ✅ 포트폴리오에서 주식 삭제 API
router.delete("/portfolio/:symbol", deleteStockFromPortfolio)

// ✅ 포트폴리오 전체 수익률 요약 API
router.get("/portfolio/summary", getPortfolioSummary)

export default router
