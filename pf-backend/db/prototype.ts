import { dbClient, dbConn } from "@db/client.js";

async function queryData() {
  try {
    const users = await dbClient.query.usersTable.findMany();
    const topics = await dbClient.query.topicsTable.findMany();
    const posts = await dbClient.query.postsTable.findMany();

    console.log({
      users,
      topics,
      posts,
    });
  } catch (error) {
    console.error("Database query failed:", error);
  } finally {
    await dbConn.end();
  }
}

queryData();