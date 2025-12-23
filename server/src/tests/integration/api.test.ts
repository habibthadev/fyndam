import { describe, it, expect, beforeAll, afterAll } from "vitest";
import supertest from "supertest";
import type { Express } from "express";
import { createApp } from "../../index.js";
import {
  connectDatabase,
  disconnectDatabase,
} from "../../infrastructure/config/database.js";

describe("API Integration Tests", () => {
  let app: Express;
  let request: ReturnType<typeof supertest>;

  beforeAll(async () => {
    await connectDatabase();
    app = createApp();
    request = supertest(app);
  });

  afterAll(async () => {
    await disconnectDatabase();
  });

  describe("GET /api/v1/health", () => {
    it("should return health status", async () => {
      const response = await request.get("/api/v1/health");

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("status", "ok");
      expect(response.body).toHaveProperty("timestamp");
    });
  });

  describe("GET /api/v1/history", () => {
    it("should return empty history initially", async () => {
      const response = await request.get("/api/v1/history");

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("items");
      expect(response.body).toHaveProperty("total");
      expect(response.body).toHaveProperty("limit");
      expect(response.body).toHaveProperty("offset");
      expect(Array.isArray(response.body.items)).toBe(true);
    });

    it("should accept limit and offset parameters", async () => {
      const response = await request.get("/api/v1/history?limit=10&offset=0");

      expect(response.status).toBe(200);
      expect(response.body.limit).toBe(10);
      expect(response.body.offset).toBe(0);
    });
  });

  describe("POST /api/v1/recognize/upload", () => {
    it("should return 400 when no file is provided", async () => {
      const response = await request.post("/api/v1/recognize/upload");

      expect(response.status).toBe(400);
    });
  });

  describe("GET /api/v1/history/:id", () => {
    it("should return 404 for non-existent ID", async () => {
      const response = await request.get(
        "/api/v1/history/507f1f77bcf86cd799439011"
      );

      expect(response.status).toBe(404);
    });
  });
});
