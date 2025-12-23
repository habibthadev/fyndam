import { create } from "zustand";

interface AudioRecordingStore {
  isRecording: boolean;
  audioChunks: string[];
  startRecording: () => void;
  stopRecording: () => void;
  addChunk: (chunk: string) => void;
  clearChunks: () => void;
}

export const useAudioRecordingStore = create<AudioRecordingStore>((set) => ({
  isRecording: false,
  audioChunks: [],
  startRecording: () => set({ isRecording: true, audioChunks: [] }),
  stopRecording: () => set({ isRecording: false }),
  addChunk: (chunk) =>
    set((state) => ({ audioChunks: [...state.audioChunks, chunk] })),
  clearChunks: () => set({ audioChunks: [] }),
}));
