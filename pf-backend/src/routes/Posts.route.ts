import { Router } from "express";
import { dbClient } from "@db/client.js";
import { Posts } from "@db/schema.js";
import { eq } from "drizzle-orm";

const router = Router();

/**
 * POST /posts
 */
router.post("/", async (req, res) => {
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
 * GET /posts/:id
 */
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const posts = await dbClient
      .select()
      .from(Posts)
      .where(eq(Posts.post_id, id));

    const post = posts[0];

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


export default router;