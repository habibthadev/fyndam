import type { Request, Response, NextFunction, RequestHandler } from "express";
import multer from "multer";
import { RecognizeFromUploadUseCase } from "../../application/use-cases/recognize-from-upload.js";
import { toRecognitionResponse } from "../dto/recognition-dto.js";
import { AppError } from "../middleware/error-handler.js";
import { env } from "../../infrastructure/config/env.js";

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: env.MAX_FILE_SIZE_MB * 1024 * 1024,
  },
  fileFilter: (_req, file, cb) => {
    const allowedMimes = [
      "audio/mpeg",
      "audio/mp3",
      "audio/wav",
      "audio/x-wav",
      "audio/mp4",
      "audio/x-m4a",
    ];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new AppError(
          400,
          "Invalid file type. Only mp3, wav, and m4a are allowed."
        )
      );
    }
  },
});

export class RecognitionController {
  constructor(
    private readonly recognizeFromUploadUseCase: RecognizeFromUploadUseCase
  ) {}

  uploadMiddleware: RequestHandler = upload.single("audio");

  recognizeUpload: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      if (!req.file) {
        throw new AppError(400, "Audio file is required");
      }

      const recognition = await this.recognizeFromUploadUseCase.execute({
        audioBuffer: req.file.buffer,
        fileName: req.file.originalname,
        fileSize: req.file.size,
        mimeType: req.file.mimetype,
      });

      res.status(200).json(toRecognitionResponse(recognition));
    } catch (error) {
      next(error);
    }
  };
}
