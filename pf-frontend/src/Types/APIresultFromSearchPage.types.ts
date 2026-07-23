// 1. พิมพ์เขียวสำหรับข้อมูล 1 โพสต์ (อ้างอิงจาก pgTable "Posts")
export interface Post {
  topic_id: string;      // uuid
  post_id: string;       // uuid primaryKey
  title: string;         // varchar(20)
  descriptions: string;  // varchar(150)
  author_id: string;     // uuid
  edit_at: string | Date; // timestamp (ถ้าส่งมาจาก API มักจะมาเป็น string ISO string หรือ Date)
}

// 2. พิมพ์เขียวหลักสำหรับข้อมูล Topic ที่มี Array ของ Posts อยู่ข้างใน
export interface DataFromTopic {
  topic_id: string;
  topic_name: string;
  post: Post[]; // 🌟 กำหนดให้เป็น Array ของ Interface Post ด้านบน
}