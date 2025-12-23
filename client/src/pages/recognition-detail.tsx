import { useParams, Link } from "react-router-dom";
import { useEffect, useRef } from "react";
import {
  Loader2,
  Music,
  Clock,
  HardDrive,
  ExternalLink,
  ArrowLeft,
} from "lucide-react";
import { gsap } from "gsap";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { useRecognition } from "../hooks/use-api";

export const RecognitionDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data: recognition, isLoading, isError } = useRecognition(id);
  const pageRef = useRef<HTMLDivElement>(null);
  const artworkRef = useRef<HTMLDivElement>(null);
  const detailsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (recognition && pageRef.current) {
      const ctx = gsap.context(() => {
        gsap.from(artworkRef.current, {
          opacity: 0,
          scale: 0.9,
          duration: 0.6,
          ease: "back.out(1.2)",
        });
        gsap.from(detailsRef.current?.children || [], {
          opacity: 0,
          y: 20,
          duration: 0.5,
          stagger: 0.1,
          ease: "power2.out",
          delay: 0.2,
        });
      });
      return () => ctx.revert();
    }
  }, [recognition]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (isError || !recognition) {
    return (
      <div className="max-w-2xl mx-auto px-4 md:px-0">
        <Card>
          <CardHeader>
            <CardTitle>Recognition Not Found</CardTitle>
            <CardDescription>
              The requested recognition could not be found.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/history">
              <Button>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to History
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const result = recognition.auddResponse.result;

  return (
    <div ref={pageRef} className="max-w-4xl mx-auto space-y-6 px-4 md:px-0">
      <Link to="/history">
        <Button variant="ghost">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to History
        </Button>
      </Link>

      {result ? (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row items-start gap-4">
                <div ref={artworkRef}>
                  {result.spotify?.album?.images?.[0] ||
                  result.apple_music?.artwork ? (
                    <img
                      src={
                        result.spotify?.album?.images?.[0]?.url ||
                        result.apple_music?.artwork?.url?.replace(
                          "{w}x{h}",
                          "300x300"
                        )
                      }
                      alt={result.title}
                      className="w-full sm:w-32 sm:h-32 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-full sm:w-32 sm:h-32 rounded-lg bg-muted flex items-center justify-center">
                      <Music className="h-12 w-12 md:h-16 md:w-16 text-muted-foreground" />
                    </div>
                  )}
                </div>

                <div ref={detailsRef} className="flex-1 min-w-0">
                  <CardTitle className="text-2xl md:text-3xl break-words">
                    {result.title}
                  </CardTitle>
                  <CardDescription className="text-base md:text-lg mt-2 break-words">
                    {result.artist}
                  </CardDescription>

                  {result.album && (
                    <p className="text-sm md:text-base text-muted-foreground mt-2 break-words">
                      Album: {result.album}
                    </p>
                  )}

                  {result.release_date && (
                    <p className="text-xs md:text-sm text-muted-foreground mt-1">
                      Released: {result.release_date}
                    </p>
                  )}
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {result.spotify?.external_urls?.spotify && (
                  <a
                    href={result.spotify.external_urls.spotify}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="outline" size="sm">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Open in Spotify
                    </Button>
                  </a>
                )}

                {result.apple_music?.url && (
                  <a
                    href={result.apple_music.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="outline" size="sm">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Open in Apple Music
                    </Button>
                  </a>
                )}

                {result.song_link && (
                  <a
                    href={result.song_link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="outline" size="sm">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      More Info
                    </Button>
                  </a>
                )}
              </div>

              {result.lyrics?.lyrics && (
                <div className="pt-4 border-t">
                  <h3 className="font-semibold mb-2 text-sm md:text-base">
                    Lyrics
                  </h3>
                  <pre className="text-xs md:text-sm text-muted-foreground whitespace-pre-wrap break-words">
                    {result.lyrics.lyrics}
                  </pre>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl md:text-2xl">
                Recognition Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs md:text-sm">
              <div className="flex flex-wrap items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <span className="text-muted-foreground">Recognized:</span>
                <span className="break-all">
                  {new Date(recognition.timestamp).toLocaleString()}
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <HardDrive className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Input Type:</span>
                <span className="capitalize">{recognition.inputType}</span>
              </div>

              <div className="flex items-center space-x-2">
                <Music className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Format:</span>
                <span className="uppercase">
                  {recognition.audioMetadata.format}
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-muted-foreground">Duration:</span>
                <span>{recognition.audioMetadata.duration}s</span>
              </div>

              {recognition.confidence && (
                <div className="flex items-center space-x-2">
                  <span className="text-muted-foreground">Confidence:</span>
                  <span>{(recognition.confidence * 100).toFixed(1)}%</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="text-xl md:text-2xl">
              No Match Found
            </CardTitle>
            <CardDescription className="text-sm md:text-base">
              The audio could not be matched to any known song.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-xs md:text-sm text-muted-foreground">
                This could happen if the audio quality is too low, the recording
                is too short, or the song is not in the recognition database.
              </p>

              <div className="flex flex-wrap items-center gap-2 text-xs md:text-sm">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Recognized:</span>
                <span className="break-all">
                  {new Date(recognition.timestamp).toLocaleString()}
                </span>
              </div>

              <div className="flex items-center space-x-2 text-xs md:text-sm">
                <HardDrive className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Input Type:</span>
                <span className="capitalize">{recognition.inputType}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
