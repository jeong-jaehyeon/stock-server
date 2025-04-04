import { Router } from "express"
import {
  getStockBySymbolController,
  getMultipleStocksController,
} from "../controllers/stockSearchController"

const router = Router()

// 특정 주식 데이터 가져오기
router.get("/:symbol", getStockBySymbolController)

// 여러 주식 데이터 가져오기
router.get("/", getMultipleStocksController)

export default router
