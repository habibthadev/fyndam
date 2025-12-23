import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

const envSchema = z.object({
  AUDD_API_KEY: z.string().min(1),
  MONGODB_URI: z.string().url(),
  PORT: z
    .string()
    .transform(Number)
    .pipe(z.number().positive())
    .default("3000"),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  ALLOWED_ORIGINS: z.string().default("http://localhost:5173"),
  MAX_FILE_SIZE_MB: z
    .string()
    .transform(Number)
    .pipe(z.number().positive())
    .default("10"),
  RATE_LIMIT_WINDOW_MS: z
    .string()
    .transform(Number)
    .pipe(z.number().positive())
    .default("900000"),
  RATE_LIMIT_MAX_REQUESTS: z
    .string()
    .transform(Number)
    .pipe(z.number().positive())
    .default("100"),
});

export type Env = z.infer<typeof envSchema>;

export const validateEnv = (): Env => {
  const parsed = envSchema.safeParse(process.env);

  if (!parsed.success) {
    console.error("Environment validation failed:", parsed.error.format());
    throw new Error("Invalid environment variables");
  }

  return parsed.data;
};

export const env = validateEnv();
