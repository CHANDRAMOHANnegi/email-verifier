class ServerResponse {
  success: boolean;
  message: string;
  value: any;
  httpCode: number;

  constructor(success: boolean, message: string, value: any, httpCode?: number) {
    this.success = success;
    this.message = message;
    this.value = value;
    this.httpCode = httpCode;
  }

  static success(message?: string, value?: any) {
    return new ServerResponse(true, message, value, 200);
  }

  static error(message: string, value?: any, httpCode?: number) {
    return new ServerResponse(false, message, value, httpCode);
  }
}

export default ServerResponse;
