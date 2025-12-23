import type { Request, Response, NextFunction, RequestHandler } from "express";
import { z } from "zod";
import { RecognizeFromStreamUseCase } from "../../application/use-cases/recognize-from-stream.js";
import { toRecognitionResponse } from "../dto/recognition-dto.js";

const StreamRecognitionBodySchema = z.object({
  audioChunks: z.array(z.string()),
  format: z.enum(["mp3", "wav", "m4a"]).default("mp3"),
});

export class StreamController {
  constructor(
    private readonly recognizeFromStreamUseCase: RecognizeFromStreamUseCase
  ) {}

  recognizeStream: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const body = StreamRecognitionBodySchema.parse(req.body);

      const audioChunks = body.audioChunks.map((chunk) =>
        Buffer.from(chunk, "base64")
      );

      const recognition = await this.recognizeFromStreamUseCase.execute({
        audioChunks,
        format: body.format,
      });

      res.status(200).json(toRecognitionResponse(recognition));
    } catch (error) {
      next(error);
    }
  };
}
