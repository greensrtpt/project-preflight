import { dbClient, dbConn } from "@db/client.js";

async function queryData() {
  const users = await dbClient.query.usersTable.findMany();
  const topics = await dbClient.query.topicsTable.findMany();
  const posts = await dbClient.query.postsTable.findMany();

  console.log({
    users,
    topics,
    posts,
  });

  dbConn.end();
}

queryData();