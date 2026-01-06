import express from "express";
import {
  deleteAllNotifications,
  deleteNotification,
  getAllNotifications,
  getUnreadNotifications,
  readAllNotifications,
} from "@/server/features/user-notification/index.js";
import {
  isAuth,
  reAuth,
  signIn,
  signOut,
  signUp,
  validateEmailFormat,
  validatePasswordLength,
} from "@/server/features/auth/index.js";
import { changePassword } from "@/server/features/change-password/index.js";
import { changeUsername } from "@/server/features/user-settings/index.js";
import {
  acceptFriendRequest,
  cancelFriendRequest,
  declineFriendRequest,
  friendList,
  removeFriend,
  sendFriendRequest,
} from "@/server/features/friend-list/index.js";
import {
  publicProfile,
  setProfilePrivacy,
  userProfile,
} from "@/server/features/user-profile/index.js";
import {
  addToWatchlist,
  deleteFromWatchlist,
  getWatchlist,
} from "@/server/features/watchlist/index.js";
import { addRating, getRating, removeRating } from "@/server/features/rating/index.js";
import { addReview, getReviews, rateReview, updateReview } from "@/server/features/review/index.js";
import {
  isModerator,
  moderatorDeleteReview,
  moderatorGetReviews,
  moderatorGetUsers,
  moderatorManageReview,
} from "@/server/features/moderator-panel/index.js";
import {
  adminGetUsers,
  adminManageReview,
  adminManageUserBan,
  adminSendNotification,
  adminUpdateUserRole,
  isAdmin,
} from "@/server/features/admin-panel/index.js";
import {
  imdbGetSearch,
  imdbGetTitle,
  v14GetImagesTitle,
  v14GetRandomTitle,
  v14GetReview,
  v14GetSearch,
  v14GetTitle,
  v15GetListCollections,
} from "@/server/shared/api/index.js";

export const router = express.Router();

// NOTIFICATIONS
router.get("/notifications", isAuth, getAllNotifications);
router.get("/notifications/unread", isAuth, getUnreadNotifications);
router.patch("/notifications/read", isAuth, readAllNotifications);
router.delete("/notifications/:id", isAuth, deleteNotification);
router.patch("/notifications", isAuth, deleteAllNotifications);

// AUTH
router.post("/auth/signup", validateEmailFormat, validatePasswordLength, signUp);
router.post("/auth/signin", signIn);
router.delete("/auth/signout", signOut);
router.get("/auth/session", isAuth, reAuth);
router.patch("/auth/password", isAuth, changePassword);
router.put("/auth/username", isAuth, changeUsername);

// FRIENDS LIST
router.get("/user/friends", isAuth, friendList);
router.post("/user/friends/request/:userId", isAuth, sendFriendRequest);
router.post("/user/friends/accept/:userId", isAuth, acceptFriendRequest);
router.post("/user/friends/decline/:userId", isAuth, declineFriendRequest);
router.post("/user/friends/cancel/:userId", isAuth, cancelFriendRequest);
router.post("/user/friends/remove/:userId", isAuth, removeFriend);

// USER PROFILE
router.get("/user/profile", isAuth, userProfile);
router.get("/user/profile/:userId", isAuth, publicProfile);
router.put("/user/profile/privacy", isAuth, setProfilePrivacy);

// USER WATCHLIST
router.get("/user/watchlist", isAuth, getWatchlist);
router.put("/user/watchlist/:titleId", isAuth, addToWatchlist);
router.delete("/user/watchlist/:titleId", isAuth, deleteFromWatchlist);

// USER RATINGS
router.get("/user/ratings/:titleId", isAuth, getRating);
router.put("/user/ratings/:titleId", isAuth, addRating);
router.delete("/user/ratings/:titleId", isAuth, removeRating);

// REVIEW THREAD
router.get("/:titleId/review-thread", isAuth, getReviews);
router.post("/review-thread", isAuth, addReview);
router.patch("/review-thread/:reviewId", isAuth, updateReview);
router.post("/review-thread/:reviewId/vote", isAuth, rateReview);

// MODERATOR
router.get("/moderator/users", isAuth, isModerator, moderatorGetUsers);
router.get("/moderator/reviews", isAuth, isModerator, moderatorGetReviews);
router.patch("/moderator/reviews/:reviewId/action", isAuth, isModerator, moderatorManageReview);
router.delete("/moderator/reviews/:reviewId", isAuth, isModerator, moderatorDeleteReview);

// ADMIN
router.post("/admin/notifications/send", isAuth, isAdmin, adminSendNotification);
router.get("/admin/users", isAuth, isAdmin, adminGetUsers);
router.get("/admin/reviews", isAuth, isAdmin, moderatorGetReviews);
router.patch("/admin/users/:userId/role", isAuth, isAdmin, adminUpdateUserRole);
router.patch("/admin/users/:userId/ban", isAuth, isAdmin, adminManageUserBan);
router.patch("/admin/reviews/:reviewId", isAuth, isAdmin, adminManageReview);

// API
router.get("/api/search", imdbGetSearch);
router.get("/api/title/:id", imdbGetTitle);
router.get("/api/search-v14", v14GetSearch);
router.get("/api/title-v14/:id", v14GetTitle);
router.get("/api/title-v14/random", v14GetRandomTitle);
router.get("/api/images-v14", v14GetImagesTitle);
router.get("/api/review-v14", v14GetReview);
router.get("/api/collections-v15/:slug", v15GetListCollections);
