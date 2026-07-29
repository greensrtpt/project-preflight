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
  username: varchar("username", { length: 100 })
    .notNull()
    .unique(),/////////////////////////////////

  // รหัสผ่าน
  password: varchar("password", { length: 300 }).notNull(),
});

/**
 * ตารางหัวข้อ
 */
export const Topics = pgTable("Topics", {
  // รหัสหัวข้อ
  topic_id: uuid("topic_id").primaryKey().defaultRandom(),
    
  // ชื่อหัวข้อ
  topic_name: varchar("name", { length: 100 })
  .notNull()
  .unique(),
});
/*
 * ตารางโพสต์
 */
export const Posts = pgTable("Posts", {
  // รหัสโพสต์
  post_id: uuid("post_id").primaryKey().defaultRandom(),
  // ถ้า Group ถูกลบ ให้ Post ที่อยู่ใน Group นั้นถูกลบตาม
  group_id: uuid("group_id")
    .references(() => Groups.group_id, { onDelete: "cascade" })
    .notNull(),

  // หัวข้อโพสต์
  title: varchar("title", { length: 30 }).notNull(),

  // เนื้อหาโพสต์
  descriptions: varchar("descriptions", { length: 500 }).notNull(),

  // รหัสผู้สร้างโพสต์
  // ถ้า User ลบบัญชี ให้ Post ของ User คนนั้นถูกลบตาม
  author_id: uuid("author_id")
    .references(() => Users.user_id, { onDelete: "cascade" })
    .notNull(),

  author_name: varchar("author_name", { length: 30 })
    .notNull(),
   ///////////////////////////////// .unique()

  // วันที่สร้าง
  edit_at: timestamp("edit_at").defaultNow().notNull(),
});

export const Groups = pgTable("Groups",{
  group_id: uuid("group_id").primaryKey().defaultRandom(),

  // topic ยังมาจาก seed แต่ group ให้ user สร้างเอง
  topic_id: uuid("topic_id")
    .references(() => Topics.topic_id, { onDelete: "cascade" })
    .notNull(),

  group_name: varchar("name", { length: 100 })
    .notNull(),

  // เอาไว้เช็คสิทธิ์ตอนแก้หรือลบ group
  owner_id: uuid("owner_id")
    .references(() => Users.user_id, { onDelete: "cascade" })
    .notNull(),

  owner_name: varchar("owner_name", { length: 30 }).notNull(),

  edit_at: timestamp("edit_at").defaultNow().notNull(),
})
