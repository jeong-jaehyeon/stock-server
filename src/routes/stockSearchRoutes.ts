import { Router } from "express"
import {
  getStockBySymbolController,
  getMultipleStocksController,
} from "@controllers/stockSearchController"

const router = Router()

/**
 * @openapi
 * /api/stocks:
 *   get:
 *     tags:
 *       - Stock Search
 *     summary: Search multiple stocks
 *     description: Retrieve real-time data for multiple stock symbols
 *     security: []
 *     parameters:
 *       - in: query
 *         name: symbols
 *         required: true
 *         schema:
 *           type: string
 *           example: AAPL,MSFT,GOOGL
 *         description: Comma-separated list of stock symbols
 *     responses:
 *       200:
 *         description: Successfully retrieved stock data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 모든 주식을 검색했습니다.
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Stock'
 *       400:
 *         description: Missing symbols parameter
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/", getMultipleStocksController)

/**
 * @openapi
 * /api/stocks/{symbol}:
 *   get:
 *     tags:
 *       - Stock Search
 *     summary: Get stock by symbol
 *     description: Retrieve real-time data for a specific stock symbol
 *     security: []
 *     parameters:
 *       - in: path
 *         name: symbol
 *         required: true
 *         schema:
 *           type: string
 *           example: AAPL
 *         description: Stock ticker symbol
 *     responses:
 *       200:
 *         description: Successfully retrieved stock data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: AAPL 주식을 검색했습니다.
 *                 data:
 *                   $ref: '#/components/schemas/Stock'
 *       404:
 *         description: Stock not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/:symbol", getStockBySymbolController)

export default router
