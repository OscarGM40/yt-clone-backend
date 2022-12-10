import express from "express";
import {
  addVideo,
  deleteVideo,
  getByQuery,
  getByTag,
  getRandomVideo,
  getSubscribedVideos,
  getTrending,
  getVideo,
  updateVideo,
  updateViewCounter,
} from "../controllers/video.controller";
import { verifyToken } from "../utils/verifyToken";

const router = express.Router();

// create a video
router.post("/", verifyToken, addVideo);

// update a video
router.put("/:id", verifyToken, updateVideo);

// delete a video
router.delete("/:id", verifyToken, deleteVideo);

// get a video
router.get("/find/:id", verifyToken, getVideo);

// update view-counter
router.put("/view/:id", verifyToken, updateViewCounter);

// get trending videos
router.get("/get/trending", getTrending);

// get random video (for home page)
router.get("/get/random", getRandomVideo);

// get videos from my subscribed channels
router.get("/get/subscriptions", verifyToken, getSubscribedVideos);

// get videos by tags
router.get("/get/tags", verifyToken, getByTag);

// get videos by query(title)
router.get("/search", verifyToken, getByQuery);

export default router;
