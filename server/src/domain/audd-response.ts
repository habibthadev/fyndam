import { z } from "zod";

export const AuddResponseSchema = z.object({
  status: z.string(),
  error: z
    .object({
      error_code: z.number().optional(),
      error_message: z.string().optional(),
    })
    .optional(),
  result: z
    .object({
      artist: z.string().optional(),
      title: z.string().optional(),
      album: z.string().optional(),
      release_date: z.string().optional(),
      label: z.string().optional(),
      timecode: z.string().optional(),
      song_link: z.string().url().optional(),
      apple_music: z
        .object({
          previews: z.array(z.object({ url: z.string().url() })).optional(),
          artwork: z.object({ url: z.string().url() }).optional(),
          artistName: z.string().optional(),
          url: z.string().url().optional(),
          discNumber: z.number().optional(),
          genreNames: z.array(z.string()).optional(),
          durationInMillis: z.number().optional(),
          releaseDate: z.string().optional(),
          name: z.string().optional(),
          isrc: z.string().optional(),
          albumName: z.string().optional(),
          playParams: z.object({ id: z.string(), kind: z.string() }).optional(),
          trackNumber: z.number().optional(),
          composerName: z.string().optional(),
        })
        .optional(),
      spotify: z
        .object({
          album: z
            .object({
              name: z.string().optional(),
              images: z.array(z.object({ url: z.string().url() })).optional(),
              release_date: z.string().optional(),
            })
            .optional(),
          external_urls: z.object({ spotify: z.string().url() }).optional(),
          name: z.string().optional(),
          artists: z
            .array(z.object({ name: z.string(), id: z.string() }))
            .optional(),
          id: z.string().optional(),
        })
        .optional(),
      lyrics: z
        .object({
          lyrics: z.string().optional(),
          media: z.string().optional(),
        })
        .optional(),
    })
    .optional()
    .nullable(),
});

export type AuddResponse = z.infer<typeof AuddResponseSchema>;
