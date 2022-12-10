import mongoose, { Document, Model } from "mongoose";

// Interfaz que designa las propiedade requeridas para crear un nuevo User.Es una simple interfaz para el tipado
export interface VideoAttrs {
  userId: string;
  title: string;
  desc: string;
  imgUrl: string;
  videoUrl: string;
  views?: number;
  tags: string[];
  likes: string[];
  dislikes: string[];
}
interface VideoDoc extends Document {
  userId: string;
  title: string;
  desc: string;
  imgUrl: string;
  videoUrl: string;
  views?: number;
  tags: string[];
  likes: string[];
  dislikes: string[];
}
interface VideoModel extends Model<VideoDoc> {
  build(attrs: VideoAttrs): VideoDoc;
}

const VideoSchema = new mongoose.Schema<VideoDoc>(
  {
    userId: { type: String, required: true },
    title: { type: String, required: true },
    desc: { type: String, required: true },
    imgUrl: { type: String, required: true },
    videoUrl: { type: String, required: true },
    views: { type: Number, default: 0 },
    tags: { type: [String], default: [] },
    likes: { type: [String], default: [] },
    dislikes: { type: [String], default: [] },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

VideoSchema.statics.build = (attrs: VideoAttrs) => {
  return new Video(attrs);
};

const Video = mongoose.model<VideoDoc, VideoModel>("Video", VideoSchema);
export { Video };
