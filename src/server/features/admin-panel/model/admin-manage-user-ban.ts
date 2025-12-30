import { Request, Response } from "express";
import { User } from "~/entities/user/index.js";

export const adminManageUserBan = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { banUntil } = req.body;

    const update = banUntil
      ? { $set: { banUntil: new Date(banUntil) } }
      : { $unset: { banUntil: "" } };

    const user = await User.findByIdAndUpdate(userId, update, { new: true });
    if (!user) return res.status(404).json({ message: "User not found." });

    return res.status(200).json(user);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Server error" });
  }
};
