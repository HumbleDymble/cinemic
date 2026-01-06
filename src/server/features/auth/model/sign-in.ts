import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { v4 } from "uuid";
import { generateToken } from "./lib.js";
import { User, UserToken } from "@/server/entities/user/index.js";
import { env } from "@/server/shared/config/index.js";

export const signIn = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const foundUser = await User.findOne({ email });

    if (!foundUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const comparePassword = await bcrypt.compare(password, foundUser.password);

    if (!comparePassword) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const isBanned = foundUser.banUntil && new Date(foundUser.banUntil) > new Date();

    const user = {
      _id: foundUser._id,
      role: foundUser.role,
      username: foundUser.username,
      banUntil: foundUser.banUntil,
      isBanned,
    };

    const { accessToken, refreshToken } = generateToken({ user });
    const deviceId = v4();
    const MAX_DEVICES = 10;

    const userTokens = await UserToken.find({ userId: foundUser._id }).sort({ createdAt: 1 });

    if (userTokens.length >= MAX_DEVICES) {
      const oldestToken = userTokens[0];
      await UserToken.findByIdAndDelete(oldestToken?._id);
    }

    await UserToken.create({
      userId: foundUser._id,
      deviceId,
      refreshToken,
    });

    res.cookie("refreshToken", refreshToken, {
      maxAge: env.SECRET_REFRESH_MAX_AGE * 1000,
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });

    res.cookie("deviceId", deviceId, {
      maxAge: env.SECRET_REFRESH_MAX_AGE * 1000,
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });

    return res.status(200).json({ user, accessToken });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
