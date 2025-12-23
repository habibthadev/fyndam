import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../lib/api-client";

export const useRecognizeUpload = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => apiClient.recognizeUpload(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["history"] });
    },
  });
};

export const useRecognizeStream = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      audioChunks,
      format,
    }: {
      audioChunks: string[];
      format?: "mp3" | "wav" | "m4a";
    }) => apiClient.recognizeStream(audioChunks, format),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["history"] });
    },
  });
};

export const useHistory = (limit = 50, offset = 0) => {
  return useQuery({
    queryKey: ["history", limit, offset],
    queryFn: () => apiClient.getHistory(limit, offset),
  });
};

export const useRecognition = (id: string | undefined) => {
  return useQuery({
    queryKey: ["recognition", id],
    queryFn: () => apiClient.getRecognitionById(id!),
    enabled: !!id,
  });
};

export const useHealth = () => {
  return useQuery({
    queryKey: ["health"],
    queryFn: () => apiClient.checkHealth(),
    refetchInterval: 30000,
  });
};
