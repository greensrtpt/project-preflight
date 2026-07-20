import request from "supertest";
import { describe, expect, it } from "vitest";
import app from "./index.js";

describe("Backend API", () => {
  describe("GET /", () => {
    it("returns backend status", async () => {
      const response = await request(app).get("/");

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        message: "PF Backend is running",
      });
    });
  });

  describe("GET /health/database", () => {
    it("returns database status and table counts", async () => {
      const response = await request(app).get("/health/database");

      expect(response.status).toBe(200);
      expect(response.body.message).toBe(
        "Database connection is working",
      );

      expect(response.body.tableCounts).toHaveProperty("users");
      expect(response.body.tableCounts).toHaveProperty("topics");
      expect(response.body.tableCounts).toHaveProperty("posts");

      expect(typeof response.body.tableCounts.users).toBe("number");
      expect(typeof response.body.tableCounts.topics).toBe("number");
      expect(typeof response.body.tableCounts.posts).toBe("number");
    });
  });

  describe("Unknown route", () => {
    it("returns 404", async () => {
      const response = await request(app).get("/not-found");

      expect(response.status).toBe(404);
    });
  });
});