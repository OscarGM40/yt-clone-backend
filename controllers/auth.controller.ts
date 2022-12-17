import bcrypt from "bcryptjs";
import { NextFunction, Request, Response } from "express";
import { createError } from "../errors/error";
import jwt from "jsonwebtoken";
import { User } from "../models/User";
import mongoose from "mongoose";

export const signup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const newUsr = new User({
      ...req.body,
      password: bcrypt.hashSync(req.body.password, 10),
    });
    newUsr._id = new mongoose.Types.ObjectId();
    await newUsr.save();
    return res.status(201).json("User has been created!");
  } catch (err) {
    next(err);
  }
};

export const signin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await User.findOne({ name: req.body.name });
    if (!user) return next(createError(404, "User not found"));
    // si hay un user igual(dado que el name es unico es él)
    const passwordsMatch = bcrypt.compareSync(req.body.password, user.password);
    if (!passwordsMatch) return next(createError(404, "Passwords don't match"));
    // generamos un jwt
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, { expiresIn: "1d" });
    // lo metemos en una cookie(requiere de la lib cookie-parser)
    return res
      .cookie("access_token", token, {
        httpOnly: true,
        expires: new Date(Date.now() + 9000000),
      })
      .status(200)
      .json(user);
  } catch (err) {
    next(err);
  }
};

export const googleAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    // si hay un user ya no hace falta registrarlo,solo generar un token
    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, { expiresIn: "1d" });
      return res
        .cookie("access_token", token, {
          httpOnly: true,
          expires: new Date(Date.now() + 9000000),
        })
        .status(200)
        .json(user);
    } else {
      // si no hay un user aún registramos el cliente
      const newUser = new User({
        ...req.body,
        fromGoogle: true,
      });
      const savedUser = await newUser.save();
      const token = jwt.sign({ id: savedUser._id }, process.env.JWT_SECRET!, { expiresIn: "1d" });
      return res
        .cookie("access_token", token, {
          httpOnly: true,
          expires: new Date(Date.now() + 9000000),
        })
        .status(200)
        .json(savedUser);
    }
  } catch (error) {
    next(error);
  }
};
