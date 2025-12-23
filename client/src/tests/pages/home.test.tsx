import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { queryClient } from "../../lib/query-client";
import { HomePage } from "../../pages/home";

describe("HomePage", () => {
  it("renders the main heading", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <HomePage />
        </BrowserRouter>
      </QueryClientProvider>
    );

    expect(screen.getByText("Fyndam")).toBeInTheDocument();
  });

  it("renders navigation cards", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <HomePage />
        </BrowserRouter>
      </QueryClientProvider>
    );

    expect(screen.getByText("Live Listen")).toBeInTheDocument();
    expect(screen.getByText("Upload Audio")).toBeInTheDocument();
    expect(screen.getByText("Recognition History")).toBeInTheDocument();
  });
});
