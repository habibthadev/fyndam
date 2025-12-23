import { z } from "zod";
import type { Recognition } from "../../domain/recognition.js";

export const RecognitionResponseSchema = z.object({
  id: z.string(),
  timestamp: z.string(),
  inputType: z.enum(["upload", "live"]),
  auddResponse: z.object({
    status: z.string(),
    result: z
      .object({
        artist: z.string().optional(),
        title: z.string().optional(),
        album: z.string().optional(),
        release_date: z.string().optional(),
        label: z.string().optional(),
        timecode: z.string().optional(),
        song_link: z.string().optional(),
        apple_music: z.any().optional(),
        spotify: z.any().optional(),
        lyrics: z.any().optional(),
      })
      .optional()
      .nullable(),
  }),
  audioMetadata: z.object({
    duration: z.number(),
    format: z.enum(["mp3", "wav", "m4a"]),
    size: z.number(),
  }),
  confidence: z.number().optional(),
});

export type RecognitionResponse = z.infer<typeof RecognitionResponseSchema>;

export const toRecognitionResponse = (
  recognition: Recognition
): RecognitionResponse => ({
  id: recognition.id,
  timestamp: recognition.timestamp.toISOString(),
  inputType: recognition.inputType,
  auddResponse: recognition.auddResponse,
  audioMetadata: recognition.audioMetadata,
  confidence: recognition.confidence,
});

export const RecognitionHistoryResponseSchema = z.object({
  items: z.array(RecognitionResponseSchema),
  total: z.number(),
  limit: z.number(),
  offset: z.number(),
});

export type RecognitionHistoryResponse = z.infer<
  typeof RecognitionHistoryResponseSchema
>;

export const ErrorResponseSchema = z.object({
  error: z.string(),
  message: z.string(),
  statusCode: z.number(),
});

export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;
