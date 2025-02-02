import { Router } from "express"
import {
  getStockBySymbolController,
  getMultipleStocksController,
} from "../controllers/stockSearchController"

const router = Router()

// 특정 주식 데이터 가져오기
router.get("/stocks/:symbol", getStockBySymbolController)

// 여러 주식 데이터 가져오기
router.get("/stocks", getMultipleStocksController)

export default router
