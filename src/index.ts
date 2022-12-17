import dotenv from "dotenv";
dotenv.config();
import express from "express";
import authRoutes from "../routes/auth";
import userRoutes from "../routes/users";
import videoRoutes from "../routes/videos";
import commentRoutes from "../routes/comments";
import cookieParser from "cookie-parser";
import cors from 'cors'

// iniciamos app y la conexión
const app = express();
import "../database/connection";
// middlewares generales
app.use(
  cors({
    // terriblemente importante setear el origin y las credentials
    // origin: "http://localhost:5173", 
    origin: "https://yt-clone-mern.netlify.app", // a true acepta todo
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/videos", videoRoutes);
app.use("/api/comments", commentRoutes);

// es necesario este middleware teniendo la utilidad ??
app.use((err: any, req: any, res: any, next: any) => {
  const status = err.status || 500;
  const message = err.message || "Something went wrong";
  return res.status(status).json({
    success: false,
    status,
    message,
  });
});


app.listen(process.env.API_PORT || 8800, () => {
  console.clear();
  console.log(`app running on ${process.env.API_PORT} port`);
});
