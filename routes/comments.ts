import express from "express";
import { addComment, deleteComment, getComments } from "../controllers/comment.controller";
import { verifyToken } from "../utils/verifyToken";

const router = express.Router();

router.post("/", verifyToken, addComment);
router.delete("/:id", verifyToken, deleteComment);
router.get("/:videoId", verifyToken, getComments);

export default router;
