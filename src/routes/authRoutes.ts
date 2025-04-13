import { Router } from "express"
import { registerUser, loginUser } from "@controllers/authController"

const router = Router()

// 회원가입
router.post("/register", registerUser)

// 로그인
router.post("/login", loginUser)

export default router
