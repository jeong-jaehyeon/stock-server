// config/db.ts
import { Sequelize } from "sequelize"
import dotenv from "dotenv"
import logger from "@utils/logger"

dotenv.config()

// 테스트 환경에서 SQLite 사용
const isTestEnvironment = process.env.DATABASE_DIALECT === "sqlite"

const sequelize = isTestEnvironment
  ? new Sequelize({
      dialect: "sqlite",
      storage: process.env.DATABASE_STORAGE || ":memory:",
      logging: false,
    })
  : new Sequelize(
      process.env.DB_NAME!,
      process.env.DB_USER!,
      process.env.DB_PASSWORD!,
      {
        host: process.env.DB_HOST!,
        dialect: "mariadb",
        dialectOptions: {
          allowPublicKeyRetrieval: true,
        },
        logging: (msg) => logger.debug(msg),
        pool: {
          max: 10,
          min: 0,
          idle: 10000,
        },
      },
    )

// ✅ 연결 및 모델 동기화 함수
export const initDatabase = async () => {
  try {
    await sequelize.authenticate()
    if (!isTestEnvironment) {
      logger.info("✅ DB 연결 성공")
    }
    await sequelize.sync({ force: isTestEnvironment, alter: !isTestEnvironment })
    if (!isTestEnvironment) {
      logger.info("✅ 모든 모델 동기화 완료")
    }
  } catch (error) {
    if (!isTestEnvironment) {
      logger.error("❌ DB 연결 실패")
      logger.error(error)
    }
    throw error
  }
}

export default sequelize

/*
데이터베이스 정보

stock_db: 연결할 데이터베이스 이름.
root: 데이터베이스 사용자 이름.
your_password: 사용자 비밀번호.
호스트 및 데이터베이스 종류

host: 데이터베이스 서버의 주소. 기본적으로 로컬 환경에서는 localhost.
dialect: 사용할 데이터베이스 종류. MariaDB인 경우 "mariadb"를 사용.
로깅 설정

logging: false: SQL 쿼리 실행 로그를 비활성화.
디버깅을 위해 로그를 보고 싶다면 true로 변경하세요.
연결 풀 설정

max: 연결 풀의 최대 연결 수.
min: 연결 풀의 최소 연결 수.
idle: 연결이 사용되지 않을 때 종료되기까지의 대기 시간 (밀리초 단위).
 */
