import bcrypt from "bcrypt"
import { User } from "@models/index"
import jwt from "jsonwebtoken"
import createError from "http-errors"
import { StatusCodes } from "@utils/statusCodes"

export const registerUserService = async (email: string, password: string) => {
  const existingUser = await User.findOne({ where: { email } })
  if (existingUser) {
    throw createError(StatusCodes.CONFLICT, "이미 존재하는 이메일입니다.")
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  const newUser = await User.create({
    email,
    password: hashedPassword,
  })

  return {
    id: newUser.id,
    email: newUser.email,
  }
}

export const loginUserService = async (email: string, password: string) => {
  const user = await User.findOne({ raw: false, where: { email } })

  if (!user) {
    throw createError(
      StatusCodes.UNAUTHORIZED,
      "이메일 또는 비밀번호가 잘못되었습니다.",
    )
  }

  const isPasswordValid = await bcrypt.compare(password, user.password)
  if (!isPasswordValid) {
    throw createError(
      StatusCodes.UNAUTHORIZED,
      "이메일 또는 비밀번호가 잘못되었습니다.",
    )
  }

  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET!,
    {
      expiresIn: "1d",
    },
  )

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
    },
  }
}
