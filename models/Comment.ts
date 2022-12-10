import mongoose, { Document, Model } from "mongoose";

export interface CommentAttrs {
  userId: string;
  videoId: string;
  desc: string;
}
interface CommentDoc extends Document {
  userId: string;
  videoId: string;
  desc: string;
}
interface CommentModel extends Model<CommentDoc> {
  build(attrs: CommentAttrs): CommentDoc;
}

const CommentSchema = new mongoose.Schema(
  {
    // algunos [String] son mongoIds de la colección User
    userId: { type: String, required: true },
    videoId: { type: String, required: true },
    desc: { type: String, required: true },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);
CommentSchema.statics.build = (attrs: CommentAttrs) => {
  return new Comment(attrs);
};
const Comment = mongoose.model<CommentDoc, CommentModel>("Comment", CommentSchema);

export { Comment };
