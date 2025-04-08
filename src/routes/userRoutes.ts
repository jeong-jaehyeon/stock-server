import { Router } from "express"
import { getUserController } from "@controllers/userController"

const router = Router()

// GET /api/users/1
router.get("/:id", getUserController)

export default router
