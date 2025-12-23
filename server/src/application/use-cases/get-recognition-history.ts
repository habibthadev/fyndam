import { z } from "zod";
import type { RecognitionRepository } from "../../domain/recognition-repository.js";
import type { Recognition } from "../../domain/recognition.js";

const GetRecognitionHistoryInputSchema = z.object({
  limit: z.number().positive().max(100).default(50),
  offset: z.number().nonnegative().default(0),
});

type GetRecognitionHistoryInput = z.infer<
  typeof GetRecognitionHistoryInputSchema
>;

interface GetRecognitionHistoryOutput {
  items: Recognition[];
  total: number;
  limit: number;
  offset: number;
}

export class GetRecognitionHistoryUseCase {
  constructor(private readonly recognitionRepository: RecognitionRepository) {}

  async execute(
    input?: Partial<GetRecognitionHistoryInput>
  ): Promise<GetRecognitionHistoryOutput> {
    const validated = GetRecognitionHistoryInputSchema.parse(input || {});

    const [items, total] = await Promise.all([
      this.recognitionRepository.findAll(validated.limit, validated.offset),
      this.recognitionRepository.count(),
    ]);

    return {
      items,
      total,
      limit: validated.limit,
      offset: validated.offset,
    };
  }
}
