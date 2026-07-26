import { Router } from "express";
import { dbClient } from "@db/client.js";
import { Posts,Groups,Topics } from "@db/schema.js";
import { and,eq } from "drizzle-orm";
import { authenticateToken } from "@src/Middleware/auth.js";
import { validate as isUUID } from "uuid";


const router = Router();

// Post ผูกกับ Group โดยตรงผ่าน group_id และ Group เชื่อมกับ Topic อยู่แล้ว
// ดังนั้น Posts API ใช้ group_id อย่างเดียว ไม่ต้องรับ topic_id ซ้ำใน URL

/**
 * POST /posts/:group_id
 */
router.post("/:group_id", authenticateToken, async (req, res) => {
    try {
      const { group_id } = req.params as {
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
 
      if (!isUUID(group_id)) {
      return res.status(400).json({
        message: "Invalid group_id Format. It should be a valid UUID.",
      });
      }

      if (!title || !descriptions) {
        return res.status(400).json({
          message: "title and descriptions are required",
        });
      }

      // ตรวจความยาวก่อนบันทึก เพื่อให้ตรงกับขนาดที่กำหนดใน Database
      if (title.length > 20 || descriptions.length > 150) {
        return res.status(400).json({
          message: "title must not exceed 20 characters and descriptions must not exceed 150 characters",
        });
      }

      // หา post และเช็ค owner
      const existingGroup = await dbClient
     .select()
     .from(Groups)
     // Post ผูกกับ Group โดยตรง จึงไม่จำเป็นต้องรับ topic_id
     .where(eq(Groups.group_id, group_id));

      if (existingGroup.length === 0) {
        return res.status(404).json({
          message: "Group not found",
        });
      }

      const createPost = await dbClient
        .insert(Posts)
        .values({
          group_id:group_id,
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
 * GET each post
 */
// URL: GET /posts/:group_id/:post_id
router.get("/:group_id/:post_id", async (req,res) => {
  try{
    const { group_id, post_id } = req.params as {
       group_id: string;
       post_id: string;
       };

    if (!isUUID(group_id) || !isUUID(post_id)) {
      return res.status(400).json({
        message: "Invalid group_id or post_id Format. It should be a valid UUID.",
      });
    }

    //เลือกระบุ Column เฉพาะที่จะใช้งาน ป้องกัน Error เรื่อง Column mismatch
    const groupResult = await dbClient
      .select()
      .from(Groups)
      .where(eq(Groups.group_id, group_id));

    const group = groupResult[0];  

    if (!group) {
      res.status(404).json({
        message: "Group not found",
      });
      return;
    }

    const postResult = await dbClient
      .select()
      .from(Posts)
      // ป้องกันการดึง Post ที่ไม่ได้อยู่ใน Group ตาม URL
      .where(and(
        eq(Posts.group_id, group_id),
        eq(Posts.post_id, post_id)
      ));

    const post = postResult[0];  

    if (!post) {
      res.status(404).json({
        message: "Post not found",
      });
      return;
    }

    const topicResult = await dbClient
      .select()
      .from(Topics)
      .where(eq(Topics.topic_id, group.topic_id));

    res.status(200).json({
      topic_id: topicResult[0].topic_id,
      topic_name: topicResult[0].topic_name,
      group_id: group_id,
      group_name: group.group_name,
      post: post
    });
  }catch(err){
    console.error(err);

    console.error("GET /:group_id/:post_id Error:", err);

    res.status(500).json({
      message: "Something went wrong with server",
    });
  }
})

/**
 * GET all post from group
 */
// URL: GET /posts/:group_id
router.get("/:group_id", async (req,res) => {
  try{
    const { group_id } = req.params as {
       group_id: string;
       };

    
    //เลือกระบุ Column เฉพาะที่จะใช้งาน ป้องกัน Error เรื่อง Column mismatch
    const groupResult = await dbClient
      .select()
      .from(Groups)
      .where(eq(Groups.group_id, group_id));

    const group = groupResult[0];  

    if (!group) {
      res.status(404).json({
        message: "Group not found",
      });
      return;
    }

    const postResult = await dbClient
      .select()
      .from(Posts)
      .where(eq(Posts.group_id, group_id));

    const topicResult = await dbClient
      .select()
      .from(Topics)
      .where(eq(Topics.topic_id, group.topic_id));

    res.status(200).json({
      topic_id: topicResult[0].topic_id,
      topic_name: topicResult[0].topic_name,
      group_id: group_id,
      group_name: group.group_name,
      post: postResult
    });
  }catch(err){
    console.error(err);

    console.error("GET /:group_id Error:", err);

    res.status(500).json({
      message: "Something went wrong with server",
    });
  }
})

/**
 * PUT post
 */
// URL: PUT /posts/:group_id/:post_id
router.put("/:group_id/:post_id",authenticateToken,async (req, res) => {
    try {
      const { group_id, post_id } = req.params as {
       group_id: string;
       post_id: string;
       };
      const { title, descriptions } = req.body;

      // user จาก token
      const user_id = req.user?.user_id;

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

      // ใช้ข้อกำหนดความยาวเดียวกันทั้งตอนสร้างและแก้ไข Post
      if (title.length > 20 || descriptions.length > 150) {
        return res.status(400).json({
          message: "title must not exceed 20 characters and descriptions must not exceed 150 characters",
        });
      }

      //check existing group
      const existingGroup = await dbClient
        .select()
        .from(Groups)
        .where(eq(Groups.group_id, group_id));

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
        data: updatedPost
          
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
// URL: DELETE /posts/:group_id/:post_id และ DELETE ไม่รับ request body
router.delete("/:group_id/:post_id",authenticateToken,async (req, res) => {
    try {
      const { group_id, post_id } = req.params as {
       group_id: string;
       post_id: string;
       };

      // DELETE ไม่รับ title หรือ descriptions และใช้ ID จาก URL เท่านั้น
      // user จาก token
      const user_id = req.user?.user_id;

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

      //check existing group
      const existingGroup = await dbClient
        .select()
        .from(Groups)
        .where(eq(Groups.group_id, group_id));

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
