import express, { type Express } from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import { connectDatabase } from "./infrastructure/config/database.js";
import { logger } from "./infrastructure/config/logger.js";
import { env } from "./infrastructure/config/env.js";
import { MongoRecognitionRepository } from "./infrastructure/database/mongo-recognition-repository.js";
import { AuddMusicRecognitionService } from "./infrastructure/services/audd-music-recognition-service.js";
import { RecognizeFromUploadUseCase } from "./application/use-cases/recognize-from-upload.js";
import { RecognizeFromStreamUseCase } from "./application/use-cases/recognize-from-stream.js";
import { GetRecognitionHistoryUseCase } from "./application/use-cases/get-recognition-history.js";
import { GetRecognitionByIdUseCase } from "./application/use-cases/get-recognition-by-id.js";
import { RecognitionController } from "./interface/controllers/recognition-controller.js";
import { HistoryController } from "./interface/controllers/history-controller.js";
import { StreamController } from "./interface/controllers/stream-controller.js";
import { createApiRouter } from "./interface/routes/api-routes.js";
import { errorHandler } from "./interface/middleware/error-handler.js";
const { openApiSpec } = require("./interface/swagger/openapi-spec.js");

export const createApp = (): Express => {
  const app = express();

  const allowedOrigins = env.ALLOWED_ORIGINS.split(",").map((origin) =>
    origin.trim()
  );

  app.use(
    cors({
      origin: allowedOrigins,
      credentials: true,
    })
  );

  app.use(express.json({ limit: "20mb" }));
  app.use(express.urlencoded({ extended: true, limit: "20mb" }));

  app.use(async (req, res, next) => {
    try {
      await connectDatabase();
      next();
    } catch (error) {
      logger.error({ error }, "Database connection failed in middleware");
      res.status(503).json({ error: "Service temporarily unavailable" });
    }
  });

  const recognitionRepository = new MongoRecognitionRepository();
  const musicRecognitionService = new AuddMusicRecognitionService();

  const recognizeFromUploadUseCase = new RecognizeFromUploadUseCase(
    recognitionRepository,
    musicRecognitionService
  );
  const recognizeFromStreamUseCase = new RecognizeFromStreamUseCase(
    recognitionRepository,
    musicRecognitionService
  );
  const getRecognitionHistoryUseCase = new GetRecognitionHistoryUseCase(
    recognitionRepository
  );
  const getRecognitionByIdUseCase = new GetRecognitionByIdUseCase(
    recognitionRepository
  );

  const recognitionController = new RecognitionController(
    recognizeFromUploadUseCase
  );
  const historyController = new HistoryController(
    getRecognitionHistoryUseCase,
    getRecognitionByIdUseCase
  );
  const streamController = new StreamController(recognizeFromStreamUseCase);

  const apiRouter = createApiRouter(
    recognitionController,
    historyController,
    streamController
  );

  app.use("/api/v1", apiRouter);

  const CSS_URL =
    "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.18.2/swagger-ui.min.css";

  app.use(
    "/api/docs",
    swaggerUi.serve,
    swaggerUi.setup(openApiSpec, { customCssUrl: CSS_URL })
  );

  app.use(errorHandler);

  return app;
};

const app = createApp();

export default app;

const startServer = async (): Promise<void> => {
  try {
    await connectDatabase();

    const port = env.PORT;

    app.listen(port, () => {
      logger.info(`Server running on port ${port}`);
      logger.info(
        `API documentation available at http://localhost:${port}/api/docs`
      );
    });
  } catch (error) {
    logger.error({ error }, "Failed to start server");
    process.exit(1);
  }
};

if (import.meta.url === `file://${process.argv[1]}`) {
  startServer();
}