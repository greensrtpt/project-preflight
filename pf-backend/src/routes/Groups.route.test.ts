import express from "express";
import request from "supertest";
import { beforeEach, describe, expect, it, vi } from "vitest";

const OWNER_ID = "e979f0b8-86b7-46eb-af2a-0588c41d00ba";
const OTHER_ID = "68276596-167c-4766-8cfd-c1aa5bb6cfce";
const TOPIC_ID = "3d5b36cf-67b7-46cc-8ee6-0025ba9a0e23";
const GROUP_ID = "301a9aad-3a2f-49a5-8dee-5f77012031d0";

const dbState = vi.hoisted(() => ({
  selectResults: [] as unknown[][],
  inserted: [] as Record<string, unknown>[],
  updated: [] as Record<string, unknown>[],
  deleted: 0,
}));

vi.mock("@db/client.js", () => {
  const makeWhere = (result: unknown[]) => ({
    where: vi.fn().mockResolvedValue(result),
  });

  return {
    dbClient: {
      select: vi.fn(() => ({
        from: vi.fn(() => makeWhere(dbState.selectResults.shift() ?? [])),
      })),
      insert: vi.fn(() => ({
        values: vi.fn((value: Record<string, unknown>) => {
          dbState.inserted.push(value);
          return {
            returning: vi.fn().mockResolvedValue([{ group_id: GROUP_ID, ...value }]),
          };
        }),
      })),
      update: vi.fn(() => ({
        set: vi.fn((value: Record<string, unknown>) => {
          dbState.updated.push(value);
          return {
            where: vi.fn(() => ({
              returning: vi.fn().mockResolvedValue([{ group_id: GROUP_ID, ...value }]),
            })),
          };
        }),
      })),
      delete: vi.fn(() => ({
        where: vi.fn().mockImplementation(async () => {
          dbState.deleted += 1;
        }),
      })),
    },
  };
});

vi.mock("@src/Middleware/auth.js", () => ({
  authenticateToken: (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    const identity = req.header("x-test-user");
    if (!identity) {
      return res.status(401).json({ message: "Access token required" });
    }
    req.user = identity === "owner"
      ? { user_id: OWNER_ID, username: "Green" }
      : { user_id: OTHER_ID, username: "Other" };
    next();
  },
}));

import groupRouter from "./Groups.route.js";

const app = express();
app.use(express.json());
app.use("/groups", groupRouter);

const ownerGroup = {
  group_id: GROUP_ID,
  topic_id: TOPIC_ID,
  group_name: "Chess Club",
  owner_id: OWNER_ID,
  owner_name: "Green",
  create_at: new Date(),
  edit_at: new Date(),
};

describe("Groups API requirement", () => {
  beforeEach(() => {
    dbState.selectResults = [];
    dbState.inserted = [];
    dbState.updated = [];
    dbState.deleted = 0;
  });

  it("POST requires JWT", async () => {
    expect((await request(app).post(`/groups/${TOPIC_ID}`).send({ group_name: "Chess Club" })).status).toBe(401);
  });

  it("POST requires group_name", async () => {
    const response = await request(app).post(`/groups/${TOPIC_ID}`).set("x-test-user", "owner").send({});
    expect(response.status).toBe(400);
  });

  it("POST rejects invalid topic UUID", async () => {
    const response = await request(app).post("/groups/not-a-uuid").set("x-test-user", "owner").send({ group_name: "Chess Club" });
    expect(response.status).toBe(400);
  });

  it("POST returns 404 when topic does not exist", async () => {
    dbState.selectResults.push([]);
    const response = await request(app).post(`/groups/${TOPIC_ID}`).set("x-test-user", "owner").send({ group_name: "Chess Club" });
    expect(response.status).toBe(404);
  });

  it("POST creates a group using owner data from JWT", async () => {
    dbState.selectResults.push([{ topic_id: TOPIC_ID }]);
    const response = await request(app).post(`/groups/${TOPIC_ID}`).set("x-test-user", "owner").send({ group_name: " Chess Club " });
    expect(response.status).toBe(201);
    expect(dbState.inserted[0]).toMatchObject({
      topic_id: TOPIC_ID,
      group_name: "Chess Club",
      owner_id: OWNER_ID,
      owner_name: "Green",
    });
  });

  it("PUT requires JWT", async () => {
    expect((await request(app).put(`/groups/${TOPIC_ID}/${GROUP_ID}`).send({ group_name: "New Name" })).status).toBe(401);
  });

  it("PUT returns 404 for a missing group", async () => {
    dbState.selectResults.push([]);
    const response = await request(app).put(`/groups/${TOPIC_ID}/${GROUP_ID}`).set("x-test-user", "owner").send({ group_name: "New Name" });
    expect(response.status).toBe(404);
  });

  it("PUT returns 403 when user is not owner", async () => {
    dbState.selectResults.push([ownerGroup]);
    const response = await request(app).put(`/groups/${TOPIC_ID}/${GROUP_ID}`).set("x-test-user", "other").send({ group_name: "New Name" });
    expect(response.status).toBe(403);
  });

  it("PUT updates group_name and edit_at for owner", async () => {
    dbState.selectResults.push([ownerGroup]);
    const response = await request(app).put(`/groups/${TOPIC_ID}/${GROUP_ID}`).set("x-test-user", "owner").send({ group_name: "New Name" });
    expect(response.status).toBe(200);
    expect(dbState.updated[0].group_name).toBe("New Name");
    expect(dbState.updated[0].edit_at).toBeInstanceOf(Date);
  });

  it("DELETE requires JWT", async () => {
    expect((await request(app).delete(`/groups/${TOPIC_ID}/${GROUP_ID}`)).status).toBe(401);
  });

  it("DELETE returns 404 for a missing group", async () => {
    dbState.selectResults.push([]);
    const response = await request(app).delete(`/groups/${TOPIC_ID}/${GROUP_ID}`).set("x-test-user", "owner");
    expect(response.status).toBe(404);
  });

  it("DELETE returns 403 when user is not owner", async () => {
    dbState.selectResults.push([ownerGroup]);
    const response = await request(app).delete(`/groups/${TOPIC_ID}/${GROUP_ID}`).set("x-test-user", "other");
    expect(response.status).toBe(403);
  });

  it("DELETE removes group for owner", async () => {
    dbState.selectResults.push([ownerGroup]);
    const response = await request(app).delete(`/groups/${TOPIC_ID}/${GROUP_ID}`).set("x-test-user", "owner");
    expect(response.status).toBe(200);
    expect(dbState.deleted).toBe(1);
  });
});
