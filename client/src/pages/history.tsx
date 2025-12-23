import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Loader2, Music, Clock, HardDrive, ChevronRight } from "lucide-react";
import { gsap } from "gsap";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { useHistory } from "../hooks/use-api";

export const HistoryPage = () => {
  const [page, setPage] = useState(0);
  const limit = 20;
  const { data, isLoading, isError } = useHistory(limit, page * limit);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (data?.items && listRef.current) {
      const ctx = gsap.context(() => {
        gsap.from(listRef.current?.children || [], {
          opacity: 0,
          x: -20,
          duration: 0.5,
          stagger: 0.1,
          ease: "power2.out",
        });
      });
      return () => ctx.revert();
    }
  }, [data?.items, page]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Error Loading History</CardTitle>
            <CardDescription>
              Failed to load recognition history. Please try again later.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const totalPages = Math.ceil((data?.total || 0) / limit);

  return (
    <div className="max-w-4xl mx-auto space-y-6 px-4 md:px-0">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold">
            Recognition History
          </h1>
          <p className="text-sm md:text-base text-muted-foreground mt-2">
            {data?.total || 0} total recognitions
          </p>
        </div>
      </div>

      {data?.items.length === 0 ? (
        <Card>
          <CardContent className="py-8 md:py-12 text-center">
            <Music className="h-12 w-12 md:h-16 md:w-16 mx-auto mb-4 text-muted-foreground" />
            <p className="text-base md:text-lg font-semibold mb-2">
              No recognitions yet
            </p>
            <p className="text-sm md:text-base text-muted-foreground mb-6">
              Start identifying music to build your history
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3 sm:space-x-4">
              <Link to="/listen">
                <Button className="w-full sm:w-auto">Live Listen</Button>
              </Link>
              <Link to="/upload">
                <Button variant="outline" className="w-full sm:w-auto">
                  Upload File
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div ref={listRef} className="space-y-4">
          {data?.items.map((recognition) => (
            <Card
              key={recognition.id}
              className="hover:shadow-md transition-shadow"
            >
              <CardContent className="p-4 md:p-6">
                <Link to={`/recognition/${recognition.id}`}>
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex-1 space-y-2 min-w-0">
                      <div className="flex items-start space-x-2">
                        <Music className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                        {recognition.auddResponse.result ? (
                          <div className="min-w-0 flex-1">
                            <p className="font-semibold text-sm md:text-base truncate">
                              {recognition.auddResponse.result.title ||
                                "Unknown Title"}
                            </p>
                            <p className="text-xs md:text-sm text-muted-foreground truncate">
                              {recognition.auddResponse.result.artist ||
                                "Unknown Artist"}
                            </p>
                          </div>
                        ) : (
                          <p className="text-sm md:text-base text-muted-foreground">
                            No match found
                          </p>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-2 md:gap-4 text-xs md:text-sm text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <Clock className="h-3 w-3 md:h-4 md:w-4" />
                          <span className="truncate">
                            {new Date(recognition.timestamp).toLocaleString()}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <HardDrive className="h-3 w-3 md:h-4 md:w-4" />
                          <span className="capitalize">
                            {recognition.inputType}
                          </span>
                        </div>
                        <span className="uppercase text-xs">
                          {recognition.audioMetadata.format}
                        </span>
                      </div>
                    </div>

                    <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                  </div>
                </Link>
              </CardContent>
            </Card>
          ))}

          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
                className="w-full sm:w-auto"
              >
                Previous
              </Button>
              <span className="px-4 py-2 text-sm">
                Page {page + 1} of {totalPages}
              </span>
              <Button
                variant="outline"
                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                disabled={page >= totalPages - 1}
                className="w-full sm:w-auto"
              >
                Next
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
