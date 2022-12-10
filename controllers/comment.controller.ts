import { NextFunction, Request, Response } from "express";
import { createError } from "../errors/error";
import { Comment } from "../models/Comment";
import { Video } from "../models/Video";

export const addComment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const newComment = new Comment({ ...req.body, userId: req.user?.id });
    const savedComment = await newComment.save();
    return res.status(200).json(savedComment);
  } catch (error) {
    next(error);
  }
};

export const deleteComment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const comment = await Comment.findById({ _id: req.params.id });
    const video = await Video.findById({ _id: req.params.id });
    // si es mi comentario o mi video lo puedo borrar
    if (req.user?.id === comment?.userId || req.user?.id === video?.userId) {
      await Comment.findByIdAndDelete({ _id: req.params.id });
      return res.status(200).json("The comment was deleted");
    } else {
      return next(createError(403, "You cannot delete others' comments"));
    }
  } catch (error) {
    next(error);
  }
};

// get all comments of a video
export const getComments = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const comments = await Comment.find({ videoId: req.params.videoId }).lean();
    return res.status(200).json(comments);
  } catch (error) {
    next(error);
  }
};
