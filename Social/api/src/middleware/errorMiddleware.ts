import { Request, Response, NextFunction } from "express";

interface CustomError extends Error {
  statusCode?: number;
  code?: number;
  keyValue?: Record<string, string>;
  errors?: Record<string, { message: string }>;
}

const errorMiddleware = (error: unknown, req: Request, res: Response, next: NextFunction) => {
  const defaultError = {
    statusCode: 500,
    success: "failed",
    message: "Something went wrong",
  };

  if (typeof error === "object" && error !== null) {
    const err = error as CustomError;

    if (err.name === "ValidationError" && err.errors) {
      defaultError.statusCode = 400;
      defaultError.message = Object.values(err.errors)
        .map((el) => el.message)
        .join(", ");
    }

    if (err.code === 11000 && err.keyValue) {
      defaultError.statusCode = 409;
      defaultError.message = `${Object.values(err.keyValue).join(", ")} field has to be unique!`;
    }
  }

  res.status(defaultError.statusCode).json({
    success: defaultError.success,
    message: defaultError.message,
  });
};

export default errorMiddleware;
