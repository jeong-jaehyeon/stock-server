// src/app.ts
import { createServer } from "./server"
import logger from "@utils/logger"

const startServer = async () => {
  try {
    const app = await createServer()
    const PORT = process.env.PORT || 3000
    app.listen(PORT, () => {
      logger.info(`🚀 Server is running on http://localhost:${PORT}`)
    })
  } catch (err) {
    console.error("서버 실행 중 오류 발생:", err)
  }
}

startServer()
