import "dotenv/config";
import { dbClient } from "@db/client.js";
import cors from "cors";
import Debug from "debug";
import type { ErrorRequestHandler } from "express";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";

const debug = Debug("pf-backend");

// สร้าง Express application
const app = express();

// Middleware สำหรับแสดง HTTP request ใน Terminal
app.use(morgan("dev", { immediate: false }));

// เพิ่ม HTTP security headers
app.use(helmet());

// ตอนนี้อนุญาตให้ Frontend เรียก Backend ได้ทุก origin
// เหมาะสำหรับช่วงพัฒนา
app.use(
  cors({
    origin: "*",
  }),
);

// แปลง JSON request body แล้วเก็บไว้ใน req.body
app.use(express.json());

/**
 * Route ทดสอบว่า Backend ยังทำงานอยู่
 */
app.get("/", (_req, res) => {
  res.status(200).json({
    message: "PF Backend is running hahaha sss",
  });
});

/**
 * Route ทดสอบว่า Backend เชื่อม Database และอ่านตารางได้
 */
app.get("/health/database", async (_req, res, next) => {
  try {
    const users = await dbClient.query.usersTable.findMany();
    const topics = await dbClient.query.topicsTable.findMany();
    const posts = await dbClient.query.postsTable.findMany();

    res.status(200).json({
      message: "Database connection is working",
      tableCounts: {
        users: users.length,
        topics: topics.length,
        posts: posts.length,
      },
    });
  } catch (err) {
    next(err);
  }
});

/**
 * Error-handling middleware
 * ต้องอยู่หลัง Routes ทั้งหมด
 */
const jsonErrorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  debug(err.message);

  const errorResponse = {
    message: err.message || "Internal Server Error",
    type: err.name || "Error",
  };

  res.status(500).json(errorResponse);
};

app.use(jsonErrorHandler);

// ใช้ PORT จาก .env ถ้าไม่มีให้ใช้ 3000
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  debug(`Listening on port ${PORT}: http://localhost:${PORT}`);
});

export default app;