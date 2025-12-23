import { z } from "zod";
import type { RecognitionRepository } from "../../domain/recognition-repository.js";
import type { Recognition } from "../../domain/recognition.js";

const GetRecognitionByIdInputSchema = z.object({
  id: z.string().min(1),
});

type GetRecognitionByIdInput = z.infer<typeof GetRecognitionByIdInputSchema>;

export class GetRecognitionByIdUseCase {
  constructor(private readonly recognitionRepository: RecognitionRepository) {}

  async execute(input: GetRecognitionByIdInput): Promise<Recognition | null> {
    const validated = GetRecognitionByIdInputSchema.parse(input);
    return this.recognitionRepository.findById(validated.id);
  }
}
