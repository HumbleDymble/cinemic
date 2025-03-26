import { Router } from "express";
import {
  changePassword,
  getCookies,
  handleAuthorization,
  signIn,
  signOut,
  signUp, watchlist
} from "../auth/index.js";
import {
  authMiddleware,
  validateEmailFormat,
  validatePasswordLength,
} from "../auth/lib.js";

export const router = new Router();

router.post("/signup", validateEmailFormat, validatePasswordLength, signUp);
router.post("/signin", signIn);
router.post("/logout", signOut);
router.get("/refresh", authMiddleware, handleAuthorization);
router.get("/cookies", getCookies);
router.put("/change-password", changePassword);
router.get("/watchlist", watchlist);
