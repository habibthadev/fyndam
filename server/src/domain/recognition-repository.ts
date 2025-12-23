import type { Recognition, CreateRecognition } from "./recognition.js";

export interface RecognitionRepository {
  create(recognition: CreateRecognition): Promise<Recognition>;
  findById(id: string): Promise<Recognition | null>;
  findAll(limit?: number, offset?: number): Promise<Recognition[]>;
  count(): Promise<number>;
}
