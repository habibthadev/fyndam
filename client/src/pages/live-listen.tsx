import { useState, useEffect, useRef } from "react";
import { Mic, Square, Loader2, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { useAudioRecorder } from "../hooks/use-audio-recorder";
import { useRecognizeStream } from "../hooks/use-api";
import { useAudioRecordingStore } from "../stores/audio-recording-store";
import { toast } from "sonner";

export const LiveListenPage = () => {
  const navigate = useNavigate();
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const { audioChunks, clearChunks } = useAudioRecordingStore();
  const recognizeStream = useRecognizeStream();
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const maxDurationTimerRef = useRef<NodeJS.Timeout | null>(null);
  const pageRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);

  const { startRecording, stopRecording, isRecording, isSupported } =
    useAudioRecorder({
      onError: (error) => {
        toast.error(`Recording error: ${error.message}`);
        cleanup();
      },
    });

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(pageRef.current?.children || [], {
        opacity: 0,
        y: 30,
        duration: 0.6,
        stagger: 0.15,
        ease: "power2.out",
      });
    });
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (statusRef.current) {
      gsap.fromTo(
        statusRef.current,
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.7)" }
      );
    }
  }, [isRecording, isProcessing, notFound]);

  const cleanup = () => {
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }
    if (maxDurationTimerRef.current) {
      clearTimeout(maxDurationTimerRef.current);
      maxDurationTimerRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      cleanup();
      if (isRecording) {
        stopRecording();
      }
    };
  }, [isRecording, stopRecording]);

  const handleStart = async () => {
    try {
      clearChunks();
      setRecordingDuration(0);
      setNotFound(false);
      setIsProcessing(false);
      await startRecording();

      recordingTimerRef.current = setInterval(() => {
        setRecordingDuration((prev) => prev + 1);
      }, 1000);

      maxDurationTimerRef.current = setTimeout(async () => {
        await handleAutoStop(true);
      }, 15000);
    } catch (error) {
      toast.error("Failed to start recording");
      cleanup();
    }
  };

  const handleAutoStop = async (showNotFound = false) => {
    cleanup();
    stopRecording();
    setIsProcessing(true);

    if (audioChunks.length === 0) {
      setIsProcessing(false);
      if (showNotFound) {
        setNotFound(true);
        toast.error("No music found in 15 seconds");
      }
      return;
    }

    try {
      const result = await recognizeStream.mutateAsync({
        audioChunks,
        format: "mp3",
      });

      if (result.auddResponse.result) {
        toast.success("Music recognized!");
        navigate(`/recognition/${result.id}`);
      } else {
        setIsProcessing(false);
        setNotFound(true);
        toast.error("No music found");
      }
    } catch (error: any) {
      setIsProcessing(false);
      setNotFound(true);
      toast.error(error.message || "Recognition failed");
    }
  };

  const handleManualStop = async () => {
    await handleAutoStop(false);
  };

  if (!isSupported) {
    return (
      <div className="max-w-2xl mx-auto px-4 md:px-0">
        <Card>
          <CardHeader>
            <CardTitle>Browser Not Supported</CardTitle>
            <CardDescription>
              Your browser does not support audio recording. Please try a modern
              browser like Chrome, Firefox, or Safari.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div ref={pageRef} className="max-w-2xl mx-auto space-y-6 px-4 md:px-0">
      <div className="text-center space-y-2">
        <h1 className="text-3xl md:text-4xl font-bold">Live Listen</h1>
        <p className="text-sm md:text-base text-muted-foreground">
          Recording will automatically stop and process after 15 seconds
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl md:text-2xl">
            Microphone Recording
          </CardTitle>
          <CardDescription className="text-sm">
            Record audio from your microphone to identify music
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col items-center space-y-6">
            {isRecording && (
              <div
                ref={statusRef}
                className="flex flex-col items-center space-y-2"
              >
                <div className="relative">
                  <div className="h-24 w-24 md:h-32 md:w-32 rounded-full bg-red-500 animate-pulse flex items-center justify-center">
                    <Mic className="h-12 w-12 md:h-16 md:w-16 text-white" />
                  </div>
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-background px-3 py-1 rounded-full border">
                    <p className="text-xs md:text-sm font-medium">
                      {recordingDuration}s / 15s
                    </p>
                  </div>
                </div>
                <p className="text-base md:text-lg font-semibold">
                  Listening...
                </p>
                <p className="text-xs md:text-sm text-muted-foreground">
                  Auto-processing in {15 - recordingDuration}s
                </p>
              </div>
            )}

            {isProcessing && (
              <div
                ref={statusRef}
                className="flex flex-col items-center space-y-2"
              >
                <div className="h-24 w-24 md:h-32 md:w-32 rounded-full bg-primary/10 flex items-center justify-center">
                  <Loader2 className="h-12 w-12 md:h-16 md:w-16 text-primary animate-spin" />
                </div>
                <p className="text-base md:text-lg font-semibold">
                  Processing...
                </p>
                <p className="text-xs md:text-sm text-muted-foreground">
                  Recognizing the music
                </p>
              </div>
            )}

            {notFound && !isRecording && !isProcessing && (
              <div
                ref={statusRef}
                className="flex flex-col items-center space-y-2"
              >
                <div className="h-24 w-24 md:h-32 md:w-32 rounded-full bg-destructive/10 flex items-center justify-center">
                  <AlertCircle className="h-12 w-12 md:h-16 md:w-16 text-destructive" />
                </div>
                <p className="text-base md:text-lg font-semibold">
                  No Music Found
                </p>
                <p className="text-xs md:text-sm text-muted-foreground text-center max-w-sm px-4">
                  Could not identify any music in the recording. Try again in a
                  quieter environment or closer to the audio source.
                </p>
              </div>
            )}

            {!isRecording && !isProcessing && !notFound && (
              <div className="h-24 w-24 md:h-32 md:w-32 rounded-full bg-muted flex items-center justify-center">
                <Mic className="h-12 w-12 md:h-16 md:w-16 text-muted-foreground" />
              </div>
            )}

            <div className="flex space-x-4">
              {!isRecording && !isProcessing ? (
                <Button
                  size="lg"
                  onClick={handleStart}
                  className="min-w-[140px]"
                >
                  <Mic className="mr-2 h-5 w-5" />
                  Start Listening
                </Button>
              ) : isRecording ? (
                <Button
                  size="lg"
                  variant="destructive"
                  onClick={handleManualStop}
                  className="min-w-[140px]"
                >
                  <Square className="mr-2 h-5 w-5" />
                  Stop Early
                </Button>
              ) : null}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
