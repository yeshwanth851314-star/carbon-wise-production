export class ApplicationError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode = 500, isOperational = true) {
    super(message);
    this.name = "ApplicationError";
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends ApplicationError {
  public details?: unknown;

  constructor(message: string, details?: unknown) {
    super(message, 400);
    this.name = "ValidationError";
    this.details = details;
  }
}

export class ApiError extends ApplicationError {
  constructor(message: string, statusCode = 500) {
    super(message, statusCode);
    this.name = "ApiError";
  }
}
