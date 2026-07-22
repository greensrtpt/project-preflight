import { Router } from "express";
import { dbClient } from "@db/client.js";
import { Posts,Topics } from "@db/schema.js";
import { eq } from "drizzle-orm";
import { authenticateToken } from "@src/Middleware/auth.js";
import { validate as isUUID } from "uuid";

const router = Router();

/**
 * POST /posts
 */
router.get("/:topic_id", async (req, res) => {
  try{
    const topic_id = req.params.topic_id;
    
  }
  catch(error){
    console.error(error);

    res.status(500).json({
      message: "Cannot get posts",
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