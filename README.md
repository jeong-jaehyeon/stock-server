# 📈 Stock Portfolio API (주식 포트폴리오 관리 서비스)

이 프로젝트는 사용자가 자신의 **주식 포트폴리오를 관리**할 수 있도록 하는 웹 서비스입니다.  
Twelve Data API를 활용하여 **실시간 주가 데이터 조회 및 포트폴리오 관리** 기능을 제공합니다.

---

## 📌 1. 프로젝트 개요

- **프론트엔드**: 추후 구현 예정
- **백엔드**: Express.js + TypeScript
- **데이터베이스**: MariaDB + Sequelize
- **API 제공**: Twelve Data API 사용
- **로깅**: Pino 로그 시스템 사용

---

## 📌 2. 프로젝트 설치 및 실행

### 1️⃣ 프로젝트 클론 및 환경 설정
```bash
git clone https://github.com/jeong-jaehyeon/stock-server.git
cd stock-server
yarn install
```

### 2️⃣ 환경 변수 설정 (`.env` 파일)
`.env` 파일을 프로젝트 루트에 생성 후, 아래 내용을 추가:
```env
PORT=3000
DATABASE_USER=root
DATABASE_PASSWORD=yourpassword
DATABASE_NAME=stock_db
DATABASE_HOST=localhost
DATABASE_DIALECT=mariadb
TWELVE_DATA_API_KEY=your_api_key
```

### 3️⃣ 데이터베이스 초기화
```bash
yarn db:migrate
```

### 4️⃣ 서버 실행
```bash
yarn dev
```

---

## 📌 3. 프로젝트 구조

```
📦 src
├── config             # 데이터베이스, 외부 설정 관련 파일
├── controllers        # 요청을 처리하는 컨트롤러 함수들
├── middleware         # 커스텀 미들웨어 (예: 로깅)
├── models             # Sequelize 모델 정의
├── routes             # API 라우트 정의
├── services           # 비즈니스 로직 담당
├── utils              # 헬퍼 유틸리티 함수 및 상수
├── app.ts             # 앱 설정 및 서버 실행 준비
├── server.ts          # 서버 생성 및 미들웨어 설정
└── ...
```


## 📌 4. API 사용법

### **1️⃣ 주식 검색 (실시간 시세 조회)**
📌 특정 주식의 실시간 데이터를 조회합니다.
```http
GET /api/stocks?symbol=AAPL
```
📌 **응답 예시**
```json
{
  "symbol": "AAPL",
  "name": "Apple Inc.",
  "price": 150.50,
  "currency": "USD",
  "exchange": "NASDAQ"
}
```

---

### **2️⃣ 포트폴리오 추가 (매수)**
📌 사용자의 포트폴리오에 주식을 추가합니다.
```http
POST /api/portfolio
```
📌 **요청 바디**
```json
{
  "symbol": "AAPL",
  "buyPrice": 150.5,
  "quantity": 10
}
```
📌 **응답 예시**
```json
{
  "id": 1,
  "symbol": "AAPL",
  "buyPrice": 150.5,
  "quantity": 10,
  "createdAt": "2024-02-10T12:00:00Z"
}
```

✅ **기능 설명**
- 같은 주식을 **중복 추가하면 평균 매수 단가 조정**
- 기존 보유 주식 수량 업데이트
- 거래 내역(`trade_history`) 테이블에 `BUY` 기록 추가됨

---

### **3️⃣ 포트폴리오 조회**
📌 사용자의 현재 포트폴리오를 조회합니다.
```http
GET /api/portfolio
```
📌 **응답 예시**
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

✅ **기능 설명**
- 현재 포트폴리오의 **보유 주식 목록, 수량, 평균 매수 단가 조회**
- 현재가(`currentPrice`)와 **수익률(`profitLoss`) 계산하여 제공**

---

### **4️⃣ 포트폴리오에서 주식 매도**
📌 포트폴리오에서 특정 주식을 매도합니다.
```http
POST /api/portfolio/sell/AAPL
```
📌 **요청 바디**
```json
{
  "sellPrice": 160,
  "quantity": 5
}
```
📌 **응답 예시**
```json
{
  "message": "AAPL 주식을 5개 매도 완료.",
  "remainingQuantity": 5,
  "profitLoss": 50
}
```

✅ **기능 설명**
- 보유 주식의 일부만 매도할 경우, **남은 수량 업데이트**
- **전량 매도 시 포트폴리오에서 삭제**
- 거래 내역(`trade_history`) 테이블에 `SELL` 기록 추가됨
- 매도 시 발생한 수익/손실(`profitLoss`) 계산됨

---

### **5️⃣ 포트폴리오에서 주식 삭제**
📌 포트폴리오에서 특정 주식을 완전히 제거합니다.
```http
DELETE /api/portfolio/AAPL
```
📌 **응답 예시**
```json
{
  "message": "AAPL removed from portfolio"
}
```

✅ **기능 설명**
- 포트폴리오에서 **해당 주식을 완전히 삭제**
- 거래 내역(`trade_history`)에는 영향을 주지 않음

---

## 📌 5. API 테스트 (Postman)
Postman으로 전체 API를 손쉽게 테스트할 수 있습니다.  
아래 링크를 통해 API 요청 목록과 예제들을 확인하고 직접 실행해보세요.

🔗 **[📬 Postman API 테스트 문서 바로가기](https://documenter.getpostman.com/view/6398206/2sB2cUB3RR)**

---

## 📌 6. 에러 핸들링 개선 (2025-03-11)

- ✅ `express-async-errors` 적용
  - 비동기 함수에서 발생하는 에러가 자동으로 `Express`의 에러 핸들러로 전달됨.
  - `try-catch`를 일일이 작성하지 않아도 되므로 코드가 깔끔해짐.

- ✅ `http-errors` 적용
  - 명확하고 일관된 에러 메시지와 HTTP 상태 코드를 반환하도록 개선.
  - 예시:
    ```ts
    import createError from "http-errors"

    if (!symbol) {
      throw createError(StatusCodes.BAD_REQUEST, "symbol은 필수 입력값입니다.")
    }
    ```

- ✅ 개선된 글로벌 에러 핸들러 예시
    ```ts
    app.use((err: HttpError, req: Request, res: Response, _next: NextFunction) => {
      console.error(err.stack)
      res.status(err.status || StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: err.message || "서버 내부 오류가 발생했습니다.",
      })
    })
    ```

---

## 📌 7. 데이터베이스 구조

### ✅ 테이블 1: `portfolios`
- 사용자의 **현재 보유 주식 정보**를 저장하는 테이블입니다.
### ✅ 테이블 2: `trade_history`
- 주식의 **매수/매도 내역**을 기록하는 테이블입니다.
- `portfolioId`를 통해 `portfolios` 테이블과 **1:N 관계**로 연결됩니다.

### ✅ 관계 (Associations)
- `Portfolio`(1) ↔ `TradeHistory`(N) 관계
- 하나의 포트폴리오에 여러 개의 거래 기록이 연결됩니다.

```typescript
Portfolio.hasMany(TradeHistory, { foreignKey: 'portfolioId', onDelete: 'CASCADE' })
TradeHistory.belongsTo(Portfolio, { foreignKey: 'portfolioId' })
```

- 포트폴리오 삭제 시, 관련된 거래 기록도 함께 삭제됩니다.

---

## 📌 8. 로깅시스템
- ✅ pino 기반으로 빠르고 효율적인 로그 기록
- ✅ @utils/logger.ts 파일에서 기본 로거 정의
- ✅ API 요청 및 응답 로그는 requestLogger 미들웨어에서 처리

📌 **응답 예시**
```
[2025-04-04 13:54:46.893] INFO: 📥 요청 시작: POST /api/portfolio
[2025-04-04 13:54:46.910] INFO: ✅ 응답 완료: POST /api/portfolio 201 - 17.3ms
```

## 📌 9. 현재까지 진행한 작업
✅ Express + TypeScript + Sequelize 초기 설정
✅ MariaDB 연결 및 stock_db 생성
✅ Twelve Data API 연동하여 주식 데이터 조회 구현
✅ `Portfolio`, `TradeHistory` 테이블 생성 및 관계 설정 완료
✅ 포트폴리오 CRUD 기능 구현
✅ 매수/매도 내역 기록 및 수익률 계산 추가
✅ 오류 핸들링 개선 (http-errors, express-async-errors 적용)
✅ Pino 로깅 도입 및 API 요청/응답 전반 로그 기록 기능 구현
✅ Sequelize 초기화 로직 유틸 파일(@config/db)로 분리
✅ HTTP 상태 코드 유틸(@utils/statusCodes) 적용
---

## 📌 10. 앞으로 할 작업
🔜 포트폴리오 수정 기능 (단가 조정 등)
🔜 거래 내역 리스트 API
🔜 Swagger 또는 Postman API 문서 추가
🔜 JWT 기반 로그인 → userId 기반으로 포트폴리오 관리
🔜 프론트엔드 개발 연동
---

## 📌 11. 기타
- **문의 email:** `wolgus104@naver.com`
- **문의 phone:** `01023392750`
- **API 문서:** Postman 링크 추가 예정
