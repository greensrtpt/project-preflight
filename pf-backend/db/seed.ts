import "dotenv/config";
import { dbClient, dbConn } from "./client.js";
import { Topics } from "./schema.js";

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

// Seed สร้างเฉพาะ 3 Topic หลักที่ระบบกำหนดไว้
// Groups และ Posts ไม่ Seed เพราะเป็นข้อมูลที่ Member ต้องสร้างผ่าน API
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

  } catch (error) {
    console.error("❌ seed failed:", error);
    process.exitCode = 1;
  } finally {
    await dbConn.end();
  }
}

mainSeed();
