import { Router } from "express";
import rateLimit from "express-rate-limit";
import { RecognitionController } from "../controllers/recognition-controller.js";
import { HistoryController } from "../controllers/history-controller.js";
import { StreamController } from "../controllers/stream-controller.js";
import { env } from "../../infrastructure/config/env.js";
import { getDatabaseStatus } from "../../infrastructure/config/database.js";

const limiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.RATE_LIMIT_MAX_REQUESTS,
  message: "Too many requests from this IP, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

export const createApiRouter = (
  recognitionController: RecognitionController,
  historyController: HistoryController,
  streamController: StreamController
): Router => {
  const router = Router();

  router.use(limiter);

  router.post(
    "/recognize/upload",
    recognitionController.uploadMiddleware,
    recognitionController.recognizeUpload
  );

  router.post("/recognize/stream", streamController.recognizeStream);

  router.get("/history", historyController.getHistory);

  router.get("/history/:id", historyController.getById);

  router.get("/health", (_req, res) => {
    const dbStatus = getDatabaseStatus();

    res.status(200).json({
      status: dbStatus.isConnected ? "ok" : "degraded",
      timestamp: new Date().toISOString(),
      database: {
        connected: dbStatus.isConnected,
        state: dbStatus.readyState,
      },
      author: "Habib Adebayo",
    });
  });

  return router;
};
