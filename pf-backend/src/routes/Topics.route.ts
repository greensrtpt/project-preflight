import { Router } from "express";
import { dbClient } from "@db/client.js";
import { Topics, Groups } from "@db/schema.js";
import { eq } from "drizzle-orm";
import { validate as isUUID } from "uuid";

const router = Router();

/**
 * POST /topics
 */
router.post("/", async (req, res) => {
  // ผู้ใช้สร้าง Topic เองไม่ได้ เพราะ Topic ถูกสร้างผ่าน Seed โดย Developer
  return res.status(403).json({
    message: "Topics can only be created through seed by developer",
  });
});

/**
 * GET /topics/all
 */
router.get("/all", async (_req, res) => {
  try {
    const topics = await dbClient.select().from(Topics);
    const groups = await dbClient.select().from(Groups);

    const topicsWithGroups = topics.map((topic) => ({
      topic_id: topic.topic_id,
      topic_name: topic.topic_name,
      group: groups.filter((group) => group.topic_id === topic.topic_id),
    }));

    res.status(200).json(topicsWithGroups);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Cannot get topics",
    });
  }
});
 
/**
 * get all group from each topic
 * GET /topics/:topic_id
 */
router.get("/:topic_id", async (req, res) => {
  try {
    const { topic_id } = req.params;

    if (!isUUID(topic_id)) {
      return res.status(400).json({
        message: "Invalid topic_id format. It should be a valid UUID.",
      });
    }

    const topicResult = await dbClient
      .select()
      .from(Topics)
      .where(eq(Topics.topic_id, topic_id));

    const topic = topicResult[0];

    if (!topic) {
      res.status(404).json({
        message: "Topic not found",
      });
      return;
    }

    //เลือกระบุ Column เฉพาะที่จะใช้งาน ป้องกัน Error เรื่อง Column mismatch
    const groups = await dbClient
      .select()
      .from(Groups)
      .where(eq(Groups.topic_id, topic_id));

    res.status(200).json({
      topic_id: topic.topic_id,
      topic_name: topic.topic_name,
      group: groups,
    });
  } catch (error) {
    console.error(error);

    console.error("GET /topics/:topic_id Error:", error);

    res.status(500).json({
      message: "Something went wrong with server",
    });
  }
});

/**
 * DELETE /topics/:topic_id
 */
router.delete("/:topic_id", async (req, res) => {
  // ป้องกันผู้ใช้ลบ Topic รวมถึง Groups และ Posts ที่อยู่ภายใน
  return res.status(403).json({
    message: "Topics cannot be deleted by users",
  });
});

export default router;
