import { Router } from "express";
import { dbClient } from "@db/client.js";
import { Posts,Topics } from "@db/schema.js";
import { eq } from "drizzle-orm";
import { Users } from "@db/schema.js";
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
 * GET all post from topic_id
 */
router.get("/:ttopic_id", async (req, res) => {
  try {
    const { ttopic_id } = req.params;

    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

    if (!uuidRegex.test(ttopic_id)) {
      return res.status(400).json({
        message: "Invalid topic_id format. It should be a valid UUID.",
      });
    }

    const posts = await dbClient
      .select({
        post_id:Posts.post_id,
        title:Posts.title,
        descriptions:Posts.descriptions,
        auther:Users.username,
        edit_at:Posts.edit_at
      })
      .from(Posts)
      .innerJoin(Users, eq(Posts.author_id, Users.user_id))
      .where(eq(Posts.topic_id, ttopic_id));

    if (!posts || posts.length === 0) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    return res.status(200).json({
      data:posts
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Cannot get post",
    });
  }
});

export default router;
