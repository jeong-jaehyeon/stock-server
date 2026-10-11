import dotenv from "dotenv"
import path from "path"

// 테스트 환경 변수 로드
dotenv.config({ path: path.resolve(__dirname, "../../.env.test") })

// SQLite In-Memory DB 사용 설정
process.env.DATABASE_DIALECT = "sqlite"
process.env.DATABASE_STORAGE = ":memory:"
