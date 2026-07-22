import { Router } from "express";
import { dbClient } from "@db/client.js";
import { Posts, Topics } from "@db/schema.js";
import { eq, ilike } from "drizzle-orm";

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
    const posts = await dbClient.select().from(Posts);

    const topicsWithPosts = topics.map((topic) => ({
      topic_id: topic.topic_id,
      topic_name: topic.topic_name,
      post: posts.filter((post) => post.topic_id === topic.topic_id),
    }));

    res.status(200).json(topicsWithPosts);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Cannot get topics",
    });
  }
});
 
// /**
//  * GET /topics/search?query=...
//  */
// router.get("/search", async (req, res) => {
//   try {
//     const query = String(req.query.query ?? "").trim();

//     if (!query) {
//       return res.status(400).json({
//         message: "query is required",
//       });
//     }

//     const topics = await dbClient
//       .select()
//       .from(Topics)
//       .where(ilike(Topics.topic_name, `%${query}%`));

//     return res.status(200).json({
//       search_success: true,
//       message: "Search topics successfully",
//       data: topics,
//     });
//   } catch (error) {
//     console.error(error);

//     return res.status(500).json({
//       message: "Cannot search topics",
//     });
//   }
// });

/**
 * GET /topics/:topic_id
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

    const posts = await dbClient
      .select()
      .from(Posts)
      .where(eq(Posts.topic_id, topic_id));

    res.status(200).json({
      topic_id: topic.topic_id,
      topic_name: topic.topic_name,
      post: posts,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Cannot get topic",
    });
  }
});

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