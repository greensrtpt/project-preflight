import { Router } from "express";
import { dbClient } from "@db/client.js";
import { Topics,Groups } from "@db/schema.js";
import { and,eq } from "drizzle-orm";
import { validate as isUUID } from "uuid";

const router = Router();

router.post("/:topic_id", async (req,res) => {
  return res.status(403).json({
    message: "Groups can only be created through seed by developer",
  });
});

/**
 * get each group from topic
 * GET /groups/:topic_id/:group_id
 */
router.get("/:topic_id/:group_id", async (req, res) => {
  try {
    const { topic_id, group_id } = req.params;

    // ตรวจรูปแบบ ID ก่อนนำไปค้นหาในฐานข้อมูล
    if (!isUUID(topic_id) || !isUUID(group_id)) {
      return res.status(400).json({
        message: "Invalid topic_id or group_id format. It should be a valid UUID.",
      });
    }

    const groupResult = await dbClient
      .select()
      .from(Groups)
      // ใช้ทั้งสอง ID เพื่อยืนยันว่า Group อยู่ภายใต้ Topic ที่ระบุจริง
      .where(
        and(
          eq(Groups.topic_id, topic_id),
          eq(Groups.group_id, group_id),
        )
      );

    const group = groupResult[0];

    if (!group) {
      return res.status(404).json({
        message: "Group not found",
      });
    }

    return res.status(200).json(group);
  } catch (error) {
    console.error("GET /groups/:topic_id/:group_id Error:", error);

    return res.status(500).json({
      message: "Something went wrong with server",
    });
  }
});

/**
 * get each group from each topic
 * GET /groups/:topic_id
 */
router.get("/:topic_id/", async (req, res) => {
  try {
    const { topic_id } = req.params;

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
      message: "Somwthing went wrong with server",
    });
  }
});


/**
 * get all group from each topic
 * GET /groups/:topic_id
 */
router.get("/:topic_id", async (req, res) => {
  try {
    const { topic_id } = req.params;

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
 * DELETE post
 */
router.delete("/:topic_id/:group_id" ,async (req, res) => {
    return res.status(403).json({
      message: "Groups cannot be deleted by users",
    });
  }
);

export default router;
