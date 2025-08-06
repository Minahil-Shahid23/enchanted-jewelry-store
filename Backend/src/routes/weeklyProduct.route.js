import express from "express";
import WeeklyProduct from "../models/weeklyProduct.model.js";

const router = express.Router();

// ➕ Add weekly product
router.post("/", async (req, res) => {
  try {
    const { name, price, image } = req.body;
    const product = new WeeklyProduct({ name, price, image });
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    console.error("❌ Weekly product create error:", err);
    res.status(500).json({ message: "Failed to create weekly product" });
  }
});

// 📄 Get all weekly products
router.get("/", async (req, res) => {
  try {
    const products = await WeeklyProduct.find();
    res.json(products);
  } catch (err) {
    console.error("❌ Weekly product fetch error:", err);
    res.status(500).json({ message: "Failed to fetch weekly products" });
  }
});

// ❌ Delete weekly product
router.delete("/:id", async (req, res) => {
  try {
    await WeeklyProduct.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    console.error("❌ Weekly product delete error:", err);
    res.status(500).json({ message: "Failed to delete weekly product" });
  }
});

// 📄 Get single weekly product by ID
router.get("/:id", async (req, res) => {
  try {
    const product = await WeeklyProduct.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: "Error fetching product" });
  }
});

export default router;
