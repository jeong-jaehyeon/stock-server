import pino from "pino"

const logger = pino({
  // 로그의 최소 출력 수준을 설정합니다.
  // 'info'로 설정하면 info 이상 레벨 (info, warn, error, fatal)만 출력됩니다.
  level: "info",

  // 로그를 사람이 보기 좋은 형태로 출력하기 위한 설정입니다.
  transport: {
    // 'pino-pretty'를 사용하여 JSON 로그를 보기 쉽게 출력합니다.
    target: "pino-pretty",

    // 'pino-pretty'에 전달할 옵션들입니다.
    options: {
      // 터미널에 컬러를 입혀서 구분을 쉽게 합니다.
      colorize: true,

      // 로그 시간 포맷을 'yyyy-mm-dd HH:MM:ss.밀리초'로 출력합니다.
      translateTime: "yyyy-mm-dd HH:MM:ss.l",

      // 로그 출력에서 pid(프로세스 ID), hostname(호스트명)은 생략합니다.
      ignore: "pid,hostname",
    },
  },
})

export default logger
