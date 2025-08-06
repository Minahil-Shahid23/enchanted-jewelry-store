import express from "express";
import dotenv from "dotenv";
import uploadRoutes from "./routes/upload.route.js";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./db/connectDB.js";
import cors from "cors";
import orderRoutes from "./routes/order.routes.js";
import productRoutes from "./routes/product.routes.js";
import contactRoutes from "./routes/contact.route.js";
import weeklyProductRoutes from "./routes/weeklyProduct.route.js";


dotenv.config();
connectDB(); // ✅ DB must connect before server starts

const app = express();
const PORT = process.env.PORT || 8000;

// Static Files
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/public", express.static(path.join(__dirname, "public")));

// Middleware
app.use(cors());
app.use(express.json());

// ✅ Routes
app.use("/api", uploadRoutes);
app.use("/api/products", productRoutes);
app.use("/api", orderRoutes);
app.use("/api/contact", contactRoutes); // ✅ This already handles /api/contact/all
app.use("/api/weekly-products", weeklyProductRoutes); // 👈 NEW


// Start Server
app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});
