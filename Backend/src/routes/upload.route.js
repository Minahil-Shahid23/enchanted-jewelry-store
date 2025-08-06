// Ye route /upload-multiple pe frontend se aane wali multiple images ko:
// Pehle multer se receive karta hai.
// Phir har image ko Cloudinary pe upload karta hai.
// Aur uska URL return karta hai frontend ko.


// express = backend banane ke liye
// upload = multer middleware jo frontend se aane wali files ko handle karta hai
// uploadOnCloudinary = ek helper function jo local file ko Cloudinary pe upload karta hai
import express from "express";
import { upload } from "../middlewares/multer.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
//Ek mini app router bana rahe hain, jisme hum multiple routes bana sakte hain.
const router = express.Router();
// ab frontend se POST request aayegi is route par...
// upload middleware chalega pehle (multer)
// Ye req.files me 10 tak images daal dega
// Uske baad async (req, res) wala callback chalega


router.post("/upload-multiple", upload, async (req, res) => {
  try {
    //Agar user ne koi file upload hi nahi ki, to 400 error bhej do
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }
    // req.files me sari uploaded files hoti hain (local system me public/temp folder me)
    // Har file ke liye:
    // file.path ko Cloudinary pe upload karta hai
    // Agar upload successful ho gaya to secure_url nikalta hai
    // Us URL ko urls array me daal deta hai
    const urls = [];

    for (const file of req.files) {
      const result = await uploadOnCloudinary(file.path);
      if (result?.secure_url) {
        urls.push(result.secure_url);
      }
    }
    //res.status(200).json({
    

      res.status(200).json({
        message: "Files uploaded successfully",
        urls,
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Upload failed", error });
  }
});

export default router; // ✅ Must be default export
