# 📈 Stock Portfolio API

Twelve Data API로 실시간 주가를 조회하고, 매수·매도 내역과 손익까지 관리하는 **주식 포트폴리오 REST API**입니다.

- **백엔드**: Express.js + TypeScript + Sequelize
- **데이터베이스**: MariaDB
- **외부 API**: Twelve Data (실시간 시세)
- **클라이언트**: [`stock-client`](https://github.com/jeong-jaehyeon/stock-client) (React + Vite + TailwindCSS)

---

## 🚀 시작하기

```bash
git clone https://github.com/jeong-jaehyeon/stock-server.git
cd stock-server
yarn install
```

`.env` 파일을 프로젝트 루트에 생성:

```env
PORT=3000
DATABASE_USER=root
DATABASE_PASSWORD=yourpassword
DATABASE_NAME=stock_db
DATABASE_HOST=localhost
DATABASE_DIALECT=mariadb
TWELVE_DATA_API_KEY=your_api_key
```

```bash
yarn db:migrate   # 데이터베이스 초기화
yarn dev          # 개발 서버 실행
```

---

## 📌 API

### 1️⃣ 주식 검색 (실시간 시세 조회)

```http
GET /api/stocks?symbol=AAPL
```

```json
{
  "symbol": "AAPL",
  "name": "Apple Inc.",
  "price": 150.50,
  "currency": "USD",
  "exchange": "NASDAQ"
}
```

### 2️⃣ 포트폴리오 추가 (매수)

```http
POST /api/portfolio
```

```json
{ "symbol": "AAPL", "buyPrice": 150.5, "quantity": 10 }
```

- 같은 종목을 중복 추가하면 **평균 매수 단가 자동 조정**
- 거래 내역(`trade_history`)에 `BUY` 기록 추가

### 3️⃣ 포트폴리오 조회

```http
GET /api/portfolio
```

```json
[
  {
    "symbol": "AAPL",
    "name": "Apple Inc.",
    "quantity": 10,
    "buyPrice": 150.5,
    "currentPrice": 155.0,
    "profitLoss": 4.5
  }
]
```

- 현재가 기반 **수익/손실(`profitLoss`) 계산** 제공

### 4️⃣ 매도

```http
POST /api/portfolio/sell/AAPL
```

```json
{ "sellPrice": 160, "quantity": 5 }
```

```json
{
  "message": "AAPL 주식을 5개 매도 완료.",
  "remainingQuantity": 5,
  "profitLoss": 50
}
```

- 부분 매도 시 남은 수량 업데이트, 전량 매도 시 포트폴리오에서 삭제
- `trade_history`에 `SELL` 기록 + 실현 손익 계산

### 5️⃣ 포트폴리오 삭제

```http
DELETE /api/portfolio/AAPL
```

---

## 🗄️ 데이터 모델

| 테이블 | 역할 |
|---|---|
| `portfolios` | 현재 보유 주식 정보 |
| `trade_history` | 매수/매도 내역 (`portfolios`와 1:N) |

```typescript
Portfolio.hasMany(TradeHistory, { foreignKey: 'portfolioId', onDelete: 'CASCADE' })
TradeHistory.belongsTo(Portfolio, { foreignKey: 'portfolioId' })
```

포트폴리오 삭제 시 관련 거래 기록도 함께 삭제됩니다(CASCADE).

---

## 🔧 에러 핸들링

- `express-async-errors` — 비동기 라우트의 에러를 글로벌 핸들러로 자동 전달
- `http-errors` — 일관된 HTTP 상태 코드와 메시지 반환

```ts
if (!symbol) {
  throw createError(400, "symbol은 필수 입력값입니다.")
}
```

---

## 📫 Contact

`wolgus104@naver.com`

### 6️⃣ 거래 내역 조회 (전체)
```http
GET /api/trade-history
```
인증된 사용자의 모든 매수/매도 내역을 최신순으로 반환합니다.

### 7️⃣ 거래 내역 조회 (종목별)
```http
GET /api/trade-history/AAPL
```
특정 종목의 거래 내역만 필터링하여 반환합니다.

---

## 📚 Swagger API 문서

서버 실행 후 `http://localhost:3000/api-docs`에서 대화형 API 문서를 확인할 수 있습니다 (Try-it-out + JWT Bearer 테스트 지원).

---

## ✅ 진행 상황

- Express + TypeScript + Sequelize 초기 설정, MariaDB 연결
- Twelve Data 실시간 시세 연동, 포트폴리오 CRUD·매수/매도·수익률 계산
- JWT 인증 (회원가입/로그인), 사용자별 포트폴리오 격리
- Pino 로깅, http-errors 기반 에러 핸들링, Swagger/OpenAPI 문서화
- Jest + Supertest + SQLite(in-memory) 테스트 인프라
- 클라이언트 연동: [`stock-client`](https://github.com/jeong-jaehyeon/stock-client)

## 🔜 남은 작업

- Docker 컨테이너화 및 배포 자동화
- 입력 검증 강화 (Zod 스키마)
- WebSocket 실시간 주가 업데이트
- 포트폴리오 성과 분석 기능
