import { Router } from "express"
import { addStockToPortfolio } from "../controllers/portfolioAddController"

const router = Router()

// ✅ 포트폴리오에 주식 추가 API
router.post("/portfolio", addStockToPortfolio)

export default router
