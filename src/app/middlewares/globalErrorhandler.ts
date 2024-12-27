import { NextFunction, Request, Response } from 'express';

const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err.code === 11000) {
    const key = Object.keys(err.keyValue)[0];
    const value = err.keyValue[key];

    return res.status(400).json({
      success: false,
      message: 'Validation error',
      statusCode: 400,
      error: {
        details: [
          {
            path: [key],
            message: `${key} "${value}" already exists.`,
          },
        ],
      },
      stack: err.stack,
    });
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Something went wrong!';

  return res.status(statusCode).json({
    success: false,
    message,
    statusCode,
    error: err,
    stack: err.stack,
  });
};

export default globalErrorHandler;

