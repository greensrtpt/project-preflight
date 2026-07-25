import { Router } from "express";
import { dbClient } from "@db/client.js";
import { Topics,Groups } from "@db/schema.js";
import { and,eq } from "drizzle-orm";
import { validate as isUUID } from "uuid";

const router = Router();

router.post("/:topic_id", async (req,res) => {
    try{
      const { topic_id } = req.params as {
       topic_id: string;
       };
      const { group_name } = req.body;
        
      if (!group_name) {
          return res.status(400).json({
          message: "group name is required",
         });
      }

      const newGroup = await dbClient
      .insert(Groups)
      .values({
        topic_id:topic_id,
        group_name:group_name
      })
      .returning();

     return res.status(201).json(newGroup[0]);
    }
    catch(err) {
        console.error(err);
        return res.status(500).json({
         message: "Something went wrong with server",
         error: err instanceof Error ? err.message : String(err),
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
    try {
      const { topic_id, group_id } = req.params as {
       topic_id: string;
       group_id: string;
       };

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

      const deletedGroup = await dbClient
        .delete(Groups)
        .where(
          and(
            eq(Groups.topic_id, topic_id),
            eq(Groups.group_id, group_id),
          ))
        .returning();


      return res.status(200).json({
      message: "Delete group success",
      deletedGroup,
      delete_group_success: true,
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