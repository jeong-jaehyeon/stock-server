import fs from "fs"
import path from "path"

const MODELS_DIR = path.join(__dirname, "../models")

const modelFiles = fs
  .readdirSync(MODELS_DIR)
  .filter((file) => file.endsWith(".ts"))

modelFiles.forEach((file) => {
  const filePath = path.join(MODELS_DIR, file)
  let content = fs.readFileSync(filePath, "utf-8")

  let updated = false

  // public 필드 패턴: id!: number; -> declare id: number;
  const publicFieldRegex = /^(\s*)(\w+)!:\s*([\w[\]]+);$/gm

  if (publicFieldRegex.test(content)) {
    content = content.replace(
      publicFieldRegex,
      (_, spaces, fieldName, fieldType) => {
        return `${spaces}declare ${fieldName}: ${fieldType};`
      },
    )
    console.log(`🛠 Public fields converted to declare in ${file}`)
    updated = true
  }

  if (updated) {
    fs.writeFileSync(filePath, content, "utf-8")
    console.log(`✅ ${file} updated!`)
  } else {
    console.log(`✅ ${file} already OK.`)
  }
})

console.log("\n🚀 All models fields converted to declare!")
