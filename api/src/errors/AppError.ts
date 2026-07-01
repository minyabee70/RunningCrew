export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public code: string,
    public cause?: unknown
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class NotFoundError extends AppError {
  constructor(message: string) {
    super(message, 404, 'NOT_FOUND');
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string) {
    super(message, 403, 'FORBIDDEN');
  }
}

export class DatabaseError extends AppError {
  constructor(message: string, cause?: unknown) {
    super(message, 503, 'DATABASE_ERROR', cause);
  }
}

export class GeminiTimeoutError extends AppError {
  constructor(message: string) {
    super(message, 504, 'GEMINI_TIMEOUT');
  }
}

export class GeminiApiError extends AppError {
  constructor(message: string, cause?: unknown) {
    super(message, 502, 'GEMINI_API_ERROR', cause);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string) {
    super(message, 401, 'UNAUTHORIZED');
  }
}
