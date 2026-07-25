import { Router } from "express";
import { dbClient } from "@db/client.js";
import { Posts,Topics,Groups } from "@db/schema.js";
import { and,eq } from "drizzle-orm";
import { Users } from "@db/schema.js";
import { authenticateToken } from "@src/Middleware/auth.js";
import { validate as isUUID } from "uuid";


const router = Router();

/**
 * POST /posts
 */
router.post("/:topic_id/:group_id",authenticateToken,async (req, res) => {
    try {
      const { topic_id,group_id } = req.params as {
       topic_id: string;
       group_id: string;
       };
      const { title, descriptions } = req.body;


      // user จาก token
      const user_id = req.user?.user_id;
      const username = req.user?.username;

      if (!user_id || !username) {
      return res.status(401).json({
      message: "Unauthorized: User not logged in",
      });
      }
 
      if (!isUUID(topic_id)||!isUUID(group_id)) {
      return res.status(400).json({
        message: "Invalid topic_id or group_id Format. It should be a valid UUID.",
      });
      }

      if (!title || !descriptions) {
        return res.status(400).json({
          message: "title and descriptions are required",
        });
      }

      // หา post และเช็ค owner
      const existingGroup = await dbClient
     .select()
     .from(Groups)
     .innerJoin(Topics, eq(Groups.topic_id, Topics.topic_id))
      .where(
      and( 
      eq(Groups.group_id, group_id),
      eq(Topics.topic_id, topic_id),   
    )
    );

      if (existingGroup.length === 0) {
        return res.status(404).json({
          message: "Group not found",
        });
      }

      const createPost = await dbClient
        .insert(Posts)
        .values({
          group_id:topic_id,
          title:title,
          descriptions:descriptions,
          author_id:user_id,
          author_name:username,
          edit_at:new Date()
        })
        .returning();

      return res.status(201).json({
        message: "Post created successfully",
        data:createPost
      });


    } catch(err) {
      console.error(err);

      return res.status(500).json({
        message: "something went wrong with server",
      });
    }
  }
);

/**
 * PUT post
 */
router.put("/:topic_id/:group_id/:post_id",authenticateToken,async (req, res) => {
    try {
      const { topic_id, group_id, post_id } = req.params as {
       topic_id: string;
       group_id: string;
       post_id: string;
       };
      const { title, descriptions } = req.body;

      // user จาก token
      const user_id = req.user?.user_id;

      if (!isUUID(topic_id)) {
      return res.status(400).json({
        message: "Invalid topic_id Format. It should be a valid UUID.",
      });
      }

      if (!isUUID(group_id)) {
      return res.status(400).json({
        message: "Invalid group_id Format. It should be a valid UUID.",
      });
      }

      if (!isUUID(post_id)) {
      return res.status(400).json({
        message: "Invalid post_id Format. It should be a valid UUID.",
      });
      }

      if (!title || !descriptions) {
        return res.status(400).json({
          message: "title and descriptions are required",
        });
      }

      //check existing topic
      const existingTopic = await dbClient
        .select()
        .from(Topics)
        .where(
            eq(Topics.topic_id, topic_id),
        );

      if (existingTopic.length === 0) {
        return res.status(404).json({
          message: "Topic not found",
        });
      }

      //check existing group
      const existingGroup = await dbClient
        .select()
        .from(Groups)
        .where(and(
            eq(Groups.topic_id, topic_id),
            eq(Groups.group_id, group_id),
          )
        );

      if (existingGroup.length === 0) {
        return res.status(404).json({
          message: "Group not found",
        });
      }

      //check existing post
      const existingPost = await dbClient
        .select()
        .from(Posts)
        .where(and(
            eq(Posts.group_id, group_id),
            eq(Posts.post_id, post_id),
          )
        );

      if (existingPost.length === 0) {
        return res.status(404).json({
          message: "Post not found",
        });
      }

      // เช็คว่า user เป็นเจ้าของ post หรือไม่
      if (existingPost[0].author_id !== user_id) {
        return res.status(403).json({
          message: "You are not allowed to edit this post",
        });
      }

      const updatedPost = await dbClient
        .update(Posts)
        .set({
          title,
          descriptions,
          edit_at: new Date(),
        })
        .where(
          and(
            eq(Posts.post_id, post_id),
            eq(Posts.group_id, group_id)
          ))
        .returning();


      return res.status(200).json({
        message: "Post updated successfully",
        data: {
          topic_id,
          updatedPost
        }
          
      });


    } catch(err) {
      console.error(err);

      return res.status(500).json({
        message: "something went wrong with server",
      });
    }
  }
);

/**
 * DELETE post
 */
router.delete("/:topic_id/:group_id/:post_id",authenticateToken,async (req, res) => {
    try {
      const { topic_id, group_id, post_id } = req.params as {
       topic_id: string;
       group_id: string;
       post_id: string;
       };
      const { title, descriptions } = req.body;

      // user จาก token
      const user_id = req.user?.user_id;

      if (!isUUID(topic_id)) {
      return res.status(400).json({
        message: "Invalid topic_id Format. It should be a valid UUID.",
      });
      }

      if (!isUUID(group_id)) {
      return res.status(400).json({
        message: "Invalid group_id Format. It should be a valid UUID.",
      });
      }

      if (!isUUID(post_id)) {
      return res.status(400).json({
        message: "Invalid post_id Format. It should be a valid UUID.",
      });
      }

      if (!title || !descriptions) {
        return res.status(400).json({
          message: "title and descriptions are required",
        });
      }

      //check existing topic
      const existingTopic = await dbClient
        .select()
        .from(Topics)
        .where(
            eq(Topics.topic_id, topic_id),
        );

      if (existingTopic.length === 0) {
        return res.status(404).json({
          message: "Topic not found",
        });
      }

      //check existing group
      const existingGroup = await dbClient
        .select()
        .from(Groups)
        .where(and(
            eq(Groups.topic_id, topic_id),
            eq(Groups.group_id, group_id),
          )
        );

      if (existingGroup.length === 0) {
        return res.status(404).json({
          message: "Group not found",
        });
      }

      //check existing post
      const existingPost = await dbClient
        .select()
        .from(Posts)
        .where(and(
            eq(Posts.group_id, group_id),
            eq(Posts.post_id, post_id),
          )
        );

      if (existingPost.length === 0) {
        return res.status(404).json({
          message: "Post not found",
        });
      }

      // เช็คว่า user เป็นเจ้าของ post หรือไม่
      if (existingPost[0].author_id !== user_id) {
        return res.status(403).json({
          message: "You are not allowed to delete this post",
        });
      }

      const deleteedPost = await dbClient
        .delete(Posts)
        .where(
          and(
            eq(Posts.post_id, post_id),
            eq(Posts.group_id, group_id),
            eq(Posts.author_id, user_id)
          ))
        .returning();


      return res.status(200).json({
      message: "Delete post success",
      topic_id,
      group_id,
      post_id,
      delete_post_success: true,
    });

    } catch(err) {
      console.error(err);

      return res.status(500).json({
        message: "something went wrong with server",
      });
    }
  }
);

export default router;
