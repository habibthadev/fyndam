import { env } from "./env";
import type {
  RecognitionResponse,
  RecognitionHistoryResponse,
  HealthResponse,
} from "../types/api";
import {
  RecognitionResponseSchema,
  RecognitionHistoryResponseSchema,
  HealthResponseSchema,
  ErrorResponseSchema,
} from "../types/api";

export class ApiError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
    this.name = "ApiError";
  }
}

const handleResponse = async <T>(
  response: Response,
  schema: any
): Promise<T> => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const error = ErrorResponseSchema.safeParse(errorData);

    if (error.success) {
      throw new ApiError(error.data.statusCode, error.data.message);
    }

    throw new ApiError(response.status, "An error occurred");
  }

  const data = await response.json();
  return schema.parse(data);
};

export const apiClient = {
  async recognizeUpload(file: File): Promise<RecognitionResponse> {
    const formData = new FormData();
    formData.append("audio", file);

    const response = await fetch(`${env.VITE_API_URL}/recognize/upload`, {
      method: "POST",
      body: formData,
    });

    return handleResponse<RecognitionResponse>(
      response,
      RecognitionResponseSchema
    );
  },

  async recognizeStream(
    audioChunks: string[],
    format: "mp3" | "wav" | "m4a" = "mp3"
  ): Promise<RecognitionResponse> {
    const response = await fetch(`${env.VITE_API_URL}/recognize/stream`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ audioChunks, format }),
    });

    return handleResponse<RecognitionResponse>(
      response,
      RecognitionResponseSchema
    );
  },

  async getHistory(
    limit = 50,
    offset = 0
  ): Promise<RecognitionHistoryResponse> {
    const response = await fetch(
      `${env.VITE_API_URL}/history?limit=${limit}&offset=${offset}`
    );

    return handleResponse<RecognitionHistoryResponse>(
      response,
      RecognitionHistoryResponseSchema
    );
  },

  async getRecognitionById(id: string): Promise<RecognitionResponse> {
    const response = await fetch(`${env.VITE_API_URL}/history/${id}`);

    return handleResponse<RecognitionResponse>(
      response,
      RecognitionResponseSchema
    );
  },

  async checkHealth(): Promise<HealthResponse> {
    const response = await fetch(`${env.VITE_API_URL}/health`);

    return handleResponse<HealthResponse>(response, HealthResponseSchema);
  },
};
