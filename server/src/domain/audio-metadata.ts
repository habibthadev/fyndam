import { z } from "zod";

export const AudioMetadataSchema = z.object({
  duration: z.number().positive(),
  format: z.enum(["mp3", "wav", "m4a"]),
  size: z.number().positive(),
});

export type AudioMetadata = z.infer<typeof AudioMetadataSchema>;
