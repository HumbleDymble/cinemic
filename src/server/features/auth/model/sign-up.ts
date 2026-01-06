import bcrypt from "bcrypt";
import { Request, Response } from "express";
import { FriendList, User } from "@/server/entities/user/index.js";

export const signUp = async (req: Request, res: Response) => {
  try {
    const { email, username, password } = req.body;

    if (!email || !username || !password) {
      return res.status(400).json({ message: "Email, username, and password are required." });
    }

    const foundUserByEmail = await User.findOne({ email }).lean();

    if (foundUserByEmail) {
      return res.status(409).json({ message: "User with this email already exists." });
    }

    const hashPassword = await bcrypt.hash(password, 7);

    const newUser = await User.create({
      email,
      username,
      password: hashPassword,
    });

    const userResponse = {
      _id: newUser._id,
      email: newUser.email,
      username: newUser.username,
    };

    await FriendList.create({
      friends: [],
      sentFriendRequests: [],
      receiveFriendRequests: [],
      privacy: "public",
    });

    return res.status(201).json({
      message: "User registered successfully.",
      user: userResponse,
    });
  } catch (e) {
    console.error("Error during sign up:", e);
    return res.status(500).json({
      message: "An error occurred during registration. Please try again.",
    });
  }
};
