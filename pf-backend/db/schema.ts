import {
  pgTable,
  uuid,
  varchar,
  timestamp,
} from "drizzle-orm/pg-core";

/**
 * ตารางผู้ใช้งาน
 */
export const usersTable = pgTable("users", {
  user_id: uuid("user_id").primaryKey().defaultRandom(),

  username: varchar("username", { length: 30 })
    .notNull()
    .unique(),

  password: varchar("password", { length: 30 }).notNull(),
});

/**
 * ตารางหัวข้อ
 */
export const topicsTable = pgTable("topics", {
  topic_id: uuid("topic_id").primaryKey().defaultRandom(),

  topic_name: varchar("topic_name", { length: 20 })
    .notNull()
    .unique(),
});

/**
 * ตารางโพสต์
 */
export const postsTable = pgTable("posts", {
  post_id: uuid("post_id").primaryKey().defaultRandom(),

  topic_id: uuid("topic_id")
    .references(() => topicsTable.topic_id)
    .notNull(),

  author_id: uuid("author_id")
    .references(() => usersTable.user_id)
    .notNull(),

  title: varchar("title", { length: 20 }).notNull(),

  descriptions: varchar("descriptions", { length: 150 }).notNull(),

  // วันที่สร้างหรือแก้ไขล่าสุด
  edit_at: timestamp("edit_at").defaultNow().notNull(),
});