import { Router, Request, Response } from "express";
import { dbClient } from "@db/client.js";
import { Topics } from "@db/schema.js";
import { eq } from "drizzle-orm"; // ใช้สำหรับระบุเงื่อนไขเช่น id = ?

const router = Router();


export default router;