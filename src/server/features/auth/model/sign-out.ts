import type { Request, Response } from "express";
import { UserToken } from "~/entities/user/index.js";

export const signOut = async (req: Request, res: Response) => {
  const refreshToken = req.cookies?.refreshToken;
  const deviceId = req.cookies?.deviceId;

  try {
    if (refreshToken && deviceId) {
      const result = await UserToken.deleteOne({
        deviceId: deviceId,
        refreshToken: refreshToken,
      });

      if (result.modifiedCount > 0) {
        console.log(
          `SignOut: Token for deviceId '${deviceId}' successfully removed from database.`,
        );
      } else if (result.matchedCount > 0 && result.modifiedCount === 0) {
        console.warn(
          `SignOut: Matched token for deviceId '${deviceId}' but no modification made. It might have been removed concurrently.`,
        );
      } else {
        console.log(
          `SignOut: No active session found in DB matching deviceId '${deviceId}' and the provided refresh token. Cookies will be cleared.`,
        );
      }
    } else {
      const missingInfo = [];
      if (!refreshToken) missingInfo.push("refresh token");
      if (!deviceId) missingInfo.push("deviceId");
      console.log(
        `SignOut: Missing cookie(s): ${missingInfo.join(", ")}. Clearing any remaining auth cookies.`,
      );
    }

    res.clearCookie("refreshToken", { httpOnly: true, secure: true, sameSite: "strict" });
    res.clearCookie("deviceId", { httpOnly: true, secure: true, sameSite: "strict" });

    return res.status(200).json({ message: "Successfully sign out" });
  } catch (e) {
    console.error("Error during sign out:", e);

    res.clearCookie("refreshToken", { httpOnly: true, secure: true, sameSite: "strict" });
    res.clearCookie("deviceId", { httpOnly: true, secure: true, sameSite: "strict" });

    return res.status(500).json({
      message: "Sign out process encountered a server error. Client-side session data cleared.",
    });
  }
};
