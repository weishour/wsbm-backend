export enum ApiCode {
  TIMEOUT = -1, // 系统繁忙
  SUCCESS = 0, // 成功

  PARAM_ERROR = 10000, // 参数验证错误
  USER_ID_INVALID = 10001, // 用户id无效
  USER_NAME_INVALID = 10002, // 用户名称无效
  USER_EMAIL_INVALID = 10003, // 用户邮箱无效
  USER_PASSWORD_INVALID = 10004, // 用户密码无效
}
