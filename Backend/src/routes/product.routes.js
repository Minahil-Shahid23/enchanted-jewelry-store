import express from "express";
import {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/product.controller.js";

const router = express.Router();

// 🆕 Yeh route naya product create karta hai (POST method)
router.post("/", createProduct);

// 📦 Yeh route saare products ko laata hai (GET method)
router.get("/", getAllProducts);

// 🔍 Yeh route ek specific product ko uski ID se laata hai (GET method)
router.get("/:id", getSingleProduct);

// ✏️ Yeh route kisi product ko update karta hai uski ID se (PUT method)
router.put("/:id", updateProduct);

// ❌ Yeh route kisi product ko delete karta hai uski ID se (DELETE method)
router.delete("/:id", deleteProduct);

export default router;
