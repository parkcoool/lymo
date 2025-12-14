import { ErrorCode } from "@lymo/schemas/error";

export default class KnownError extends Error {
  code: ErrorCode;

  constructor(errorCode: ErrorCode, message?: string) {
    super(message);
    this.name = "KnownError";
    this.code = errorCode;
  }
}
