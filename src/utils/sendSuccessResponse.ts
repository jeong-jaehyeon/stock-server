import { Response } from "express"
import { StatusCodes } from "./statusCodes"

export const sendSuccessResponse = (
  res: Response,
  message: string,
  data?: unknown,
  statusCode = StatusCodes.OK,
) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  })
}
