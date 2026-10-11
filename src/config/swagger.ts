import swaggerJsdoc from "swagger-jsdoc"

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Stock Portfolio API",
      version: "1.0.0",
      description:
        "A RESTful API for managing stock portfolios with real-time price data integration",
      contact: {
        name: "Jaehyeon Jeong",
        email: "wolgus104@naver.com",
      },
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Development server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Enter JWT token obtained from /api/auth/login",
        },
      },
      schemas: {
        Error: {
          type: "object",
          properties: {
            message: {
              type: "string",
              description: "Error message",
            },
          },
        },
        User: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              description: "User ID",
            },
            email: {
              type: "string",
              format: "email",
              description: "User email address",
            },
          },
        },
        Portfolio: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              description: "Portfolio entry ID",
            },
            userId: {
              type: "integer",
              description: "Owner user ID",
            },
            symbol: {
              type: "string",
              description: "Stock ticker symbol",
              example: "AAPL",
            },
            name: {
              type: "string",
              description: "Company name",
              example: "Apple Inc.",
            },
            quantity: {
              type: "integer",
              description: "Number of shares owned",
              minimum: 1,
            },
            buyPrice: {
              type: "number",
              format: "float",
              description: "Average purchase price per share",
              minimum: 0,
            },
            createdAt: {
              type: "string",
              format: "date-time",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
            },
          },
        },
        Stock: {
          type: "object",
          properties: {
            symbol: {
              type: "string",
              description: "Stock ticker symbol",
              example: "AAPL",
            },
            name: {
              type: "string",
              description: "Company name",
              example: "Apple Inc.",
            },
            price: {
              type: "number",
              format: "float",
              description: "Current stock price",
            },
            currency: {
              type: "string",
              description: "Currency code",
              example: "USD",
            },
            exchange: {
              type: "string",
              description: "Stock exchange",
              example: "NASDAQ",
            },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./src/routes/*.ts", "./src/controllers/*.ts"],
}

export const swaggerSpec = swaggerJsdoc(options)
