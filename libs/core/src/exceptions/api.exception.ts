import { HttpException, HttpStatus } from '@nestjs/common';

export class ApiException extends HttpException {
  public message: string;
  private code: number;
  private data: any;

  constructor(message: string, statusCode: HttpStatus, code?: number | any, data?: any) {
    super(message, statusCode);

    this.message = message;
    this.code = typeof code === 'number' ? code || statusCode : statusCode;
    this.data = typeof code === 'number' ? data : code;
  }

  get Code(): number {
    return this.code;
  }

  get Message(): string {
    return this.message;
  }

  get Data(): any {
    return this.data;
  }
}
