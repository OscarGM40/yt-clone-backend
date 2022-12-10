import dotenv from "dotenv";
dotenv.config()
import mongoose from "mongoose";

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI!, {
    });
  } catch (error) {
    console.error(error);
  }
})();

mongoose.connection.on("error", (err) => {
  console.log("Error en MongoDb de tipo:", err);
  process.exit();
});

mongoose.connection.on("connected", (data) => {
  console.log(`Conectado a la base de datos ${mongoose.connection.name}`);
});
