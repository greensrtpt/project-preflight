import "dotenv/config";
import { dbClient } from "@db/client.js";
import {
  postsTable,
  topicsTable,
  usersTable,
} from "@db/schema.js";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";

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
    const users = await dbClient.select().from(usersTable);
    const topics = await dbClient.select().from(topicsTable);
    const posts = await dbClient.select().from(postsTable);

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
    });
  }
});

/**
 * ดึง Topic ทั้งหมด
 */
app.get("/topics/all", async (_req, res) => {
  try {
    const topics = await dbClient.select().from(topicsTable);

    res.status(200).json(topics);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Cannot get topics",
    });
  }
});

/**
 * สร้าง Topic ใหม่
 */
app.post("/topics", async (req, res) => {
  try {
    const { topic_name } = req.body;

    if (!topic_name) {
      res.status(400).json({
        message: "topic_name is required",
      });
      return;
    }

    const newTopic = await dbClient
      .insert(topicsTable)
      .values({
        topic_name,
      })
      .returning();

    res.status(201).json(newTopic[0]);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Cannot create topic",
    });
  }
});

/**
 * สร้าง User ใหม่
 */
app.post("/users", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      res.status(400).json({
        message: "username and password are required",
      });
      return;
    }

    const newUser = await dbClient
      .insert(usersTable)
      .values({
        username,
        password,
      })
      .returning();

    res.status(201).json(newUser[0]);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Cannot create user",
    });
  }
});

/**
 * ดึง Post ทั้งหมด
 */
app.get("/posts", async (_req, res) => {
  try {
    const posts = await dbClient.select().from(postsTable);

    res.status(200).json(posts);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Cannot get posts",
    });
  }
});

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
      .insert(postsTable)
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

    const posts = await dbClient.select().from(postsTable);

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