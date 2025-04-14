/**
 * ✅ 커스텀 Express 타입 선언 확장 (Declaration Merging)
 *
 * 이 파일은 TypeScript에게 `req.user`라는 속성이 있다는 것을 알려주기 위한 목적이다.
 * 기본적으로 Express의 Request 객체에는 `user` 속성이 정의되어 있지 않기 때문에,
 * 커스텀 미들웨어 (ex: authenticateUser)에서 `req.user = decoded` 와 같은 코드에 대해 타입 에러가 발생한다.
 *
 * 이를 해결하기 위해 TypeScript의 Declaration Merging 기능을 활용한다.
 * `declare module "express-serve-static-core"` 를 선언하여 기존 Express Request 타입을 확장하고,
 * 그 안에 우리가 사용하는 `user` 속성을 명시적으로 추가해준다.
 *
 * 이 선언 파일은 실행 코드로 컴파일되지 않고 타입 체크 시에만 사용되며,
 * 프로젝트 전역에서 자동으로 타입 확장 효과를 적용받을 수 있다.
 */

// ❗️Express의 Request 객체에 `user` 속성을 타입으로 추가해주는 선언 파일
import { UserPayload } from "types/custom"

declare global {
  namespace Express {
    interface Request {
      user?: UserPayload
    }
  }
}
