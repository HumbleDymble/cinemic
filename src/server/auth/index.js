import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { uid } from "uid/secure";
import { tokenModel } from "../models/token.js";
import { usersModel } from "../models/users.js";
import { generateTokens } from "./lib.js";

export const signUp = async (req, res) => {
  try {
    const { email, username, password } = req.body;
    const foundUser = await usersModel.findOne({ email });
    if (foundUser) {
      return new Error("This email already exists");
    }
    const hashPassword = await bcrypt.hash(password, 5);
    const user = await usersModel.create({
      email,
      username,
      password: hashPassword,
    });
    await tokenModel.create({
      user: user._id,
      refreshToken: [],
    });
    res.json("Register successfully");
  } catch (e) {
    console.log(e);
  }
};

export const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    const newuid = uid();
    const foundUser = await usersModel.findOne({ email });

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Username and password are required." });
    }

    if (foundUser) {
      const comparePassword = await bcrypt.compare(
        password,
        foundUser.password,
      );

      const user = new usersModel(
        {
          _id: foundUser.id,
          role: foundUser.role,
          username: foundUser.username,
        },
        {
          _id: foundUser.id,
          role: foundUser.role,
          username: foundUser.username,
        },
      );

      const { accessToken, refreshToken } = generateTokens({
        user,
      });

      if (!comparePassword) {
        return res.status(400).json({ message: "Invalid password" });
      }

      res.cookie("accessToken", accessToken, {
        maxAge: process.env.SECRET_ACCESS_MAX_AGE * 1000, // 7 days
      });

      res.cookie("refreshToken", refreshToken, {
        maxAge: process.env.SECRET_REFRESH_MAX_AGE * 1000, // 30 days
        httpOnly: true,
        secure: true,
      });

      res.cookie("uid", newuid, {
        maxAge: process.env.SECRET_REFRESH_MAX_AGE * 1000, // 30 days
        httpOnly: true,
        secure: true,
      });

      // #Need to check if the user has more than 10 devices
      // const device = await tokenModel.find({
      //   user: foundUser._id,
      //   $expr: {
      //     $gt: [{ $size: "$token" }, 10]
      //   }
      // });

      await tokenModel.insertOne({
        user: foundUser._id,
        token: {
          refreshToken: refreshToken,
          uid: newuid,
        },
      });

      // else {
      //   await tokenModel.findOneAndUpdate(
      //     {
      //       user: foundUser._id,
      //     },
      //     {
      //       $push: {
      //         token: {
      //           refreshToken: refreshToken,
      //           uid: newuid,
      //         },
      //       },
      //     },
      //   );
      // }

      res.json({ user, accessToken });
    } else {
      return res.status(404).json({ message: "User not found" });
    }
  } catch (e) {
    console.log(e);
  }
};

export const handleAuthorization = async (req, res) => {
  try {
    const jwtAccess = req.cookies?.accessToken;
    const jwtRefresh = req.cookies?.refreshToken;

    const bearer = req.headers.authorization?.split(" ")[1] || jwtAccess;

    const verifiedData =
      jwt.verify(jwtRefresh, process.env.SECRET_REFRESH) ||
      jwt.verify(bearer, process.env.SECRET_ACCESS);
    const foundUser = await usersModel.findOne({
      _id: verifiedData.user,
    });
    const user = new usersModel(
      {
        _id: foundUser.id,
        role: foundUser.role,
        username: foundUser.username,
      },
      {
        _id: foundUser.id,
        role: foundUser.role,
        username: foundUser.username,
      },
    );

    const { accessToken, refreshToken } = generateTokens({ user });

    if (bearer) {
      jwt.verify(bearer, process.env.SECRET_ACCESS);
    }
    if (jwtRefresh) {
      jwt.verify(jwtRefresh, process.env.SECRET_REFRESH);
    }
    res.cookie("accessToken", accessToken, {
      maxAge: process.env.SECRET_ACCESS_MAX_AGE * 1000, // 7 days
    });
    res.cookie("refreshToken", refreshToken, {
      maxAge: process.env.SECRET_REFRESH_MAX_AGE * 1000, // 30 days
      httpOnly: true,
      secure: true,
    });
    res.json({ user, accessToken });
  } catch (e) {
    console.log(e);
  }
};

export const signOut = async (req, res) => {
  try {
    const jwtAccess = req.cookies?.accessToken;
    const jwtRefresh = req.cookies?.refreshToken;

    if (jwtAccess) {
      jwt.verify(jwtAccess, process.env.SECRET_ACCESS);
    }
    if (jwtRefresh) {
      jwt.verify(jwtRefresh, process.env.SECRET_REFRESH);
    } else {
      return res.status(401).json({ error: "Unauthorized" });
    }
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.clearCookie("uid");

    res.status(200).json("success");
  } catch (e) {
    console.log(e);
  }
};

export const getCookies = async (req, res) => {
  const cookies = req.cookies;
  res.json({ cookies });
};

export const changePassword = async (req, res) => {
  const jwtRefresh = req.cookies?.refreshToken;

  if (!jwtRefresh) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  jwt.verify(jwtRefresh, process.env.SECRET_REFRESH);

  const { oldPassword, newPassword, repeatPassword } = req.body;

  const token = await tokenModel.findOne({
    "token.refreshToken": jwtRefresh,
  });

  const foundUser = await usersModel.findOne({ _id: token.user });

  if (foundUser) {
    const comparePassword = await bcrypt.compare(
      oldPassword,
      foundUser.password,
    );
    if (!comparePassword) {
      return res.status(400).json({ message: "Invalid password" });
    }
    if (newPassword !== repeatPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }
    if (oldPassword === newPassword) {
      return res
        .status(400)
        .json({ message: "Your old password can't be your new one" });
    }
  }

  const hashPassword = await bcrypt.hash(newPassword, 5);
  await usersModel.findOneAndUpdate(
    { _id: foundUser },
    { $set: { password: hashPassword } },
  );

  res.json({ message: "Success" });
};

export const watchlist = async (req, res) => {
  try {
    const { watchlist } = req.body;  
    console.log(watchlist);
  } catch (e) {
    console.log(e);
  }
};
