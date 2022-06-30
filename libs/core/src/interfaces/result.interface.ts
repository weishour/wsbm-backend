export interface Result<T = any> {
  code: number;
  status: boolean;
  message: string;
  data?: T;
  error?: Error;
}
