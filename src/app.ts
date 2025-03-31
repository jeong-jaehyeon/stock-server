// src/app.ts
import { createServer } from "./server"
import logger from "@utils/logger"

const PORT = process.env.PORT || 3000

const app = createServer()

app.listen(PORT, () => {
  logger.info(`🚀 Server is running on http://localhost:${PORT}`)
})
