import { Router, Request, Response } from "express";
import { dbClient } from "@db/client.js";
import { Users } from "@db/schema.js";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";
import { authUsers } from "drizzle-orm/supabase";
import jwt from "jsonwebtoken";
import "dotenv/config";

const router = Router();
/**
 * POST /users
 * สร้างผู้ใช้ใหม่
 */
router.post("/", async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        message: "Please provide both username and password",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        message: "Password must be at least 8 characters long",
      });
    }

    const existingUser = await dbClient
      .select()
      .from(Users)
      .where(eq(Users.username, username))
      .limit(1);

    if (existingUser.length > 0) {
      return res.status(409).json({
        message:
          "Username already exists. Please choose a different username.",
      });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = await dbClient
      .insert(Users)
      .values({
        username,
        password: hashedPassword,
      })
      .returning({
        user_id: Users.user_id,
        username: Users.username,
      });

    res.status(201).json(newUser[0]);
  } catch (error) {
    console.error("Error creating user:", error);

    return res.status(500).json({
      message: "Something went wrong with Server",
    });
  }
});

/**
 * POST /users
 * login
 */
router.post("/login", async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
    return res.status(400).json({
     message: "Username and password are required",
    });
    }

    const existingUser = await dbClient
      .select()
      .from(Users)
      .where(eq(Users.username, username))
      .limit(1);

    if (existingUser.length === 0) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(password, existingUser[0].password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid password",
      });
    }

     if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is missing");
    }

    const token = jwt.sign(
    {
      user_id: existingUser[0].user_id,
      username: existingUser[0].username,
    },
    process.env.JWT_SECRET!,
    {
      expiresIn: "1h"
    }
  );

    res.status(200).json({
      message: "Login successful",
      token
    });
  } catch (error) {
    console.error("Error logging in:", error);
    return res.status(500).json({
      message: "Something went wrong with Server",
    });
  }
});

/**
 * GET ALL USERS
 */
router.get("/", async (_req: Request, res: Response) => {
  try{
    const users = await dbClient.select({
        user_id: Users.user_id,
        username: Users.username,
      }); // ดึงข้อมูลจาก Database

    return res.status(200).json({
      get_users_success: true,
      message: "Get users successfully",
      data: users,
    });
  }
  catch (error) {
    console.error("Error logging in:", error);
    return res.status(500).json({
      message: "Something went wrong with Server",
    });
  }
});


/**
 * GET /users/:user_id
 */
router.get("/:user_id", async (req, res) => {
  try {
    const { user_id } = req.params;

    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

    if (!uuidRegex.test(user_id)) {
      return res.status(400).json({
        message: "Invalid user_id format. It should be a valid UUID.",
      });
    }

    const users = await dbClient
      .select({
        user_id: Users.user_id,
        username: Users.username,
      })
      .from(Users)
      .where(eq(Users.user_id, user_id));

    const user = users[0];

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      get_user_success : true,
      message: "Get user successfully",
      data: user,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Something went wrong with Server",
    });
  }
});

/**
 * DELETE /users/:user_id
 */
router.delete("/:user_id", async (req, res) => {
  try {
    const { user_id } = req.params;
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

    if (!uuidRegex.test(user_id)) {
      return res.status(400).json({
        message: "Invalid user_id format. It should be a valid UUID.",
      });

    }

    const deletedUsers = await dbClient
      .delete(Users)
      .where(eq(Users.user_id, user_id))
      .returning({
        user_id: Users.user_id,
      });

    if (deletedUsers.length === 0) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      message: "Delete data success",
      user_id,
      delete_user_success: true,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Cannot delete user",
    });
  }
});

export default router;