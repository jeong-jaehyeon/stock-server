import { Router } from "express"
import {
  addStockToPortfolio,
  deleteStockFromPortfolio,
  sellStockFromPortfolio,
  getPortfolioSummary,
} from "@controllers/portfolioController"

const router = Router()

// ✅ 포트폴리오에 주식 매수
router.post("/", addStockToPortfolio)

// ✅ 포트폴리오에 주식 매도
router.post("/sell/:symbol", sellStockFromPortfolio)

// ✅ 포트폴리오에서 주식 삭제 API
router.delete("/:symbol", deleteStockFromPortfolio)

// ✅ 포트폴리오 전체 수익률 요약 API
router.get("/summary", getPortfolioSummary)

export default router
