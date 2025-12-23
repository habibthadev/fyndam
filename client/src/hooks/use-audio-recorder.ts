import { useCallback, useRef, useState } from "react";
import { useAudioRecordingStore } from "../stores/audio-recording-store";

interface UseAudioRecorderOptions {
  onChunk?: (chunk: string) => void;
  onError?: (error: Error) => void;
}

export const useAudioRecorder = (options: UseAudioRecorderOptions = {}) => {
  const { onChunk, onError } = options;
  const [isSupported, setIsSupported] = useState(true);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const {
    isRecording,
    startRecording: setRecording,
    stopRecording: setNotRecording,
    addChunk,
  } = useAudioRecordingStore();

  const startRecording = useCallback(async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setIsSupported(false);
        throw new Error("Media recording is not supported in this browser");
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const mimeType = MediaRecorder.isTypeSupported("audio/webm")
        ? "audio/webm"
        : "audio/mp4";

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType,
        audioBitsPerSecond: 128000,
      });

      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          const reader = new FileReader();
          reader.onloadend = () => {
            const base64 = (reader.result as string).split(",")[1];
            addChunk(base64);
            onChunk?.(base64);
          };
          reader.readAsDataURL(event.data);
        }
      };

      mediaRecorder.onerror = () => {
        const error = new Error("MediaRecorder error");
        onError?.(error);
      };

      mediaRecorder.start(1000);
      setRecording();
    } catch (error) {
      onError?.(error as Error);
      throw error;
    }
  }, [addChunk, onChunk, onError, setRecording]);

  const stopRecording = useCallback(() => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      mediaRecorderRef.current.stop();
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    setNotRecording();
  }, [setNotRecording]);

  return {
    startRecording,
    stopRecording,
    isRecording,
    isSupported,
  };
};
