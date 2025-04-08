import { Request, Response } from "express"
import createError from "http-errors"
import { StatusCodes } from "@utils/statusCodes"
import { getUserById } from "@services/userService"
import { sendSuccessResponse } from "@utils/sendSuccessResponse"

export const getUserController = async (req: Request, res: Response) => {
  const { id } = req.params

  const user = await getUserById(Number(id))

  if (!user) {
    throw createError(StatusCodes.NOT_FOUND, "사용자를 찾을 수 없습니다.")
  }
  sendSuccessResponse(res, "성공", user, StatusCodes.OK)
}
