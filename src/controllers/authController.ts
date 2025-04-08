import { Request, Response } from "express"
import createError from "http-errors"
import { registerUserService } from "@services/authService"
import { sendSuccessResponse } from "@utils/sendSuccessResponse"
import { StatusCodes } from "@utils/statusCodes"

export const registerUser = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { email, password } = req.body

  if (!email || !password) {
    throw createError(
      StatusCodes.BAD_REQUEST,
      "이메일과 비밀번호는 필수입니다.",
    )
  }

  const newUser = await registerUserService(email, password)

  sendSuccessResponse(res, "회원가입 완료", newUser, StatusCodes.CREATED)
}
