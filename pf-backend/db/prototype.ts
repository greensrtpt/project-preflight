import { dbClient, dbConn } from "@db/client.js";

async function queryData() {
  const users = await dbClient.query.Users.findMany();
  const topics = await dbClient.query.Topics.findMany();
  const posts = await dbClient.query.Posts.findMany();

  console.log({
    users,
    topics,
    posts,
  });

  dbConn.end();
}

queryData();