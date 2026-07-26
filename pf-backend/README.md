# ระบบ Backend

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
