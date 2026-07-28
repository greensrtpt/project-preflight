# Community Resource Hub Backend

## วิธีติดตั้งและรัน

```bash
cp .env.example .env
pnpm install
docker compose up -d postgres
pnpm run db:push
pnpm run seed
pnpm run dev
```

ก่อนรันให้ใส่ข้อมูลสำหรับเชื่อมต่อฐานข้อมูลและ `JWT_SECRET` ในไฟล์ `.env`
ให้ครบก่อน

คำสั่ง `pnpm run seed` จะเพิ่มเฉพาะข้อมูล Topics เท่านั้น ส่วน Groups และ Posts
ให้ผู้ใช้สร้างผ่าน API

การสร้าง แก้ไข และลบ Group ต้องเข้าสู่ระบบและส่ง JWT มาด้วย โดยผู้ที่สร้าง
Group เท่านั้นที่สามารถแก้ไขหรือลบ Group นั้นได้

ไฟล์สำหรับทดสอบ API ด้วย Bruno อยู่ในโฟลเดอร์ `BRUNO` ที่หน้าหลักของโปรเจกต์

## ขอบเขตข้อมูล

- Production seed สร้างเฉพาะ 3 Topics หลัก
- Users, Groups และ Posts สร้างผ่าน API
- หากต้องใช้ข้อมูลสาธิต ให้แยก demo seed ออกจาก production seed

## สิทธิ์การใช้งาน

Guest อ่าน Topics, Groups และ Posts ได้ รวมทั้งสมัครสมาชิกและเข้าสู่ระบบ แต่
สร้าง แก้ไข หรือลบ Groups และ Posts ไม่ได้

Member ทำสิ่งที่ Guest ทำได้ทั้งหมด และสามารถสร้าง Groups และ Posts ได้ โดย
แก้ไขหรือลบได้เฉพาะข้อมูลที่ตนเองเป็นเจ้าของ หากไม่ใช่เจ้าของ API จะคืน `403`

Topics เป็นข้อมูลคงที่จาก Developer seed ผู้ใช้เรียก `POST /topics` หรือ
`DELETE /topics/:topic_id` ไม่ได้ และ API จะคืน `403`

## API

| Method | Endpoint | สิทธิ์ |
| --- | --- | --- |
| GET | `/topics/all` | Public |
| GET | `/topics/:topic_id` | Public |
| POST | `/topics` | Forbidden (`403`) |
| DELETE | `/topics/:topic_id` | Forbidden (`403`) |
| GET | `/groups/:topic_id` | Public |
| GET | `/groups/:topic_id/:group_id` | Public |
| POST | `/groups/:topic_id` | Member |
| PUT | `/groups/:topic_id/:group_id` | Group owner |
| DELETE | `/groups/:topic_id/:group_id` | Group owner |
| POST | `/users` | Public |
| POST | `/users/login` | Public |
| GET | `/users` | Public |
| GET | `/users/:user_id` | Public |
| DELETE | `/users/:user_id` | Account owner |
| GET | `/posts/:group_id` | Public |
| GET | `/posts/:group_id/:post_id` | Public |
| POST | `/posts/:group_id` | Member |
| PUT | `/posts/:group_id/:post_id` | Post author |
| DELETE | `/posts/:group_id/:post_id` | Post author |

ทุก endpoint ที่ระบุ Member หรือ Owner ต้องส่ง header:

```http
Authorization: Bearer <token>
```

Group รับเฉพาะ `group_name` ความยาวไม่เกิน 30 ตัวอักษร ส่วน `owner_id` และ
`owner_name` มาจาก JWT เท่านั้น

Post รับข้อความเท่านั้น โดย `title` ยาวไม่เกิน 20 ตัวอักษร และ `descriptions`
ยาวไม่เกิน 150 ตัวอักษร ส่วน `author_id` และ `author_name` มาจาก JWT เท่านั้น
DELETE Post ไม่รับ request body

รหัสผ่านต้องมีความยาว 8–30 ตัวอักษร และจะถูก hash ด้วย bcrypt ก่อนบันทึก

## Database cascade

- ลบ User → ลบ Groups ของ User → ลบ Posts ใน Groups เหล่านั้น
- ลบ User → ลบ Posts ที่ User เป็นผู้เขียน
- ลบ Topic → ลบ Groups → ลบ Posts
- ลบ Group → ลบ Posts
