import { Router } from "express";
import { dbClient } from "@db/client.js";
import { Posts, Topics, Users } from "@db/schema.js";
import { eq } from "drizzle-orm";
import { authenticateToken } from "@src/Middleware/auth.js";

const router = Router();

const uuidRegex =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * POST /posts/:topic_id
 */
router.post("/:topic_id", authenticateToken, async (req, res) => {
  try {
    const topicParam = req.params.topic_id;
    const topic_id = Array.isArray(topicParam) ? topicParam[0] : topicParam;
    const author_id = req.user?.user_id;
    const { title, descriptions } = req.body ?? {};

    if (!uuidRegex.test(topic_id)) {
      return res.status(400).json({
        message: "topic_id must be a valid UUID",
      });
    }

    if (!author_id || !uuidRegex.test(author_id)) {
      return res.status(401).json({
        message: "Invalid authentication information",
      });
    }

    if (typeof title !== "string" || title.trim().length === 0) {
      return res.status(400).json({
        message: "title is required and must be a string",
      });
    }

    if (title.trim().length > 20) {
      return res.status(400).json({
        message: "title must not exceed 20 characters",
      });
    }

    if (
      typeof descriptions !== "string" ||
      descriptions.trim().length === 0
    ) {
      return res.status(400).json({
        message: "descriptions is required and must be a string",
      });
    }

    if (descriptions.trim().length > 150) {
      return res.status(400).json({
        message: "descriptions must not exceed 150 characters",
      });
    }

    let editDate = new Date();
    if (edit_at !== undefined) {
      if (typeof edit_at !== "string") {
        return res.status(400).json({
          message: "edit_at must be a valid date",
        });
      }

      editDate = new Date(edit_at);
      if (Number.isNaN(editDate.getTime())) {
        return res.status(400).json({
          message: "edit_at must be a valid date",
        });
      }
    }

    const [topic, author] = await Promise.all([
      dbClient
        .select({ topic_id: Topics.topic_id })
        .from(Topics)
        .where(eq(Topics.topic_id, topic_id))
        .limit(1),
      dbClient
        .select({ user_id: Users.user_id })
        .from(Users)
        .where(eq(Users.user_id, author_id))
        .limit(1),
    ]);

    if (topic.length === 0) {
      return res.status(400).json({ message: "Topic not found" });
    }

    if (author.length === 0) {
      return res.status(401).json({
        message: "Authenticated user not found",
      });
    }

    const newPost = await dbClient
      .insert(Posts)
      .values({
        topic_id,
        title: title.trim(),
        descriptions: descriptions.trim(),
        author_id,
        edit_at: new Date(),
      })
      .returning();

    return res.status(201).json({
      message: "Post created successfully",
      data: newPost[0],
    });
  } catch (error) {
    console.error(error);
  }
//     return res.status(500).json({
//       message: "Cannot create post",
//     });
//   }
// });

// /**
//  * GET /posts/:id
//  */
// router.get("/:id", async (req, res) => {
//   try {
//     const { id } = req.params;

//     const posts = await dbClient
//       .select()
//       .from(Posts)
//       .where(eq(Posts.post_id, id));

//     const post = posts[0];

//     if (!post) {
//       res.status(404).json({
//         message: "Post not found",
//       });
//       return;
//     }

//     res.status(200).json(post);
//   } catch (error) {
//     console.error(error);

//     res.status(500).json({
//       message: "Cannot get post",
//     });
//   }
// });
  });

export default router;
