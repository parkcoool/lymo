import { ErrorCode } from "@lymo/schemas/error";

export default class CommonError extends Error {
  code: string;

  constructor(errorCode: ErrorCode, message?: string) {
    super(message || errorCode);
    this.name = "CommonError";
    this.code = errorCode;
  }
}
