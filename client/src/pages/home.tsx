import { Link } from "react-router-dom";
import { Mic, Upload, History, Music } from "lucide-react";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { useHealth } from "../hooks/use-api";

export const HomePage = () => {
  const { data: health } = useHealth();
  const heroRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const stepsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(heroRef.current?.children || [], {
        opacity: 0,
        y: 30,
        duration: 0.8,
        stagger: 0.15,
        ease: "power3.out",
      });

      gsap.from(cardsRef.current?.children || [], {
        opacity: 0,
        y: 40,
        scale: 0.95,
        duration: 0.7,
        stagger: 0.2,
        ease: "back.out(1.2)",
        delay: 0.3,
      });

      gsap.from(stepsRef.current?.children || [], {
        opacity: 0,
        y: 30,
        duration: 0.6,
        stagger: 0.15,
        ease: "power2.out",
        delay: 0.6,
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-8 md:space-y-12">
      <section
        ref={heroRef}
        className="text-center space-y-3 md:space-y-4 py-6 md:py-12 px-4"
      >
        <div className="flex justify-center">
          <Music className="h-12 w-12 md:h-16 md:w-16" />
        </div>
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
          Fyndam
        </h1>
        <p className="text-base md:text-xl text-muted-foreground max-w-2xl mx-auto px-4">
          Identify any song in seconds. Upload audio files or listen live using
          your microphone.
        </p>
        {health && (
          <p className="text-xs md:text-sm text-muted-foreground">
            API Status:{" "}
            <span className="text-green-500 font-medium">Online</span>
          </p>
        )}
      </section>

      <section
        ref={cardsRef}
        className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6"
      >
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <Mic className="h-8 w-8 mb-2" />
            <CardTitle>Live Listen</CardTitle>
            <CardDescription>
              Use your microphone to identify music in real-time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/listen">
              <Button className="w-full">Start Listening</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <Upload className="h-8 w-8 mb-2" />
            <CardTitle>Upload Audio</CardTitle>
            <CardDescription>
              Upload an audio file to identify the song
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/upload">
              <Button className="w-full">Upload File</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <History className="h-8 w-8 mb-2" />
            <CardTitle>Recognition History</CardTitle>
            <CardDescription>
              View your past song recognition results
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/history">
              <Button className="w-full" variant="outline">
                View History
              </Button>
            </Link>
          </CardContent>
        </Card>
      </section>

      <section className="text-center space-y-4 py-6 md:py-8 px-4">
        <h2 className="text-xl md:text-2xl font-semibold">How It Works</h2>
        <div
          ref={stepsRef}
          className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 max-w-4xl mx-auto text-left"
        >
          <div>
            <div className="bg-primary text-primary-foreground rounded-full h-10 w-10 flex items-center justify-center mb-3 font-bold">
              1
            </div>
            <h3 className="font-semibold mb-2 text-sm md:text-base">
              Capture Audio
            </h3>
            <p className="text-xs md:text-sm text-muted-foreground">
              Record live audio or upload an existing file in mp3, wav, or m4a
              format
            </p>
          </div>
          <div>
            <div className="bg-primary text-primary-foreground rounded-full h-10 w-10 flex items-center justify-center mb-3 font-bold">
              2
            </div>
            <h3 className="font-semibold mb-2 text-sm md:text-base">
              Recognition
            </h3>
            <p className="text-xs md:text-sm text-muted-foreground">
              Our system analyzes the audio and identifies the song using
              advanced recognition technology
            </p>
          </div>
          <div>
            <div className="bg-primary text-primary-foreground rounded-full h-10 w-10 flex items-center justify-center mb-3 font-bold">
              3
            </div>
            <h3 className="font-semibold mb-2 text-sm md:text-base">
              Get Results
            </h3>
            <p className="text-xs md:text-sm text-muted-foreground">
              Receive detailed information about the song including artist,
              title, album, and streaming links
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
