import { Router } from "express"
import {
  getUserTradeHistory,
  getUserTradeHistoryBySymbol,
} from "@controllers/tradeHistoryController"
import { authenticateUser } from "@middleware/authMiddleware"

const router = Router()

router.use(authenticateUser)

/**
 * @openapi
 * /api/trade-history:
 *   get:
 *     tags:
 *       - Trade History
 *     summary: Get user trade history
 *     description: Retrieve all trading transactions for the authenticated user
 *     responses:
 *       200:
 *         description: Successfully retrieved trade history
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 거래 내역 조회 성공
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       portfolioId:
 *                         type: integer
 *                         example: 5
 *                       symbol:
 *                         type: string
 *                         example: AAPL
 *                       name:
 *                         type: string
 *                         example: Apple Inc.
 *                       tradeType:
 *                         type: string
 *                         enum: [BUY, SELL]
 *                         example: BUY
 *                       tradePrice:
 *                         type: number
 *                         format: float
 *                         example: 150.5
 *                       quantity:
 *                         type: integer
 *                         example: 10
 *                       profitLoss:
 *                         type: number
 *                         format: float
 *                         nullable: true
 *                         example: null
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: 2025-01-15T10:30:00Z
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/", getUserTradeHistory)

/**
 * @openapi
 * /api/trade-history/{symbol}:
 *   get:
 *     tags:
 *       - Trade History
 *     summary: Get trade history for specific stock
 *     description: Retrieve all trading transactions for a specific stock symbol
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
 *         description: Successfully retrieved trade history for symbol
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: AAPL 거래 내역 조회 성공
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       symbol:
 *                         type: string
 *                       name:
 *                         type: string
 *                       tradeType:
 *                         type: string
 *                         enum: [BUY, SELL]
 *                       tradePrice:
 *                         type: number
 *                         format: float
 *                       quantity:
 *                         type: integer
 *                       profitLoss:
 *                         type: number
 *                         format: float
 *                         nullable: true
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *       400:
 *         description: Missing symbol parameter
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/:symbol", getUserTradeHistoryBySymbol)

export default router
