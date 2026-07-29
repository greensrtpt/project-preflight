import "dotenv/config";
import { dbClient, dbConn } from "./client.js";
import { Topics,Groups,Posts,Users } from "./schema.js";

const topic_id_Activity = "3d5b36cf-67b7-46cc-8ee6-0025ba9a0e23" //เก็บค่าtopic_idของ กิจกรรม
const topic_id_Study = "98178014-d4ec-4f7e-80e3-67f448ec6ae9" //เก็บค่าtopic_idของ การเรียน
const topic_id_CMULife = "2152929b-fb88-4425-b311-0ce09604e76c" //เก็บค่าtopic_idของ ชีวิตใน มช
const master_id = "7e047412-fd89-4ac7-acb2-476fbef0257e";
const master_token="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiN2UwNDc0MTItZmQ4OS00YWM3LWFjYjItNDc2ZmJlZjAyNTdlIiwidXNlcm5hbWUiOiJtYXN0ZXIiLCJpYXQiOjE3ODUyNTcxNzAsImV4cCI6MTc5MjQ1NzE3MH0.Etof6WHxHAT6tT1Cmk0Wd9SgOFb26-9fxxHPkXMoK_c"
const comSciGroupId = "4c29a101-5eae-4c52-81d7-784680b3e801";

// username: normalizedUsername,
// password: hashedPassword,
const userMockData = [
  {
    user_id: master_id,
    username: "master",
    password: "12345678Aa"
  },
];

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
    group_id:"4c29a101-5eae-4c52-81d7-784680b3e801",
    topic_id:topic_id_Activity,
    group_name:"Computer Science",
    owner_id:master_id,
    owner_name:"master",
    edit_at:new Date("2026-07-28T16:47:22.934Z")
  },
];


const postComSciActivityMockData = [ //ข้อมูลpostในgroup computer science ในtopic กิจกรรม
  {
    group_id: "4c29a101-5eae-4c52-81d7-784680b3e801",
    title: "กิจกรรมในเดือนนี้",
    descriptions: "industry. Lorem Ipsum has been the industry's standard dummy text ever since 1966, when designers at Letraset and James",
    author_id: "7e047412-fd89-4ac7-acb2-476fbef0257e",
    author_name: "master",
    edit_at: new Date("2026-07-28T16:50:07.712Z")
  }
];

// Seed สร้างเฉพาะ 3 Topic หลักที่ระบบกำหนดไว้
// Groups และ Posts ไม่ Seed เพราะเป็นข้อมูลที่ Member ต้องสร้างผ่าน API
async function mainSeed() {
  try {
    await dbClient.insert(Users).values(userMockData).onConflictDoNothing();
    await dbClient.insert(Topics).values(topicsMockData).onConflictDoNothing();
    await dbClient.insert(Groups).values(groupActivityMockData).onConflictDoNothing();
    await dbClient.insert(Posts).values(postComSciActivityMockData).onConflictDoNothing();

  } catch (error) {
    console.error("❌ seed failed:", error);
    process.exitCode = 1;
  } finally {
    await dbConn.end();
  }
}

mainSeed();
