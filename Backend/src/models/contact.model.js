import mongoose from "mongoose";

const contactSchema = new mongoose.Schema({
  fullname: { type: String, required: true },
  email: { type: String, required: true },
  interest: { type: String, required: true },
  message: { type: String, required: true },
  attachmentUrl: { type: String }, // Cloudinary or local file path
  createdAt: { type: Date, default: Date.now }
});

export const Contact = mongoose.model("Contact", contactSchema);
