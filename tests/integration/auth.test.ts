import request from "supertest"
import { createServer } from "../../src/server"
import {
  initTestDatabase,
  cleanupDatabase,
  createTestUser,
} from "../helpers/testHelpers"
import { Express } from "express"

describe("Auth API Tests", () => {
  let app: Express

  beforeAll(async () => {
    await initTestDatabase()
    app = await createServer()
  })

  beforeEach(async () => {
    await cleanupDatabase()
  })

  afterAll(async () => {
    await cleanupDatabase()
  })

  describe("POST /api/auth/register", () => {
    it("should register a new user successfully", async () => {
      const response = await request(app).post("/api/auth/register").send({
        email: "newuser@example.com",
        password: "password123",
      })

      expect(response.status).toBe(201)
      expect(response.body).toHaveProperty("message", "회원가입 완료")
      expect(response.body.data).toHaveProperty("id")
      expect(response.body.data).toHaveProperty("email", "newuser@example.com")
      expect(response.body.data).not.toHaveProperty("password")
    })

    it("should return 400 when email is missing", async () => {
      const response = await request(app).post("/api/auth/register").send({
        password: "password123",
      })

      expect(response.status).toBe(400)
      expect(response.body).toHaveProperty(
        "message",
        "이메일과 비밀번호는 필수입니다.",
      )
    })

    it("should return 400 when password is missing", async () => {
      const response = await request(app).post("/api/auth/register").send({
        email: "test@example.com",
      })

      expect(response.status).toBe(400)
      expect(response.body).toHaveProperty(
        "message",
        "이메일과 비밀번호는 필수입니다.",
      )
    })

    it("should return 409 when email already exists", async () => {
      await createTestUser("existing@example.com", "password123")

      const response = await request(app).post("/api/auth/register").send({
        email: "existing@example.com",
        password: "password123",
      })

      expect(response.status).toBe(409)
      expect(response.body).toHaveProperty(
        "message",
        "이미 존재하는 이메일입니다.",
      )
    })
  })

  describe("POST /api/auth/login", () => {
    beforeEach(async () => {
      await createTestUser("test@example.com", "password123")
    })

    it("should login successfully with correct credentials", async () => {
      const response = await request(app).post("/api/auth/login").send({
        email: "test@example.com",
        password: "password123",
      })

      expect(response.status).toBe(200)
      expect(response.body).toHaveProperty("message", "로그인 성공")
      expect(response.body.data).toHaveProperty("token")
      expect(response.body.data).toHaveProperty("user")
      expect(response.body.data.user).toHaveProperty("email", "test@example.com")
      expect(typeof response.body.data.token).toBe("string")
    })

    it("should return 400 when email is missing", async () => {
      const response = await request(app).post("/api/auth/login").send({
        password: "password123",
      })

      expect(response.status).toBe(400)
      expect(response.body).toHaveProperty(
        "message",
        "이메일과 비밀번호를 입력해주세요.",
      )
    })

    it("should return 400 when password is missing", async () => {
      const response = await request(app).post("/api/auth/login").send({
        email: "test@example.com",
      })

      expect(response.status).toBe(400)
      expect(response.body).toHaveProperty(
        "message",
        "이메일과 비밀번호를 입력해주세요.",
      )
    })

    it("should return 401 when email does not exist", async () => {
      const response = await request(app).post("/api/auth/login").send({
        email: "nonexistent@example.com",
        password: "password123",
      })

      expect(response.status).toBe(401)
      expect(response.body).toHaveProperty(
        "message",
        "이메일 또는 비밀번호가 잘못되었습니다.",
      )
    })

    it("should return 401 when password is incorrect", async () => {
      const response = await request(app).post("/api/auth/login").send({
        email: "test@example.com",
        password: "wrongpassword",
      })

      expect(response.status).toBe(401)
      expect(response.body).toHaveProperty(
        "message",
        "이메일 또는 비밀번호가 잘못되었습니다.",
      )
    })
  })
})
