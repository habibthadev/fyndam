import { z } from "zod";

const envSchema = z.object({
  VITE_API_URL: z.string().url().default("http://localhost:3000/api/v1"),
});

const parseEnv = () => {
  const parsed = envSchema.safeParse(import.meta.env);

  if (!parsed.success) {
    console.error("Environment validation failed:", parsed.error.format());
    return envSchema.parse({});
  }

  return parsed.data;
};

export const env = parseEnv();
