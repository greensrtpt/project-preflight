import "dotenv/config";
import { dbClient } from "@db/client.js";
import {
  Posts,
  Topics,
  Users,
} from "@db/schema.js";
import { eq } from "drizzle-orm";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";

// 1. Import ไฟล์ Route ที่เราแยกไว้
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

// 2. นำ Route มาใช้งาน พร้อมกำหนด Path หลัก
app.use("/topics", topicRouter); // ทุกอย่างใน topicRouter จะขึ้นต้นด้วย /topics
app.use("/users", userRouter);   // ทุกอย่างใน userRouter จะขึ้นต้นด้วย /users
app.use("/posts", postRouter);   // ทุกอย่างใน postRouter จะขึ้นต้นด้วย /posts

/**
 * สร้าง Post ใหม่
 */
app.post("/posts", async (req, res) => {
  try {
    const {
      topic_id,
      author_id,
      title,
      descriptions,
    } = req.body;

    if (!topic_id || !author_id || !title || !descriptions) {
      res.status(400).json({
        message:
          "topic_id, author_id, title and descriptions are required",
      });
      return;
    }

    const newPost = await dbClient
      .insert(Posts)
      .values({
        topic_id,
        author_id,
        title,
        descriptions,
      })
      .returning();

    res.status(201).json(newPost[0]);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Cannot create post",
    });
  }
});

/**
 * ดึง Post ตาม id
 */
app.get("/posts/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const posts = await dbClient.select().from(Posts);

    const post = posts.find(
      (currentPost) => currentPost.post_id === id,
    );

    if (!post) {
      res.status(404).json({
        message: "Post not found",
      });
      return;
    }

    res.status(200).json(post);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Cannot get post",
    });
  }
});

// ถ้าไม่มี Route นี้ ให้ตอบ 404
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