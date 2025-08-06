# 💍 Jewelry Ecommerce Backend – Day 2: Product API (Steps 1–5)

This document outlines how to build the **Product API** for a Jewelry Ecommerce website using **Node.js**, **Express**, **MongoDB**, and **Cloudinary**.

---

## ✅ Prerequisites

Before getting started, ensure you have the following setup:

- **Node.js** & **npm** installed  
- **MongoDB Atlas** account (with a connection URI)  
- **Cloudinary** account (to host product images)  
- A `.env` file in `Backend/` with the following contents:

```env
PORT=8025
MONGO_URI=your_mongodb_uri_here

🔹 Step 1: Create Product Model
📁 Location: Backend/src/models/product.model.js

Defines the structure and fields for each product stored in MongoDB.

js
Copy code
import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String },
    category: { type: String },
    images: [{ type: String }], // Array of Cloudinary image URLs
    sizes: [{ type: String }],
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);
export default Product;

🔹 Step 2: Create Product Controller
📁 Location: Backend/src/controllers/product.controller.js

Handles logic for creating a new product.

js
Copy code
import Product from "../models/product.model.js";

export const createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    res.status(500).json({ message: "Error creating product", error });
  }
};
📝 Note: More handlers (like get, update, delete) will be added later.PORA CODE .IS KI FILE SE LE LI

🔹 Step 3: Create Product Routes
📁 Location: Backend/src/routes/product.routes.js

Defines RESTful API endpoints and connects them to the controller.

js
Copy code
import express from "express";
import {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/product.controller.js";

const router = express.Router();

router.post("/", createProduct);
router.get("/", getAllProducts);
router.get("/:id", getSingleProduct);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

export default router;

🔹 Step 4: Connect Routes in Main Server File
📁 Location: Backend/src/index.js

Registers the product routes with the Express server.

js
Copy code
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./db/connectDB.js";
import productRoutes from "./routes/product.routes.js";

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

// ✅ Register the Product API route
app.use("/api/products", productRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

🔹 Step 5: Test Product API with Postman
🔧 Method: POST
🌐 URL: http://localhost:8025/api/products
🧾 Body: raw > JSON
✅ Sample Request Body:
json
Copy code
{
  "name": "Letter",
  "price": 500,
  "description": "A beautifully crafted diamond necklace, perfect for weddings and parties.",
  "category": "necklace",
  "images": [
    "https://res.cloudinary.com/dbaoyczba/image/upload/v1753613040/jewelry/jsluuufe91baq5mupi69.png",
    "https://res.cloudinary.com/dbaoyczba/image/upload/v1753613040/jewelry/jsluuufe91baq5mupi69.png",
    "https://res.cloudinary.com/dbaoyczba/image/upload/v1753613040/jewelry/jsluuufe91baq5mupi69.png"
  ],
  "sizes": ["16 inch", "18 inch"]
}
✅ Success Response:
json
Copy code
{
  "message": "Product created successfully",
  "product": {
    "_id": "...",
    "name": "Letter",
    "price": 500,
    "description": "A beautifully crafted diamond necklace...",
    "category": "necklace",
    "images": [...],
    "sizes": ["16 inch", "18 inch"],
    "createdAt": "...",
    "updatedAt": "..."
  }
}

step 6:
mera products.js wala page copy paste krna ab udr array khtm ho gai ha or fetch se data a rha ha .or us k bad cors intall hona chahye .or src me index.js me ye likhna "import cors from "cors";".us k bad product.controller.js me jana mera wala copy krna ude ye msla tha k pehly ma category ko req.files se read ni kr rhi thi.
ab hopefully chal jana chahye:)

step 7:
mera product.js copy paste krna ha. us k bad na product.html me jana or ye krna:
Replace this :
<div class="thumbnails">
  <img src="images/whimsiwing1.jpg" alt="Thumb 1" onclick="clickImageChange(this)">
  <img src="images/whimsiwing2.jpg" alt="Thumb 2" onclick="clickImageChange(this)">
  <img src="images/whimsiwing3.jpg" alt="Thumb 3" onclick="clickImageChange(this)">
</div>
To this:
<div class="thumbnails" id="thumbnail-container"></div>

