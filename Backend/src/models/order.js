import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zip: { type: String, required: true },
  phone: { type: String },
  country: { type: String, required: true },
  shippingMethod: { type: String, required: true },
  items: [{ 
    productId: String, 
    name: String,        // Add name & price if you want to show in admin
    price: Number,
    quantity: Number 
  }],
  total: { type: Number, required: true },
  status: { type: String, default: "Pending" } // <-- Add this
}, { timestamps: true });


export const Order = mongoose.model("Order", orderSchema);
