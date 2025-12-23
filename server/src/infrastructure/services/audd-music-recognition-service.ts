import FormData from "form-data";
import axios from "axios";
import type { MusicRecognitionService } from "../../domain/music-recognition-service.js";
import type { AuddResponse } from "../../domain/audd-response.js";
import { AuddResponseSchema } from "../../domain/audd-response.js";
import { env } from "../config/env.js";
import { logger } from "../config/logger.js";

export class AuddMusicRecognitionService implements MusicRecognitionService {
  private readonly apiUrl = "https://api.audd.io/";
  private readonly apiKey: string;

  constructor(apiKey: string = env.AUDD_API_KEY) {
    this.apiKey = apiKey;
  }

  async recognizeFromFile(
    audioBuffer: Buffer,
    fileName: string
  ): Promise<AuddResponse> {
    const form = new FormData();
    form.append("api_token", this.apiKey);
    form.append("file", audioBuffer, fileName);
    form.append("return", "apple_music,spotify,lyrics");

    try {
      const response = await axios.post(this.apiUrl, form, {
        headers: {
          ...form.getHeaders(),
        },
      });

      const validated = AuddResponseSchema.parse(response.data);

      if (validated.status === "error") {
        const errorMessage =
          validated.error?.error_message || "Unknown error from AudD API";
        const errorCode = validated.error?.error_code;
        logger.error(
          { errorCode, errorMessage, status: validated.status },
          "Recognition failed - AudD API returned error status"
        );
        throw new Error(`AudD API error: ${errorMessage}`);
      }

      logger.debug({ result: validated }, "Recognition completed");

      return validated;
    } catch (error) {
      if (error instanceof Error) {
        logger.error(
          { error: error.message, fileName, stack: error.stack },
          "Recognition failed"
        );
      } else {
        logger.error({ error, fileName }, "Recognition failed");
      }
      throw error;
    }
  }

  async recognizeFromStream(audioChunks: Buffer[]): Promise<AuddResponse> {
    const combinedBuffer = Buffer.concat(audioChunks);
    return this.recognizeFromFile(combinedBuffer, "stream.mp3");
  }
}
