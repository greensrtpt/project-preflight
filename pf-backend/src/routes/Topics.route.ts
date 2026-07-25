import { Router } from "express";
import { dbClient } from "@db/client.js";
import { Posts, Topics, Groups } from "@db/schema.js";
import { eq } from "drizzle-orm";

const router = Router();

/**
 * POST /topics
 */
router.post("/", async (req, res) => {
  try {
    const { topic_name } = req.body;

    if (!topic_name) {
      res.status(400).json({
        message: "topic_name is required",
      });
      return;
    }

    const newTopic = await dbClient
      .insert(Topics)
      .values({
        topic_name,
      })
      .returning();

    res.status(201).json(newTopic[0]);
  } catch (error) {
  console.error(error);

  res.status(500).json({
    message: "Cannot create topic",
    error: error instanceof Error ? error.message : String(error),
  });
}
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
// router.get("/:topic_id", async (req, res) => {
//   try {
//     const { topic_id } = req.params;

//     const topicResult = await dbClient
//       .select()
//       .from(Topics)
//       .where(eq(Topics.topic_id, topic_id));

//     const topic = topicResult[0];

//     if (!topic) {
//       res.status(404).json({
//         message: "Topic not found",
//       });
//       return;
//     }

//     //เลือกระบุ Column เฉพาะที่จะใช้งาน ป้องกัน Error เรื่อง Column mismatch
//     const groups = await dbClient
//       .select()
//       .from(Groups)
//       .where(eq(Groups.topic_id, topic_id));

//     res.status(200).json({
//       topic_id: topic.topic_id,
//       topic_name: topic.topic_name,
//       group: groups,
//     });
//   } catch (error) {
//     console.error(error);

//     console.error("GET /topics/:topic_id Error:", error);

//     res.status(500).json({
//       message: "Somwthing went wrong with server",
//     });
//   }
// });

/**
 * DELETE /topics/:topic_id
 */
router.delete("/:topic_id", async (req, res) => {
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

    const posts = await dbClient
      .select()
      .from(Posts)
      .where(eq(Posts.topic_id, topic_id));

    const postIds = posts.map((post) => post.post_id);

    await dbClient
      .delete(Posts)
      .where(eq(Posts.topic_id, topic_id));

    await dbClient
      .delete(Topics)
      .where(eq(Topics.topic_id, topic_id));

    res.status(200).json({
      topic_id,
      post_id: postIds,
      delete_topic_success: true,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Cannot delete topic",
    });
  }
});

export default router;



// [
//   {
//     "topic_id": "996c5d4e-2fb3-4436-bfbf-00c65e62685c",
//     "topic_name": "activities",
//     "post": []
//   },
//   {
//     "topic_id": "965b6a4c-b18e-41f9-b824-34dbec8ec82a",
//     "topic_name": "study",
//     "post": []
//   },
//   {
//     "topic_id": "42fa09c9-2f6a-44e6-9236-6e1905a6d047",
//     "topic_name": "university life",
//     "post": []
//   }
// ]