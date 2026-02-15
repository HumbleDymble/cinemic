import jwt from "jsonwebtoken";
import type { NextFunction, Request, Response } from "express";
import { env } from "~/shared/config/index.js";

export const validateEmailFormat = async (req: Request, res: Response, next: NextFunction) => {
  const { email } = req.body;
  const re = /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/;
  if (email && re.test(String(email).toLowerCase())) {
    next();
  } else {
    return res.status(403).json({ error: "The email provided is not valid" });
  }
};

export const validatePasswordLength = async (req: Request, res: Response, next: NextFunction) => {
  const { password } = req.body;
  if (password && password.length > 7) {
    next();
  } else {
    return res.status(403).json({ error: "The password provided is not valid" });
  }
};

export const generateToken = (data: string | Buffer | object) => {
  const accessToken = jwt.sign(data, env.SECRET_ACCESS, {
    expiresIn: env.SECRET_ACCESS_MAX_AGE * 1000,
  });
  const refreshToken = jwt.sign(data, env.SECRET_REFRESH, {
    expiresIn: env.SECRET_REFRESH_MAX_AGE * 1000,
  });
  return { accessToken, refreshToken };
};
