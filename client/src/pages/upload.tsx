import { useState, useEffect, useRef } from "react";
import { Upload as UploadIcon, Loader2, FileAudio } from "lucide-react";
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
import { Input } from "../components/ui/input";
import { useRecognizeUpload } from "../hooks/use-api";
import { toast } from "sonner";

export const UploadPage = () => {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const recognizeUpload = useRecognizeUpload();
  const pageRef = useRef<HTMLDivElement>(null);
  const uploadAreaRef = useRef<HTMLDivElement>(null);

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
    if (selectedFile && uploadAreaRef.current) {
      gsap.from(uploadAreaRef.current.querySelector(".file-info"), {
        scale: 0.9,
        opacity: 0,
        duration: 0.4,
        ease: "back.out(1.7)",
      });
    }
  }, [selectedFile]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const allowedTypes = [
        "audio/mpeg",
        "audio/mp3",
        "audio/wav",
        "audio/x-wav",
        "audio/mp4",
        "audio/x-m4a",
      ];
      if (!allowedTypes.includes(file.type)) {
        toast.error("Invalid file type. Please upload mp3, wav, or m4a files.");
        return;
      }

      const maxSize = 10 * 1024 * 1024;
      if (file.size > maxSize) {
        toast.error("File size exceeds 10MB limit");
        return;
      }

      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("Please select a file first");
      return;
    }

    try {
      const result = await recognizeUpload.mutateAsync(selectedFile);
      toast.success("Recognition complete!");
      navigate(`/recognition/${result.id}`);
    } catch (error: any) {
      toast.error(error.message || "Recognition failed");
    }
  };

  return (
    <div ref={pageRef} className="max-w-2xl mx-auto space-y-6 px-4 md:px-0">
      <div className="text-center space-y-2">
        <h1 className="text-3xl md:text-4xl font-bold">Upload Audio</h1>
        <p className="text-sm md:text-base text-muted-foreground">
          Upload an audio file (mp3, wav, or m4a) to identify the song
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl md:text-2xl">
            Audio File Upload
          </CardTitle>
          <CardDescription className="text-sm">
            Select an audio file from your device. Maximum file size is 10MB.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div
              ref={uploadAreaRef}
              className="border-2 border-dashed rounded-lg p-6 md:p-12 text-center hover:border-primary transition-colors"
            >
              <Input
                type="file"
                accept="audio/mpeg,audio/mp3,audio/wav,audio/x-wav,audio/mp4,audio/x-m4a"
                onChange={handleFileChange}
                className="hidden"
                id="audio-upload"
                disabled={recognizeUpload.isPending}
              />
              <label
                htmlFor="audio-upload"
                className="cursor-pointer flex flex-col items-center space-y-4"
              >
                {selectedFile ? (
                  <div className="file-info">
                    <FileAudio className="h-12 w-12 md:h-16 md:w-16 text-primary" />
                    <div>
                      <p className="font-semibold text-sm md:text-base break-all px-2">
                        {selectedFile.name}
                      </p>
                      <p className="text-xs md:text-sm text-muted-foreground">
                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                ) : (
                  <>
                    <UploadIcon className="h-12 w-12 md:h-16 md:w-16 text-muted-foreground" />
                    <div>
                      <p className="font-semibold text-sm md:text-base">
                        Click to upload audio file
                      </p>
                      <p className="text-xs md:text-sm text-muted-foreground">
                        Supported formats: mp3, wav, m4a
                      </p>
                    </div>
                  </>
                )}
              </label>
            </div>

            <Button
              size="lg"
              onClick={handleUpload}
              disabled={!selectedFile || recognizeUpload.isPending}
              className="w-full"
            >
              {recognizeUpload.isPending ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Recognizing...
                </>
              ) : (
                <>
                  <UploadIcon className="mr-2 h-5 w-5" />
                  Upload & Recognize
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
