// src/models/User.ts

import { DataTypes, Model, Optional } from "sequelize"
import sequelize from "../config/db"

// 1. 타입 정의
interface UserAttributes {
  id: number
  email: string
  password: string
}

type UserCreationAttributes = Optional<UserAttributes, "id">

// 2. User 모델 정의
class User
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  declare id: number
  declare email: string
  declare password: string
}

// 3. init
User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "User",
    tableName: "users",
    timestamps: true, // createdAt, updatedAt 자동 생성
  },
)

export default User
