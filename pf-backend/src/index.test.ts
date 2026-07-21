import request from "supertest";
import { describe, expect, it } from "vitest";
import app from "./index.js";

describe("Backend API", () => {
  it("GET / should return backend status", async () => {
    const response = await request(app).get("/");

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("PF Backend is running");
  });

  it("GET /topics/all should return an array", async () => {
    const response = await request(app).get("/topics/all");

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });
});