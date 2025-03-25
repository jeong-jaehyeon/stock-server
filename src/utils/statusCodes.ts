import { StatusCodes as HttpStatus } from "http-status-codes"

export const StatusCodes = {
  ...HttpStatus,

  // ✅ Custom Status Codes (1000번대 이상 사용 권장)
  // 예시
  BUSINESS_LOGIC_FAILURE: 1001,
  DATA_VALIDATION_FAILED: 1002,
  EXTERNAL_API_ERROR: 1003,
}
