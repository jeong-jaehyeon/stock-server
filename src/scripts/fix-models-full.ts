import fs from "fs"
import path from "path"

const MODELS_DIR = path.join(__dirname, "../models")

const TIMESTAMP_FIELDS = `
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },`

const TIMESTAMP_INTERFACE = `
  createdAt: Date;
  updatedAt: Date;`

/**
 * init() 필드 블록을 안전하게 찾는 함수
 */
function findFieldsBlock(
  content: string,
  modelName: string,
): { start: number; end: number } | null {
  const initStart = content.indexOf(`return ${modelName}.init(`)
  if (initStart === -1) return null

  const firstBrace = content.indexOf("{", initStart)
  if (firstBrace === -1) return null

  let braceCount = 1
  for (let i = firstBrace + 1; i < content.length; i++) {
    if (content[i] === "{") braceCount++
    else if (content[i] === "}") braceCount--

    if (braceCount === 0) {
      return { start: firstBrace, end: i }
    }
  }

  return null
}

// Step 0: 모델 파일명 목록을 미리 읽어서 소문자-대문자 매핑
const modelFileNames = fs
  .readdirSync(MODELS_DIR)
  .filter((file) => file.endsWith(".ts"))
  .map((file) => file.replace(/\.ts$/, "")) // "Portfolio", "TradeHistory" 등

const modelNameMap = new Map<string, string>()
modelFileNames.forEach((name) => {
  modelNameMap.set(name.toLowerCase(), name) // "portfolio" -> "Portfolio" 매핑
})

const modelFiles = fs
  .readdirSync(MODELS_DIR)
  .filter((file) => file.endsWith(".ts"))

modelFiles.forEach((file) => {
  const filePath = path.join(MODELS_DIR, file)
  let content = fs.readFileSync(filePath, "utf-8")

  let updated = false

  // 0. import 경로 수정 (소문자 import 경로를 대문자화)
  const beforeImportFix = content
  content = content.replace(
    /import type { ([\w, ]+) } from "\.\/([\w-]+)"/g,
    (match, imports, modelPath) => {
      const fixedName = modelNameMap.get(modelPath.toLowerCase())
      if (fixedName) {
        return `import type { ${imports} } from "./${fixedName}"`
      }
      return match // 못 찾으면 그대로
    },
  )
  if (content !== beforeImportFix) {
    console.log(`🛠 Import paths fixed in ${file}`)
    updated = true
  }

  // 1. Interface 수정 (createdAt, updatedAt 추가)
  const interfaceRegex = /export interface (\w+)Attributes\s*{([^}]*)}/s
  const interfaceMatch = content.match(interfaceRegex)

  if (interfaceMatch) {
    const [fullMatch, interfaceName, interfaceBody] = interfaceMatch

    if (
      !interfaceBody.includes("createdAt") &&
      !interfaceBody.includes("updatedAt")
    ) {
      const newInterface = fullMatch.replace(
        /{([^}]*)}/s,
        `{${interfaceBody}${TIMESTAMP_INTERFACE}\n}`,
      )
      content = content.replace(fullMatch, newInterface)
      console.log(`🛠 Interface fixed in ${file}`)
      updated = true
    }
  }

  // 2. init() 수정 (createdAt, updatedAt 추가)
  const initRegex =
    /static initModel\(sequelize: Sequelize\.Sequelize\): typeof (\w+)/s
  const initMatch = content.match(initRegex)

  if (initMatch) {
    const modelName = initMatch[1]
    const block = findFieldsBlock(content, modelName)

    if (block) {
      const fieldsBlock = content.slice(block.start + 1, block.end) // { ...필드들... }
      if (
        !fieldsBlock.includes("createdAt") &&
        !fieldsBlock.includes("updatedAt")
      ) {
        const newFieldsBlock = fieldsBlock.trim() + `,\n${TIMESTAMP_FIELDS}\n`
        const newContent =
          content.slice(0, block.start + 1) +
          newFieldsBlock +
          content.slice(block.end)
        content = newContent
        console.log(`🛠 Init fields fixed in ${file}`)
        updated = true
      }
    }
  }

  // 최종 저장
  if (updated) {
    fs.writeFileSync(filePath, content, "utf-8")
    console.log(`✅ ${file} updated!`)
  } else {
    console.log(`✅ ${file} already OK.`)
  }
})

console.log("\n🚀 All models fully fixed (import paths + interface + init)!")
