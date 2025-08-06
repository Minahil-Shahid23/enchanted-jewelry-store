// Local file (jo multer ne public/temp mein save ki thi) ko Cloudinary pe upload karna aur uske baad local copy delete kar dena.

import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// Ye .env file se credentials read karta hai

// Taake Cloudinary jaane ke kis account me upload karna hai.
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
//localFilePath: wo path jahan file temporarily multer ne save ki hai (e.g., public/temp/image.png)
// folder: Cloudinary pe kis folder me save karni hai (e.g., jewelry)
const uploadOnCloudinary = async (localFilePath, folder = "") => {
  //   uploader.upload() → file ko cloudinary pe upload karta hai
  // resource_type: "auto" → Cloudinary khud decide karega ke image hai, video hai ya koi aur file
  // folder: jewelry → file Cloudinary ke jewelry folder me chali jayegi
  try {
    if (!localFilePath) return null;

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
      folder: folder || "jewelry", // Optional: upload to folder
    });
    //response.secure_url Cloudinary pe image ka public URL deta hai
    console.log("Uploaded:", response.secure_url);
    return response;
  } catch (error) {
    console.error("Upload failed:", error);
    return null;
  } finally {
    //     fs.unlinkSync() → wo file delete kar deta hai jise multer ne save ki thi
    // Ye finally block me hai, yani upload ho ya fail ho — file delete zarur hogi
    fs.unlinkSync(localFilePath); // Always delete local file
  }
};

export { uploadOnCloudinary };
