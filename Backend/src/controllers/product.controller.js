// controllers/product.controller.js

import Product from "../models/product.model.js";

// 🆕 Yeh function naya product database mein save karta hai
const createProduct = async (req, res) => {
  try {
    const { name, price, description, images, sizes, category, originalPrice } = req.body;

    const newProduct = new Product({
      name,
      price,
      originalPrice: originalPrice || Number(price) + 50,  // ✅ auto fallback if missing
      description,
      images,
      sizes,
      category,
    });

    const savedProduct = await newProduct.save();
    res.status(201).json({
      message: "Product created successfully",
      product: savedProduct,
    });
  } catch (error) {
    res.status(500).json({ message: "Product creation failed", error });
  }
};


// 📦 Yeh function saare products ko database se nikal kar bhejta hai (latest pehle)
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch products", error });
  }
};

// 🔍 Yeh function ek specific product ko uski ID se dhoondta hai
const getSingleProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch product", error });
  }
};

// ✏️ Yeh function kisi product ki details update karta hai
const updateProduct = async (req, res) => {
  try {
    const { name, price, description, images, sizes, category, originalPrice } = req.body;

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name,
        price,
        originalPrice,
        description,
        images,
        sizes,
        category,
      },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    res.status(500).json({ message: "Update failed", error });
  }
};


// ❌ Yeh function ek product ko uski ID se delete karta hai
const deleteProduct = async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Deletion failed", error });
  }
};

export {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
};
