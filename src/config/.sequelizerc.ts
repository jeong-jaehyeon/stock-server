// .sequelizerc.ts
import dotenv from "dotenv"
dotenv.config()

export default {
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  dialect: "mariadb",
  directory: "src/models",
  lang: "ts",
  additional: {
    timestamps: true,
  },
}
