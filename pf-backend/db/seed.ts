import "dotenv/config";
import { dbClient, dbConn } from "./client.js";
import { Topics,Groups,Posts } from "./schema.js";

const topic_id_Activity = "3d5b36cf-67b7-46cc-8ee6-0025ba9a0e23" //เก็บค่าtopic_idของ กิจกรรม
const topic_id_Study = "98178014-d4ec-4f7e-80e3-67f448ec6ae9" //เก็บค่าtopic_idของ การเรียน
const topic_id_CMULife = "2152929b-fb88-4425-b311-0ce09604e76c" //เก็บค่าtopic_idของ ชีวิตใน มช

const topicsMockData = [
  {
    topic_id:topic_id_Activity,
    topic_name:"กิจกรรม"
  },
  {
    topic_id:topic_id_Study,
    topic_name:"การเรียน",
  },
  {
    topic_id:topic_id_CMULife,
    topic_name:"ชีวิตใน มช",
  },
];

const groupActivityMockData = [ //ข้อมูลgroupใน topicกิจกรรม
  {
    group_id:"301a9aad-3a2f-49a5-8dee-5f77012031d0",
    topic_id:topic_id_Activity,
    group_name:"Computer Science"
  },
  {
    group_id:"fc636475-22aa-4d59-89e0-015bc5c78aba",
    topic_id:topic_id_Activity,
    group_name:"ชมรมบาส"
  },
];

const postComSciActivityMockData = [ //ข้อมูลpostในgroup computer science ในtopic กิจกรรม
  {
      group_id: "301a9aad-3a2f-49a5-8dee-5f77012031d0",
      post_id: "c81a4e56-0056-4b2a-a4d8-d6af1a15203c",
      title: "รายชื่อสมาชิก",
      descriptions: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the indu",
      author_id: "aede77a3-b2bc-439a-886a-73333112ba0f",
      author_name: "eiei",
      edit_at: new Date("2026-07-26T04:58:51.729Z")
  }
];

// สร้างเฉพาะ 3 Topic หลักที่ระบบกำหนดไว้ และไม่ Seed Groups
async function mainSeed() {
  try {
    const insertedTopics = await dbClient
      .insert(Topics)
      .values(topicsMockData)
      // ป้องกันข้อมูล Topic ซ้ำเมื่อรัน seed มากกว่าหนึ่งครั้ง
      .onConflictDoNothing()
      .returning();

    console.log("Inserted topics:", insertedTopics);
    console.log(`✅ Added ${insertedTopics.length} topics`);

    const insertedGroups = await dbClient
      .insert(Groups)
      .values(groupActivityMockData)
      // ป้องกันข้อมูล Topic ซ้ำเมื่อรัน seed มากกว่าหนึ่งครั้ง
      .onConflictDoNothing()
      .returning();

    console.log("Inserted groups:", insertedGroups);
    console.log(`✅ Added ${insertedGroups.length} groups`);

    const insertedPosts = await dbClient
      .insert(Posts)
      .values(postComSciActivityMockData)
      // ป้องกันข้อมูล Topic ซ้ำเมื่อรัน seed มากกว่าหนึ่งครั้ง
      .onConflictDoNothing()
      .returning();

    console.log("Inserted topics:", insertedPosts);
    console.log(`✅ Added ${insertedPosts.length} posts`);
  } catch (error) {
    console.error("❌ seed failed:", error);
    process.exitCode = 1;
  } 
}  

mainSeed();
