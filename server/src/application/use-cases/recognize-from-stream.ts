import { z } from "zod";
import type { RecognitionRepository } from "../../domain/recognition-repository.js";
import type { MusicRecognitionService } from "../../domain/music-recognition-service.js";
import type { Recognition } from "../../domain/recognition.js";
import { AudioMetadataSchema } from "../../domain/audio-metadata.js";

const RecognizeFromStreamInputSchema = z.object({
  audioChunks: z.array(z.instanceof(Buffer)),
  format: z.enum(["mp3", "wav", "m4a"]).default("mp3"),
});

type RecognizeFromStreamInput = z.infer<typeof RecognizeFromStreamInputSchema>;

export class RecognizeFromStreamUseCase {
  constructor(
    private readonly recognitionRepository: RecognitionRepository,
    private readonly musicRecognitionService: MusicRecognitionService
  ) {}

  async execute(input: RecognizeFromStreamInput): Promise<Recognition> {
    const validated = RecognizeFromStreamInputSchema.parse(input);

    const auddResponse = await this.musicRecognitionService.recognizeFromStream(
      validated.audioChunks
    );

    const totalSize = validated.audioChunks.reduce(
      (sum, chunk) => sum + chunk.length,
      0
    );
    const duration = Math.max(1, Math.floor(totalSize / 16000));

    const audioMetadata = AudioMetadataSchema.parse({
      duration,
      format: validated.format,
      size: totalSize,
    });

    const recognition = await this.recognitionRepository.create({
      timestamp: new Date(),
      inputType: "live",
      auddResponse,
      audioMetadata,
      confidence: undefined,
    });

    return recognition;
  }
}
