import { describe, it, expect, beforeEach, vi } from "vitest";
import { RecognizeFromUploadUseCase } from "../../application/use-cases/recognize-from-upload.js";
import type { RecognitionRepository } from "../../domain/recognition-repository.js";
import type { MusicRecognitionService } from "../../domain/music-recognition-service.js";

describe("RecognizeFromUploadUseCase", () => {
  let useCase: RecognizeFromUploadUseCase;
  let mockRepository: RecognitionRepository;
  let mockService: MusicRecognitionService;

  beforeEach(() => {
    mockRepository = {
      create: vi.fn().mockResolvedValue({
        id: "123",
        timestamp: new Date(),
        inputType: "upload",
        auddResponse: { status: "success", result: null },
        audioMetadata: { duration: 10, format: "mp3", size: 1024 },
      }),
      findById: vi.fn(),
      findAll: vi.fn(),
      count: vi.fn(),
    };

    mockService = {
      recognizeFromFile: vi.fn().mockResolvedValue({
        status: "success",
        result: {
          artist: "Test Artist",
          title: "Test Song",
        },
      }),
      recognizeFromStream: vi.fn(),
    };

    useCase = new RecognizeFromUploadUseCase(mockRepository, mockService);
  });

  it("should successfully recognize audio from upload", async () => {
    const input = {
      audioBuffer: Buffer.from("test"),
      fileName: "test.mp3",
      fileSize: 1024,
      mimeType: "audio/mpeg",
    };

    const result = await useCase.execute(input);

    expect(result).toBeDefined();
    expect(result.inputType).toBe("upload");
    expect(mockService.recognizeFromFile).toHaveBeenCalledWith(
      input.audioBuffer,
      input.fileName
    );
    expect(mockRepository.create).toHaveBeenCalled();
  });

  it("should extract correct format from mime type", async () => {
    const input = {
      audioBuffer: Buffer.from("test"),
      fileName: "test.wav",
      fileSize: 1024,
      mimeType: "audio/wav",
    };

    await useCase.execute(input);

    expect(mockRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        audioMetadata: expect.objectContaining({
          format: "wav",
        }),
      })
    );
  });
});
