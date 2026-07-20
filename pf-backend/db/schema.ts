import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

/**
 * ตารางผู้ใช้งาน
 */
export const usersTable = pgTable("users", {
  // รหัสผู้ใช้
  id: uuid("id").primaryKey().defaultRandom(),

  // ชื่อผู้ใช้
  username: varchar("username", { length: 50 })
    .notNull()
    .unique(),

  // รหัสผ่าน
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),

  // วันที่สร้าง
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

/**
 * ตารางหัวข้อ
 */
export const topicsTable = pgTable("topics", {
  // รหัสหัวข้อ
  id: uuid("id").primaryKey().defaultRandom(),

  // ชื่อหัวข้อ
  name: varchar("name", { length: 100 })
    .notNull()
    .unique(),

  // รายละเอียด
  description: text("description"),

  // วันที่สร้าง
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

/**
 * ตารางโพสต์
 */
export const postsTable = pgTable("posts", {
  // รหัสโพสต์
  id: uuid("id").primaryKey().defaultRandom(),

  // หัวข้อโพสต์
  title: varchar("title", { length: 200 }).notNull(),

  // เนื้อหาโพสต์
  content: text("content").notNull(),

  // รหัสผู้สร้างโพสต์
  authorId: uuid("author_id")
    .references(() => usersTable.id)
    .notNull(),

  // รหัสหัวข้อ
  topicId: uuid("topic_id")
    .references(() => topicsTable.id)
    .notNull(),

  // วันที่สร้าง
  createdAt: timestamp("created_at").defaultNow().notNull(),
});