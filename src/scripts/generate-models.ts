import { SequelizeAuto } from "sequelize-auto"
import config from "../config/.sequelizerc"

const auto = new SequelizeAuto(
  config.database!,
  config.username!,
  config.password!,
  {
    host: config.host,
    dialect: config.dialect as never,
    directory: config.directory,
    lang: config.lang as never,
    additional: config.additional,
    caseModel: "p", // 모델 이름 PascalCase
    caseFile: "p", // 파일 이름도 PascalCase로
    singularize: true,
    useDefine: false,
  },
)

auto
  .run()
  .then(() => {
    console.log("✅ 모델 생성 완료")
  })
  .catch((err) => {
    console.error("❌ 모델 생성 실패:", err)
  })
