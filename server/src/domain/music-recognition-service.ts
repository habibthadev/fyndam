import type { AuddResponse } from "./audd-response.js";

export interface MusicRecognitionService {
  recognizeFromFile(
    audioBuffer: Buffer,
    fileName: string
  ): Promise<AuddResponse>;
  recognizeFromStream(audioChunks: Buffer[]): Promise<AuddResponse>;
}
