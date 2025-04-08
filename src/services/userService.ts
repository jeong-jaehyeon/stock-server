import User from "@models/User"

export const getUserById = async (id: number) => {
  return await User.findByPk(id)
}
