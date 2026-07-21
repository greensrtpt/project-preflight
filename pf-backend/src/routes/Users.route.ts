import { Router, Request, Response } from "express";
import { dbClient } from "@db/client.js";
import { Users } from "@db/schema.js";
import { Topics } from "@db/schema.js";
import { eq } from "drizzle-orm"; // ใช้สำหรับระบุเงื่อนไขเช่น id = ?
import bcrypt from "bcrypt";

const router = Router();

// [POST] สร้าง user ใหม่ (url: http://localhost:3001/users)
router.post("/", async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ 
        message: "Please provide both username and password" 
      });
    }

    if (password.length < 8) {
      return res.status(400).json({ 
        message: "Password must be at least 8 characters long" 
      });
    }

    const existingUser = await dbClient
      .select()
      .from(Users)
      .where(eq(Users.username, username))
      .limit(1);

    if (existingUser.length > 0) {
      // ถ้า Array ไม่ว่างเปล่า แปลว่าเจอคนใช้ชื่อนี้แล้ว
      return res.status(409).json({ 
        message: "Username already exists. Please choose a different username." 
      });
    }
    // 1. นำรหัสผ่านที่ผู้ใช้พิมพ์มาเข้ากระบวนการแฮช
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // 2. สั่งบันทึกลง Database ผ่าน Drizzle ORM
    const newUser = await dbClient.insert(Users).values({
      username: username,
      // ระวังอย่าเผลอเอาตัวแปร password มาใส่นะครับ! 
      // ต้องใช้ hashedPassword เท่านั้น
      password: hashedPassword, 
    }).returning();
    res.status(201).json(newUser);
  } catch (error) {
    console.error("🔥 Error creating user:", error);
    res.status(500).json({ message: "Something went wrong with Server" });
  }
});

export default router;  