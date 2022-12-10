import express from "express";
import {
  deleteUser,
  dislike,
  getOneUser,
  like,
  subscribe,
  unsubscribe,
  updateUser,
} from "../controllers/user.controller";
import { verifyToken } from "../utils/verifyToken";

const router = express.Router();

// update user
router.put("/:id", verifyToken, updateUser);

// delete user
router.delete("/:id", verifyToken, deleteUser);

// get user
router.get("/find/:id", getOneUser);

// subscribe a user(id of the channel)
router.put("/sub/:id", verifyToken, subscribe);

// unsubscribe a user
router.put("/unsub/:id", verifyToken, unsubscribe);

// like a video
router.put("/like/:videoId", verifyToken, like);

// dislike a video
router.put("/dislike/:videoId", verifyToken, dislike);

export default router;
