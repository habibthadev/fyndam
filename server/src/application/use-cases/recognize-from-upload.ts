import { z } from "zod";
import type { RecognitionRepository } from "../../domain/recognition-repository.js";
import type { MusicRecognitionService } from "../../domain/music-recognition-service.js";
import type { Recognition } from "../../domain/recognition.js";
import { AudioMetadataSchema } from "../../domain/audio-metadata.js";

const RecognizeFromUploadInputSchema = z.object({
  audioBuffer: z.instanceof(Buffer),
  fileName: z.string(),
  fileSize: z.number().positive(),
  mimeType: z.string(),
});

type RecognizeFromUploadInput = z.infer<typeof RecognizeFromUploadInputSchema>;

export class RecognizeFromUploadUseCase {
  constructor(
    private readonly recognitionRepository: RecognitionRepository,
    private readonly musicRecognitionService: MusicRecognitionService
  ) {}

  async execute(input: RecognizeFromUploadInput): Promise<Recognition> {
    const validated = RecognizeFromUploadInputSchema.parse(input);

    const format = this.extractFormat(validated.mimeType);
    const duration = await this.estimateDuration(validated.audioBuffer);

    const auddResponse = await this.musicRecognitionService.recognizeFromFile(
      validated.audioBuffer,
      validated.fileName
    );

    const audioMetadata = AudioMetadataSchema.parse({
      duration,
      format,
      size: validated.fileSize,
    });

    const confidence = this.extractConfidence(auddResponse);

    const recognition = await this.recognitionRepository.create({
      timestamp: new Date(),
      inputType: "upload",
      auddResponse,
      audioMetadata,
      confidence,
    });

    return recognition;
  }

  private extractFormat(mimeType: string): "mp3" | "wav" | "m4a" {
    if (mimeType.includes("mp3") || mimeType.includes("mpeg")) return "mp3";
    if (mimeType.includes("wav")) return "wav";
    if (mimeType.includes("m4a") || mimeType.includes("mp4")) return "m4a";
    return "mp3";
  }

  private async estimateDuration(buffer: Buffer): Promise<number> {
    return Math.max(1, Math.floor(buffer.length / 16000));
  }

  private extractConfidence(_auddResponse: any): number | undefined {
    return undefined;
  }
}
