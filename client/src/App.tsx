import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { queryClient } from "./lib/query-client";
import { ErrorBoundary } from "./components/error-boundary";
import { Layout } from "./components/layout";
import { HomePage } from "./pages/home";
import { LiveListenPage } from "./pages/live-listen";
import { UploadPage } from "./pages/upload";
import { HistoryPage } from "./pages/history";
import { RecognitionDetailPage } from "./pages/recognition-detail";
import { useEffect } from "react";
import { useThemeStore } from "./stores/theme-store";

function App() {
  const theme = useThemeStore((state) => state.theme);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="listen" element={<LiveListenPage />} />
              <Route path="upload" element={<UploadPage />} />
              <Route path="history" element={<HistoryPage />} />
              <Route
                path="recognition/:id"
                element={<RecognitionDetailPage />}
              />
            </Route>
          </Routes>
          <Toaster position="top-center" richColors />
        </BrowserRouter>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
