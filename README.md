# 📈 Stock Portfolio API (주식 포트폴리오 관리 서비스)

이 프로젝트는 사용자가 자신의 **주식 포트폴리오를 관리**할 수 있도록 하는 웹 서비스입니다.  
Twelve Data API를 활용하여 **실시간 주가 데이터 조회 및 포트폴리오 관리** 기능을 제공합니다.

---

## 📌 1. 프로젝트 개요

- **프론트엔드**: 추후 구현 예정
- **백엔드**: Express.js + TypeScript
- **데이터베이스**: MariaDB + Sequelize
- **API 제공**: Twelve Data API 사용

---

## 📌 2. 프로젝트 설치 및 실행

### 1️⃣ 프로젝트 클론 및 환경 설정
```bash
git clone https://github.com/wolgus104@naver.com/stock-server.git
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

## 📌 3. API 사용법

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

## 📌 4. 현재까지 진행한 작업
✅ Express + TypeScript + Sequelize 초기 설정 완료  
✅ MariaDB 연결 및 `stock_db` 생성  
✅ Twelve Data API 연동하여 주식 데이터 조회 구현  
✅ 포트폴리오 데이터베이스 테이블 생성 (`portfolio`)  
✅ 포트폴리오 추가 (`POST /api/portfolio`) 기능 구현  
✅ 포트폴리오 삭제 (`DELETE /api/portfolio/:symbol`) API 구현  
✅ 포트폴리오 조회 (`GET /api/portfolio`) API 구현  
✅ 매도 기능 (`POST /api/portfolio/sell/:symbol`) 구현 완료  
✅ `trade_history` 테이블 추가 및 **매수/매도 내역 기록 기능 반영**  
✅ `profitLoss`(수익/손실) 계산 기능 추가

---

## 📌 5. 앞으로 할 작업
🔜 포트폴리오 추가 시, **중복 주식 처리 및 평균 매수가 계산**  
🔜 포트폴리오 조회 시, **현재 주가 및 손익률 계산 추가**  
🔜 포트폴리오 수정 기능 추가 (매수 단가 변경 가능하게)  
🔜 프론트엔드 개발 시작 (추후 진행)  
🔜 Postman 링크 추가 예정

---

## 📌 6. API 테스트 (Postman)
Postman으로 API를 테스트할 수 있습니다.  
📌 **Postman 링크 추가 예정**

---

## 📌 7. 기타
- **문의:** `wolgus104@naver.com`
- **API 문서:** Postman 링크 추가 예정
