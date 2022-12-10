import mongoose, { Document, Model } from "mongoose";

// Interfaz que designa las propiedade requeridas para crear un nuevo User.Es una simple interfaz para el tipado
export interface UserAttrs {
  name: string;
  email: string;
  password: string;
  img?: string;
  subscribers: number;
  subscribedUsers?: string[];
  fromGoogle?: boolean;
}
// Interfaz que describe las propiedades que tendrá un User una vez en la BBDD.Hereda de Document
interface UserDoc extends Document {
  name: string;
  email: string;
  password: string;
  img?: string;
  subscribers: number;
  subscribedUsers?: string[];
  fromGoogle?: boolean;
}
// Interfaz para el Model/Coleccion.Extiende de Model<T extends Document> donde T será la interface de arriba que heredó de Document(build hay que desarrollarlo)
interface UserModel extends Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}
const UserSchema = new mongoose.Schema<UserDoc>(
  {
    name: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    img: { type: String },
    subscribers: { type: Number, default: 0 },
    subscribedUsers: { type: [String] },
    fromGoogle: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    versionKey: false,
    // recuerda que no impacta en la DB,es sólo como se leerá el Doc
    toJSON: {
      transform(doc, ret) {
        ret.password = doc.password;
        delete ret.password;
      },
    },
  },
);
// ojo con usar arrow funcions y perder el contexto
// vamos a crear el método build para tener autocompletado
UserSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};

const User = mongoose.model<UserDoc, UserModel>("User", UserSchema);

export { User };
