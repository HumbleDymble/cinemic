import { Request, Response } from "express";

export const reAuth = async (req: Request, res: Response) => {
  const user = req.user;
  const accessToken = res.locals.accessToken;

  return res.status(200).json({
    user,
    accessToken,
  });
};
