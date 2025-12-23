import { describe, it, expect, beforeEach, vi } from "vitest";
import { GetRecognitionHistoryUseCase } from "../../application/use-cases/get-recognition-history.js";
import type { RecognitionRepository } from "../../domain/recognition-repository.js";

describe("GetRecognitionHistoryUseCase", () => {
  let useCase: GetRecognitionHistoryUseCase;
  let mockRepository: RecognitionRepository;

  beforeEach(() => {
    mockRepository = {
      create: vi.fn(),
      findById: vi.fn(),
      findAll: vi.fn().mockResolvedValue([
        {
          id: "1",
          timestamp: new Date(),
          inputType: "upload",
          auddResponse: { status: "success", result: null },
          audioMetadata: { duration: 10, format: "mp3", size: 1024 },
        },
      ]),
      count: vi.fn().mockResolvedValue(1),
    };

    useCase = new GetRecognitionHistoryUseCase(mockRepository);
  });

  it("should return paginated history", async () => {
    const result = await useCase.execute({ limit: 10, offset: 0 });

    expect(result.items).toHaveLength(1);
    expect(result.total).toBe(1);
    expect(result.limit).toBe(10);
    expect(result.offset).toBe(0);
  });

  it("should use default values when no input provided", async () => {
    const result = await useCase.execute({});

    expect(result.limit).toBe(50);
    expect(result.offset).toBe(0);
  });
});
