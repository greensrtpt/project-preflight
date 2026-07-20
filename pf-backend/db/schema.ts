import {
  pgTable,
  timestamp,
  uuid,
  varchar,
  text, //ข้อความ
} from "drizzle-orm/pg-core";

/**
 * ผู้ใช้งานระบบ
 * ใช้ username สำหรับสมัครและเข้าสู่ระบบ
 */
export const usersTable = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),

  username: varchar("username", { length: 50 })
    .notNull()
    .unique(),

  // ชื่อ field ใช้ passwordHash เพื่อเตรียมรองรับการ hash รหัสผ่าน
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),

  createdAt: timestamp("created_at", {
    mode: "date",
    precision: 3,
  })
    .defaultNow()
    .notNull(),
});

/**
 * หัวข้อที่ Backend เตรียมไว้
 * ผู้ใช้ทั่วไปไม่สามารถสร้าง Topic เองได้
 */
export const topicsTable = pgTable("topics", {
  id: uuid("id").primaryKey().defaultRandom(),

  name: varchar("name", { length: 100 })
    .notNull()
    .unique(),

  description: text("description"),

  createdAt: timestamp("created_at", {
    mode: "date",
    precision: 3,
  })
    .defaultNow()
    .notNull(),
});

/**
 * โพสต์ภายในแต่ละ Topic
 */
export const postsTable = pgTable("posts", {
  id: uuid("id").primaryKey().defaultRandom(),

  title: varchar("title", { length: 200 }).notNull(),

  content: text("content").notNull(),

  authorId: uuid("author_id")
    .notNull()
    .references(() => usersTable.id, {
      onDelete: "cascade",
    }),

  topicId: uuid("topic_id")
    .notNull()
    .references(() => topicsTable.id, {
      onDelete: "cascade",
    }),

  createdAt: timestamp("created_at", {
    mode: "date",
    precision: 3,
  })
    .defaultNow()
    .notNull(),

  updatedAt: timestamp("updated_at", {
    mode: "date",
    precision: 3,
  })
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});