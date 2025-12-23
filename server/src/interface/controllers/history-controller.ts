import type { Request, Response, NextFunction, RequestHandler } from "express";
import { GetRecognitionHistoryUseCase } from "../../application/use-cases/get-recognition-history.js";
import { GetRecognitionByIdUseCase } from "../../application/use-cases/get-recognition-by-id.js";
import { toRecognitionResponse } from "../dto/recognition-dto.js";
import { AppError } from "../middleware/error-handler.js";

export class HistoryController {
  constructor(
    private readonly getRecognitionHistoryUseCase: GetRecognitionHistoryUseCase,
    private readonly getRecognitionByIdUseCase: GetRecognitionByIdUseCase
  ) {}

  getHistory: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const limit = req.query.limit ? Number(req.query.limit) : 50;
      const offset = req.query.offset ? Number(req.query.offset) : 0;

      const result = await this.getRecognitionHistoryUseCase.execute({
        limit,
        offset,
      });

      res.status(200).json({
        items: result.items.map(toRecognitionResponse),
        total: result.total,
        limit: result.limit,
        offset: result.offset,
      });
    } catch (error) {
      next(error);
    }
  };

  getById: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;

      const recognition = await this.getRecognitionByIdUseCase.execute({ id });

      if (!recognition) {
        throw new AppError(404, "Recognition not found");
      }

      res.status(200).json(toRecognitionResponse(recognition));
    } catch (error) {
      next(error);
    }
  };
}
