import "dotenv/config";
import { dbClient } from "@db/client.js";
import { Posts, Topics, Users } from "@db/schema.js";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";

import topicRouter from "./routes/Topics.route.js";
import userRouter from "./routes/Users.route.js";
import postRouter from "./routes/Posts.route.js";

const app = express();

app.use(morgan("dev"));
app.use(helmet());
app.use(cors());
app.use(express.json());

/**
 * ตรวจว่า Backend ทำงานอยู่
 */
app.get("/", (_req, res) => {
  res.status(200).json({
    message: "PF Backend is running",
  });
});

/**
 * ตรวจการเชื่อมต่อ Database
 */
app.get("/health/database", async (_req, res) => {
  try {
    const users = await dbClient.select().from(Users);
    const topics = await dbClient.select().from(Topics);
    const posts = await dbClient.select().from(Posts);

    res.status(200).json({
      message: "Database connection is working",
      tableCounts: {
        users: users.length,
        topics: topics.length,
        posts: posts.length,
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Database connection failed",
      error: error instanceof Error ? error.message : String(error),
    });
  }
});

/**
 * เชื่อม Route แต่ละส่วน
 */
app.use("/topics", topicRouter);
app.use("/users", userRouter);
app.use("/posts", postRouter);

/**
 * Route ไม่พบ
 */
app.use((_req, res) => {
  res.status(404).json({
    message: "Route not found",
  });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});

export default app;