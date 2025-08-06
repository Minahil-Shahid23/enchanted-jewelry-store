// models/product.model.js
import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    images: {
      type: [String], // Array of image URLs (from Cloudinary)
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    originalPrice: {
      type: Number, // Optional: strikethrough price
    },
    description: {
      type: String,
    },
    category: {
      type: String, // Necklace, Ring, etc.
    },
    sizes: {
      type: [String], // Example: ["16\"", "18\"", "20\""]
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);
export default Product;
