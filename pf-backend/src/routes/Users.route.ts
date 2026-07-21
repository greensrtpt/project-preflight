import { Router, Request, Response } from "express";
import { dbClient } from "@db/client.js";
import { Users } from "@db/schema.js";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";

const router = Router();

/**
 * POST /users
 * สร้างผู้ใช้ใหม่
 */
router.post("/", async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      res.status(400).json({
        message: "Please provide both username and password",
      });
      return;
    }

    if (password.length < 8) {
      res.status(400).json({
        message: "Password must be at least 8 characters long",
      });
      return;
    }

    const existingUser = await dbClient
      .select()
      .from(Users)
      .where(eq(Users.username, username))
      .limit(1);

    if (existingUser.length > 0) {
      res.status(409).json({
        message:
          "Username already exists. Please choose a different username.",
      });
      return;
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

    res.status(500).json({
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

    const users = await dbClient
      .select({
        user_id: Users.user_id,
        username: Users.username,
      })
      .from(Users)
      .where(eq(Users.user_id, user_id));

    const user = users[0];

    if (!user) {
      res.status(404).json({
        message: "User not found",
      });
      return;
    }

    res.status(200).json(user);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Cannot get user",
    });
  }
});

/**
 * DELETE /users/:user_id
 */
router.delete("/:user_id", async (req, res) => {
  try {
    const { user_id } = req.params;

    const deletedUsers = await dbClient
      .delete(Users)
      .where(eq(Users.user_id, user_id))
      .returning({
        user_id: Users.user_id,
      });

    if (deletedUsers.length === 0) {
      res.status(404).json({
        message: "User not found",
      });
      return;
    }

    res.status(200).json({
      user_id,
      delete_user_success: true,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Cannot delete user",
    });
  }
});

export default router;