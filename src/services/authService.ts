import bcrypt from "bcrypt"
import User from "@models/User"

export const registerUserService = async (email: string, password: string) => {
  const existingUser = await User.findOne({ where: { email } })
  if (existingUser) {
    throw new Error("이미 사용 중인 이메일입니다.")
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  const newUser = await User.create({
    email,
    password: hashedPassword,
  })

  return {
    id: newUser.id,
    email: newUser.email,
    createdAt: newUser.createdAt,
  }
}
