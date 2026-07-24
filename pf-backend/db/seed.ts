import "dotenv/config";
import { dbClient } from "./client.js";
import { Topics } from "./schema.js";

const topicsMockData = [
  {
    topic_id: "996c5d4e-2fb3-4436-bfbf-00c65e62685c",
    topic_name: "activities",
  },
  {
    topic_id: "965b6a4c-b18e-41f9-b824-34dbec8ec82a",
    topic_name: "study",
  },
  {
    topic_id: "42fa09c9-2f6a-44e6-9236-6e1905a6d047",
    topic_name: "university life",
  },
];

async function seedTopics() {
  try {
    const insertedTopics = await dbClient
      .insert(Topics)
      .values(topicsMockData)
      .onConflictDoNothing()
      .returning();

    console.log("Inserted topics:", insertedTopics);
    console.log(`✅ Added ${insertedTopics.length} topics`);
  } catch (error) {
    console.error("❌ Topics seed failed:", error);
    process.exitCode = 1;
  }
}

seedTopics();