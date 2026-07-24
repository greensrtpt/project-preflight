import {
  pgTable,
  uuid,
  varchar,
  timestamp,
} from "drizzle-orm/pg-core";
//ทดลองอัพ
/**
 * ตารางผู้ใช้งาน
 */
export const Users = pgTable("Users", {
  // รหัสผู้ใช้
  user_id: uuid("user_id").primaryKey().defaultRandom(),

  // ชื่อผู้ใช้
  username: varchar("username", { length: 30 })
    .notNull()
    .unique(),/////////////////////////////////

  // รหัสผ่าน
  password: varchar("password", { length: 30 }).notNull(),
});

/**
 * ตารางหัวข้อ
 */
export const Topics = pgTable("Topics", {
  // รหัสหัวข้อ
  topic_id: uuid("topic_id").primaryKey().defaultRandom(),
    
  // ชื่อหัวข้อ
  topic_name: varchar("name", { length: 20 })
  .notNull()
  .unique(),
});
/*
 * ตารางโพสต์
 */
export const Posts = pgTable("Posts", {
    // รหัสหัวข้อ
  topic_id: uuid("topic_id")
    .references(() => Topics.topic_id)
    .notNull(),
  // รหัสโพสต์
  post_id: uuid("post_id").primaryKey().defaultRandom(),

  // หัวข้อโพสต์
  title: varchar("title", { length: 30 }).notNull(),

  // เนื้อหาโพสต์
  descriptions: varchar("descriptions", { length: 150 }).notNull(),

  // รหัสผู้สร้างโพสต์
  author_id: uuid("author_id")
    .references(() => Users.user_id)
    .notNull(),

  author_name: varchar("author_name", { length: 30 })
    .notNull(),
   ///////////////////////////////// .unique()

  // วันที่สร้าง
  edit_at: timestamp("edit_at").defaultNow().notNull(),
});