import { ErrorCode } from "@lymo/schemas/error";

export default class CommonError extends Error {
  code: ErrorCode;

  constructor(errorCode: ErrorCode, message?: string) {
    super(message);
    this.name = "CommonError";
    this.code = errorCode;
  }
}
