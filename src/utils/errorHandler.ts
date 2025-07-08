import { Request, Response, NextFunction } from 'express';

// Custom error classes
export class ValidationError extends Error {
  statusCode: number;
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
    this.statusCode = 400;
  }
}

export class NotFoundError extends Error {
  statusCode: number;
  constructor(message: string = 'Resource not found') {
    super(message);
    this.name = 'NotFoundError';
    this.statusCode = 404;
  }
}

export class UnauthorizedError extends Error {
  statusCode: number;
  constructor(message: string = 'Unauthorized') {
    super(message);
    this.name = 'UnauthorizedError';
    this.statusCode = 401;
  }
}

export class ForbiddenError extends Error {
  statusCode: number;
  constructor(message: string = 'Forbidden') {
    super(message);
    this.name = 'ForbiddenError';
    this.statusCode = 403;
  }
}

export class ConflictError extends Error {
  statusCode: number;
  constructor(message: string) {
    super(message);
    this.name = 'ConflictError';
    this.statusCode = 409;
  }
}

export class InternalServerError extends Error {
  statusCode: number;
  constructor(message: string = 'Internal server error') {
    super(message);
    this.name = 'InternalServerError';
    this.statusCode = 500;
  }
}

export class ServiceUnavailableError extends Error {
  statusCode: number;
  constructor(message: string = 'Service unavailable') {
    super(message);
    this.name = 'ServiceUnavailableError';
    this.statusCode = 503;
  }
}

// Error handler wrapper for async functions
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// Global error handler middleware
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = 500;
  let message = 'Internal server error';

  // Handle custom errors
  if (err instanceof ValidationError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err instanceof NotFoundError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err instanceof UnauthorizedError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err instanceof ForbiddenError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err instanceof ConflictError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err instanceof ServiceUnavailableError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err instanceof InternalServerError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err.name === 'PrismaClientKnownRequestError') {
    // Handle Prisma errors
    const prismaError = err as any;
    if (prismaError.code === 'P2002') {
      statusCode = 409;
      message = 'Resource already exists';
    } else if (prismaError.code === 'P2025') {
      statusCode = 404;
      message = 'Resource not found';
    } else {
      statusCode = 400;
      message = 'Database operation failed';
    }
  } else if (err.name === 'PrismaClientValidationError') {
    statusCode = 400;
    message = 'Invalid data provided';
  } else if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
  } else if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired';
  } else {
    // Log unexpected errors
    console.error('Unexpected error:', err);
  }

  res.status(statusCode).json({
    error: {
      message,
      statusCode,
      timestamp: new Date().toISOString(),
      path: req.path,
      method: req.method
    }
  });
};

// Helper function to create error responses
export const createErrorResponse = (res: Response, statusCode: number, message: string) => {
  return res.status(statusCode).json({
    error: {
      message,
      statusCode,
      timestamp: new Date().toISOString()
    }
  });
}; 