import express from "express";
import cors from "cors";
import uploadRoutes from "./routes/upload.route.js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Static folder for temp files (optional)
const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.use("/temp", express.static(path.join(__dirname, "../public/temp")));

app.use("/api", uploadRoutes);

const PORT = process.env.PORT || 8025;


















// import mongoose from "mongoose";
// import { DB_NAME} from "../constants.js";

// const connectDB = async () => {
//   try {
//     const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
//     console.log(`\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`);
//   } catch (error) {
//     console.log("MONGODB CONNECTION ERROR!", error);
//     process.exit(1);
//   }
// }

// export default connectDB;