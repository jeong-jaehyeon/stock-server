import { Router } from "express"
import {
  addStockToPortfolio,
  sellStockFromPortfolio,
} from "../controllers/portfolioController"

const router = Router()

// ✅ 포트폴리오에 주식 매수
router.post("/portfolio", addStockToPortfolio)

// ✅ 포트폴리오에 주식 매도
router.post("/portfolio/sell/:symbol", sellStockFromPortfolio)

export default router
