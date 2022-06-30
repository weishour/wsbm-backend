import { HttpStatus } from "@nestjs/common";

/**
 * 成功返回
 * @param {string} message
 * @param {any} data
 */
export function success(message: string, data?: any) {
  return { code: HttpStatus.OK, status: true, message, data };
}

/**
 * 错误返回
 * @param {string} message
 * @param {Error} error
 */
export function error(message: string, error?: Error) {
  return { code: HttpStatus.NOT_IMPLEMENTED, status: false, message, error };
}
