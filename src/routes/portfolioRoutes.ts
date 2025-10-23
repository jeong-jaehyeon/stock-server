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

/**
 * @openapi
 * /api/portfolio:
 *   get:
 *     tags:
 *       - Portfolio
 *     summary: Get user portfolio
 *     description: Retrieve all stocks in the authenticated user's portfolio
 *     responses:
 *       200:
 *         description: Successfully retrieved portfolio
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 사용자의 포트폴리오를 조회하였습니다.
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Portfolio'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/", getUserPortfolio)

/**
 * @openapi
 * /api/portfolio:
 *   post:
 *     tags:
 *       - Portfolio
 *     summary: Buy stock
 *     description: Add a stock to portfolio or update quantity if already owned
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - symbol
 *               - name
 *               - buyPrice
 *               - quantity
 *             properties:
 *               symbol:
 *                 type: string
 *                 example: AAPL
 *               name:
 *                 type: string
 *                 example: Apple Inc.
 *               buyPrice:
 *                 type: number
 *                 format: float
 *                 minimum: 0
 *                 example: 150.5
 *               quantity:
 *                 type: integer
 *                 minimum: 1
 *                 example: 10
 *     responses:
 *       201:
 *         description: Stock successfully purchased
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: AAPL 주식을 포트폴리오에 매수하였습니다.
 *                 data:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: AAPL 주식을 10개 매수 완료.
 *       400:
 *         description: Invalid request (missing fields or invalid values)
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
router.post("/", addStockToPortfolio)

/**
 * @openapi
 * /api/portfolio/sell/{symbol}:
 *   post:
 *     tags:
 *       - Portfolio
 *     summary: Sell stock
 *     description: Sell a specified quantity of stock from portfolio
 *     parameters:
 *       - in: path
 *         name: symbol
 *         required: true
 *         schema:
 *           type: string
 *           example: AAPL
 *         description: Stock ticker symbol to sell
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - sellPrice
 *               - quantity
 *             properties:
 *               sellPrice:
 *                 type: number
 *                 format: float
 *                 minimum: 0
 *                 example: 160.0
 *               quantity:
 *                 type: integer
 *                 minimum: 1
 *                 example: 5
 *     responses:
 *       201:
 *         description: Stock successfully sold
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: AAPL 주식을 5개 매도했습니다.
 *                 data:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: AAPL 주식을 5개 매도 완료.
 *                     remainingQuantity:
 *                       type: integer
 *                       example: 5
 *                     profitLoss:
 *                       type: number
 *                       format: float
 *                       example: 47.5
 *       400:
 *         description: Invalid request
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
 *       404:
 *         description: Stock not found in portfolio
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post("/sell/:symbol", sellStockFromPortfolio)

/**
 * @openapi
 * /api/portfolio/{symbol}:
 *   delete:
 *     tags:
 *       - Portfolio
 *     summary: Delete stock from portfolio
 *     description: Completely remove a stock from the user's portfolio
 *     parameters:
 *       - in: path
 *         name: symbol
 *         required: true
 *         schema:
 *           type: string
 *           example: AAPL
 *         description: Stock ticker symbol to delete
 *     responses:
 *       200:
 *         description: Stock successfully deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: AAPL 주식을 삭제 완료.
 *                 data:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: AAPL 주식을 삭제 완료.
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Stock not found in portfolio
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete("/:symbol", deleteStockFromPortfolio)

/**
 * @openapi
 * /api/portfolio/summary:
 *   get:
 *     tags:
 *       - Portfolio
 *     summary: Get portfolio summary
 *     description: Retrieve portfolio summary with current prices and profit/loss calculations
 *     responses:
 *       200:
 *         description: Successfully retrieved portfolio summary
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 포트폴리오 요약 조회 성공
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       symbol:
 *                         type: string
 *                         example: AAPL
 *                       name:
 *                         type: string
 *                         example: Apple Inc.
 *                       quantity:
 *                         type: integer
 *                         example: 10
 *                       buyPrice:
 *                         type: number
 *                         format: float
 *                         example: 150.5
 *                       currentPrice:
 *                         type: number
 *                         format: float
 *                         example: 155.0
 *                       profitLoss:
 *                         type: number
 *                         format: float
 *                         example: 45.0
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/summary", getPortfolioSummary)

export default router
