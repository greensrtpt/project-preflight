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

  it("POST /topics should be forbidden for users", async () => {
    const response = await request(app)
      .post("/topics")
      .send({ topic_name: "test topic" });

    expect(response.status).toBe(403);
  });

  it("DELETE /topics/:topic_id should be forbidden for users", async () => {
    const response = await request(app)
      .delete("/topics/3d5b36cf-67b7-46cc-8ee6-0025ba9a0e23");

    expect(response.status).toBe(403);
  });

  it("POST /groups/:topic_id should require a token", async () => {
    const response = await request(app)
      .post("/groups/3d5b36cf-67b7-46cc-8ee6-0025ba9a0e23")
      .send({ group_name: "test group" });

    expect(response.status).toBe(401);
  });

  it("PUT /groups/:topic_id/:group_id should require a token", async () => {
    const response = await request(app)
      .put(
        "/groups/3d5b36cf-67b7-46cc-8ee6-0025ba9a0e23/301a9aad-3a2f-49a5-8dee-5f77012031d0",
      )
      .send({ group_name: "updated group" });

    expect(response.status).toBe(401);
  });

  it("DELETE /groups/:topic_id/:group_id should require a token", async () => {
    const response = await request(app)
      .delete(
        "/groups/3d5b36cf-67b7-46cc-8ee6-0025ba9a0e23/301a9aad-3a2f-49a5-8dee-5f77012031d0",
      );

    expect(response.status).toBe(401);
  });

  it("POST /posts/:group_id should require a token", async () => {
    const response = await request(app)
      .post("/posts/301a9aad-3a2f-49a5-8dee-5f77012031d0")
      .send({
        title: "Test Post",
        descriptions: "Test descriptions",
      });

    expect(response.status).toBe(401);
  });

  it("POST /posts/:group_id should reject an invalid token", async () => {
    const response = await request(app)
      .post("/posts/301a9aad-3a2f-49a5-8dee-5f77012031d0")
      .set("Authorization", "Bearer invalid-token")
      .send({
        title: "Test Post",
        descriptions: "Test descriptions",
      });

    expect(response.status).toBe(401);
  });

  it("PUT /posts/:group_id/:post_id should require a token", async () => {
    const response = await request(app)
      .put(
        "/posts/301a9aad-3a2f-49a5-8dee-5f77012031d0/c81a4e56-0056-4b2a-a4d8-d6af1a15203c",
      )
      .send({
        title: "Test Post",
        descriptions: "Test descriptions",
      });

    expect(response.status).toBe(401);
  });

  it("DELETE /posts/:group_id/:post_id should require a token", async () => {
    const response = await request(app).delete(
      "/posts/301a9aad-3a2f-49a5-8dee-5f77012031d0/c81a4e56-0056-4b2a-a4d8-d6af1a15203c",
    );

    expect(response.status).toBe(401);
  });
});
