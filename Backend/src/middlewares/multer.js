// Multer ko import kar rahe hain jo file uploads handle karta hai
import multer from "multer";

// Path module import kiya — file extension (.png, .jpg) nikalne ke liye
import path from "path";

// Multer ko batate hain ke file kaha temporarily save karni hai
const storage = multer.diskStorage({
  // Jab file upload ho, to is folder me temporarily save karo
  destination: function (req, file, cb) {
    cb(null, "./public/temp"); // => /public/temp folder me save hogi
  },

  // File ka naam kya ho — har file ka unique naam banao
  filename: function (req, file, cb) {
    // File ka extension nikalna (.jpg, .png, etc.)
    const ext = path.extname(file.originalname);
    // Unique naam banaya: fieldname + currentTime + extension
    const uniqueName = `${file.fieldname}-${Date.now()}${ext}`;
    cb(null, uniqueName); // => e.g., files-1722105200000.jpg
  },
});

// Final export: yeh middleware ek request me max 10 files accept karega
// Ye files frontend form ke "files" field se aayengi
export const upload = multer({ storage }).array("files", 10);
