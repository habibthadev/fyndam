import type { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { logger } from "../../infrastructure/config/logger.js";

export class AppError extends Error {
  constructor(public statusCode: number, public message: string) {
    super(message);
    this.name = "AppError";
  }
}

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  logger.error({ error, path: req.path, method: req.method }, "Request error");

  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      error: error.name,
      message: error.message,
      statusCode: error.statusCode,
    });
    return;
  }

  if (error instanceof ZodError) {
    res.status(400).json({
      error: "ValidationError",
      message: "Invalid request data",
      statusCode: 400,
      details: error.errors,
    });
    return;
  }

  res.status(500).json({
    error: "InternalServerError",
    message: "An unexpected error occurred",
    statusCode: 500,
  });
};
