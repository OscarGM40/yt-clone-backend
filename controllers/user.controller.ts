import { NextFunction, Request, Response } from "express";
import { createError } from "../errors/error";
import { User } from "../models/User";
import { Video } from "../models/Video";

declare global {
  namespace Express {
    export interface Request {
      user?: {
        id: string;
      };
    }
  }
}

export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  if (req.params.id === req.user?.id) {
    try {
      // acuerdate de $set para el update,asinto
      const updatedUser = await User.findByIdAndUpdate(
        { _id: req.user.id },
        { $set: req.body },
        {
          new: true,
        },
      );
      return res.status(200).json(updatedUser);
    } catch (error) {
      next(error);
    }
  } else {
    return next(createError(403, "You can update only your account"));
  }
};

export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  if (req.params.id === req?.user?.id) {
    try {
      await User.findByIdAndDelete({ _id: req.params.id });
      return res.status(200).json("User has been deleted");
    } catch (error) {
      next(error);
    }
  } else {
    return next(createError(403, "You can delete only your account"));
  }
};

export const getOneUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById({ _id: req.params.id });
    return res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};
export const subscribe = async (req: Request, res: Response, next: NextFunction) => {
  // vendrá por params el id del canal a subscribirse(mi id esta en el payload)
  if (req.params.id !== req?.user?.id) {
    try {
      // puseamos el id a mis subscripciones
      await User.findByIdAndUpdate(
        { _id: req.user?.id },
        {
          $push: { subscribedUsers: req.params.id },
        },
      );
      // fijate en el $inc para incrementar(y que necesita el incremento)
      await User.findByIdAndUpdate(
        { _id: req.params.id },
        {
          $inc: { subscribers: 1 },
        },
      );

      return res.status(200).json("Subscription successful");
    } catch (error) {
      next(error);
    }
  } else {
    return next(createError(403, "You cannot subscribe to your own channel"));
  }
};
export const unsubscribe = async (req: Request, res: Response, next: NextFunction) => {
  // vendrá por params el id del canal a subscribirse(mi id esta en el payload)
  try {
    // pulleamos el id de mis subscripciones
    await User.findByIdAndUpdate(
      { _id: req.user?.id },
      {
        $pull: { subscribedUsers: req.params.id },
      },
    );
    // decrementamos con $inc y un incremento negativo
    await User.findByIdAndUpdate(
      { _id: req.params.id },
      {
        $inc: { subscribers: -1 },
      },
    );

    return res.status(200).json("Unsubscription successful");
  } catch (error) {
    next(error);
  }
};
export const like = async (req: Request, res: Response, next: NextFunction) => {
  const id = req.user?.id;
  const videoId = req.params.videoId;
  try {
    // MONGODB en su máximo esplendor === $addToSet
    // meto a los likes del VideoSchema mi id y lo retiro de los dislikes
    await Video.findByIdAndUpdate(
      { _id: videoId },
      {
        $addToSet: { likes: id },
        $pull: { dislikes: id },
      },
    );
    return res.status(200).json("The video has been liked.");
  } catch (error) {
    next(error);
  }
};
export const dislike = async (req: Request, res: Response, next: NextFunction) => {
  const id = req.user?.id;
  const videoId = req.params.videoId;

  try {
    await Video.findByIdAndUpdate(
      { _id: videoId },
      {
        $addToSet: { dislikes: id },
        $pull: { likes: id },
      },
    );
    return res.status(200).json("The video has been disliked.");
  } catch (error) {
    next(error);
  }
};
