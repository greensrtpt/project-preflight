import { Router } from "express";
import { dbClient } from "@db/client.js";
import { Topics,Groups } from "@db/schema.js";
import { and,eq } from "drizzle-orm";
import { authenticateToken } from "@src/Middleware/auth.js";
import { validate as isUUID } from "uuid";

const router = Router();

/**
 * POST /groups/:topic_id
 * รับ group_name จาก body ส่วนข้อมูล owner เอาจาก token
 */
router.post("/:topic_id", authenticateToken, async (req,res) => {
  try {
    const { topic_id } = req.params as { topic_id: string };
    const { group_name } = req.body;
    const owner_id = req.user?.user_id;
    const owner_name = req.user?.username;

    if (!owner_id || !owner_name) {
      return res.status(401).json({ message: "Unauthorized: User not logged in" });
    }
    if (!isUUID(topic_id)) {
      return res.status(400).json({ message: "Invalid topic_id format. It should be a valid UUID." });
    }
    if (typeof group_name !== "string" || !group_name.trim()) {
      return res.status(400).json({ message: "group_name is required" });
    }
    if (group_name.trim().length > 30) {
      return res.status(400).json({ message: "group_name must not exceed 30 characters" });
    }

    const topic = await dbClient.select().from(Topics).where(eq(Topics.topic_id, topic_id));
    if (topic.length === 0) {
      return res.status(404).json({ message: "Topic not found" });
    }

    const createdGroup = await dbClient.insert(Groups).values({
      topic_id,
      group_name: group_name.trim(),
      owner_id,
      owner_name,
      create_at: new Date(),
      edit_at: new Date(),
    }).returning();

    return res.status(201).json({
      message: "Group created successfully",
      data: createdGroup[0],
    });
  } catch (error) {
    console.error("POST /groups/:topic_id Error:", error);
    return res.status(500).json({ message: "Something went wrong with server" });
  }
});

/**
 * get each group from topic
 * GET /groups/:topic_id/:group_id
 */
router.get("/:topic_id/:group_id", async (req, res) => {
  try {
    const { topic_id, group_id } = req.params as {
      topic_id: string;
      group_id: string;
    };

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
 * get all group from each topic
 * GET /groups/:topic_id
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

router.put("/:topic_id/:group_id", authenticateToken, async (req, res) => {
  try {
    const { topic_id, group_id } = req.params as {
      topic_id: string;
      group_id: string;
    };
    const { group_name } = req.body;
    const user_id = req.user?.user_id;

    if (!isUUID(topic_id) || !isUUID(group_id)) {
      return res.status(400).json({ message: "Invalid topic_id or group_id format. It should be a valid UUID." });
    }
    if (typeof group_name !== "string" || !group_name.trim()) {
      return res.status(400).json({ message: "group_name is required" });
    }
    if (group_name.trim().length > 30) {
      return res.status(400).json({ message: "group_name must not exceed 30 characters" });
    }

    const result = await dbClient.select().from(Groups).where(and(
      eq(Groups.topic_id, topic_id),
      eq(Groups.group_id, group_id),
    ));
    const group = result[0];
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }
    // คนสร้างเท่านั้นที่แก้ได้
    if (group.owner_id !== user_id) {
      return res.status(403).json({ message: "Forbidden: You are not the owner of this group" });
    }

    const updatedGroup = await dbClient.update(Groups).set({
      group_name: group_name.trim(),
      edit_at: new Date(),
    }).where(and(
      eq(Groups.topic_id, topic_id),
      eq(Groups.group_id, group_id),
    )).returning();

    return res.status(200).json({
      message: "Group updated successfully",
      data: updatedGroup[0],
    });
  } catch (error) {
    console.error("PUT /groups/:topic_id/:group_id Error:", error);
    return res.status(500).json({ message: "Something went wrong with server" });
  }
});

router.delete("/:topic_id/:group_id", authenticateToken, async (req, res) => {
  try {
    const { topic_id, group_id } = req.params as {
      topic_id: string;
      group_id: string;
    };
    const user_id = req.user?.user_id;

    if (!isUUID(topic_id) || !isUUID(group_id)) {
      return res.status(400).json({ message: "Invalid topic_id or group_id format. It should be a valid UUID." });
    }

    const result = await dbClient.select().from(Groups).where(and(
      eq(Groups.topic_id, topic_id),
      eq(Groups.group_id, group_id),
    ));
    const group = result[0];
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }
    // คนสร้างเท่านั้นที่ลบได้
    if (group.owner_id !== user_id) {
      return res.status(403).json({ message: "Forbidden: You are not the owner of this group" });
    }

    await dbClient.delete(Groups).where(and(
      eq(Groups.topic_id, topic_id),
      eq(Groups.group_id, group_id),
    ));
    return res.status(200).json({ message: "Group deleted successfully" });
  } catch (error) {
    console.error("DELETE /groups/:topic_id/:group_id Error:", error);
    return res.status(500).json({ message: "Something went wrong with server" });
  }
});

export default router;
