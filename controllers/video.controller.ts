import { NextFunction, Request, Response } from "express";
import { createError } from "../errors/error";
import { User } from "../models/User";
import { Video } from "../models/Video";

/* declare global {
  namespace Express {
    export interface Request {
      user?: {
        id: string;
      };
    }
  }
} */

export const addVideo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const newVideo = new Video({
      userId: req.user?.id,
      ...req.body,
    });
    const savedVideo = await newVideo.save();
    return res.status(201).json(savedVideo);
  } catch (error) {
    next(error);
  }
};
// de nuevo un user solo puede operar sobre sus videos
export const updateVideo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) {
      return next(createError(404, "Video not found"));
    }
    // si es mi video
    if (req.user?.id === video.userId) {
      const updatedVideo = await Video.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true },
      );
      return res.status(200).json(updatedVideo);
    } else {
      return next(createError(403, "You cannot update others' videos"));
    }
  } catch (error) {
    next(error);
  }
};

export const deleteVideo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) {
      return next(createError(404, "Video not found"));
    }
    // si es mi video
    if (req.user?.id === video.userId) {
      await Video.findByIdAndDelete(req.params.id);
      return res.status(200).json("The video has been deleted");
    } else {
      return next(createError(403, "You cannot delete others' videos"));
    }
  } catch (error) {
    next(error);
  }
};

export const getVideo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const video = await Video.findById(req.params.id);
    return res.status(200).json(video);
  } catch (error) {
    next(error);
  }
};

export const updateViewCounter = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await Video.findByIdAndUpdate(req.params.id, {
      $inc: { views: 1 },
    });
    return res.status(200).json("The view counter has been updated.");
  } catch (error) {
    next(error);
  }
};

export const getRandomVideo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // trae una muestra random de 40 videos
    const rndVideos = await Video.aggregate([{ $sample: { size: 40 } }]);
    return res.status(200).json(rndVideos);
  } catch (error) {
    next(error);
  }
};

export const getTrending = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // los videos con más vistas(-1 es desc)
    const trendingVideos = await Video.find().sort({ views: -1 });
    return res.status(200).json(trendingVideos);
  } catch (error) {
    next(error);
  }
};

export const getSubscribedVideos = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById({ _id: req.user?.id });
    const subscribedChannels = user?.subscribedUsers || [];
    // console.log(subscribedChannels)
    
    const list = await Promise.all(
      subscribedChannels.map((channelId) => {
        return Video.find({ userId: channelId });
      }),
    );
    return res.status(200).json(list.flat().sort((a, b) => b._id - a._id));
    // return res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

//  domain/api/videos/get/tags?tags=js,py,java
export const getByTag = async (req: Request, res: Response, next: NextFunction) => {
  // split separa un string por un delimitador y retorna un arreglo
  const tags = (req.query.tags as string).split(",");

  try {
    const videos = await Video.find({ tags: { $in: tags } }).limit(20);
    return res.status(200).json(videos);
  } catch (error) {
    next(error);
  }
};


export const getByQuery = async (req: Request, res: Response, next: NextFunction) => {
  const query = req.query.q as string;
  try {
    // con $regexp + $option:"i" hago busqueda insensitiva
    const videoByTitle = await Video.find({ title: new RegExp(query, "i") });
    return res.status(200).json(videoByTitle);
  } catch (error) {
    next(error);
  }
};
