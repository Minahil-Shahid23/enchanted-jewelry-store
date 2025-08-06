import { Contact } from "../models/contact.model.js";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// 🔧 Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// ✅ POST: Handle contact form submission
export const handleContactForm = async (req, res) => {
  console.log("⚡ Controller HIT");

  try {
    const { fullname, email, interest, message } = req.body;
    console.log("📨 Form received:", req.body);

    if (!fullname || !email || !interest || !message) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    let attachmentUrl = null;

    if (req.file) {
      console.log("📁 File received:", req.file);

      try {
        const result = await cloudinary.uploader.upload(req.file.path, {
          resource_type: "auto",
          folder: "contact-attachments"
        });
        console.log("✅ File uploaded to Cloudinary:", result.secure_url);

        attachmentUrl = result.secure_url;
        fs.unlinkSync(req.file.path);
      } catch (uploadErr) {
        console.error("❌ Cloudinary upload failed:", uploadErr);
        return res.status(500).json({ error: "File upload failed" });
      }
    }

    const contact = new Contact({
      fullname,
      email,
      interest,
      message,
      attachmentUrl
    });

    await contact.save();
    console.log("✅ Contact saved to MongoDB");
    console.log("✅ Sending JSON response to frontend");

    res.status(201).json({ success: true, message: "Contact form submitted" });

  } catch (err) {
    console.error("❌ Contact form error:", err);
    res.status(500).json({ error: "Server error while submitting contact form" });
  }
};

// ✅ GET: Admin panel fetch all contact submissions
export const getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: contacts });
  } catch (err) {
    console.error("❌ Failed to fetch contacts:", err);
    res.status(500).json({ error: "Failed to fetch contact submissions" });
  }
};


export const deleteContact = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Contact.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ success: false, error: "Contact not found" });
    }
    res.json({ success: true, message: "Contact deleted" });
  } catch (err) {
    console.error("❌ Failed to delete contact:", err);
    res.status(500).json({ success: false, error: "Server error" });
  }
};
