import { z } from "zod";
import { AudioMetadataSchema } from "./audio-metadata.js";
import { AuddResponseSchema } from "./audd-response.js";

export const RecognitionSchema = z.object({
  id: z.string(),
  timestamp: z.date(),
  inputType: z.enum(["upload", "live"]),
  auddResponse: AuddResponseSchema,
  audioMetadata: AudioMetadataSchema,
  confidence: z.number().min(0).max(1).optional(),
});

export type Recognition = z.infer<typeof RecognitionSchema>;

export const CreateRecognitionSchema = RecognitionSchema.omit({ id: true });
export type CreateRecognition = z.infer<typeof CreateRecognitionSchema>;
