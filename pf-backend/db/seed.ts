import "dotenv/config";
import { dbClient, dbConn } from "./client.js";
import { Topics } from "./schema.js";

const topicsMockData = [
  
];

// สร้างเฉพาะ 3 Topic หลักที่ระบบกำหนดไว้ และไม่ Seed Groups
async function seedTopics() {
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
    console.error("❌ Topics seed failed:", error);
    process.exitCode = 1;
  } finally {
    await dbConn.end();
  }
}

seedTopics();
