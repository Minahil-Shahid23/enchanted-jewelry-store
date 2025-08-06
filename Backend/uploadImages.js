// uploadImages.js
import fs from "fs";
import path from "path";
// axios: HTTP requests bhejne ke liye
// form-data: Ye multipart/form-data banata hai (jaise form me file bhejte hain)
import axios from "axios";
import FormData from "form-data";

// FOLDER_PATH: Wo folder jahan se images uthani hain
// API_URL: Backend API jahan ye images upload hongi
// BATCH_SIZE: Kitni images ek sath bhejni hain (10 is a safe limit)
const FOLDER_PATH = "./images"; // change to your folder name if needed
const API_URL = "http://localhost:8025/api/upload-multiple";
const BATCH_SIZE = 10;

// Folder se saari files read karta hai
// Sirf png, jpg, jpeg, webp images ko filter karta hai
const getAllFiles = (folder) => {
  return fs.readdirSync(folder).filter((file) =>
    /\.(png|jpe?g|webp)$/i.test(file)
  );
};

// Har image ko FormData me daal raha hai
// fs.createReadStream() → file ko stream banata hai taake memory overload na ho
const uploadBatch = async (batch) => {
  const form = new FormData();


  batch.forEach((file) => {
    const filePath = path.join(FOLDER_PATH, file);
    form.append("files", fs.createReadStream(filePath));
  });

  try {
//     Ye batch backend pe /upload-multiple route ko bhej raha hai
// headers: Automatic multipart/form-data set karta hai
// maxBodyLength: Infinity: Taake large file upload fail na ho
// timeout: 60 seconds tak wait kare


    const response = await axios.post(API_URL, form, {
      headers: form.getHeaders(),
      maxBodyLength: Infinity,
      timeout: 60000,
    });

    console.log("✅ Uploaded:");
    console.log(response.data.urls.join("\n"));
  } catch (error) {
  if (error.response) {
    // Server responded with an error
    console.error("❌ Server Error:", error.response.status);
    console.error(error.response.data);
  } else if (error.request) {
    // No response received
    console.error("❌ No response from server. Possible timeout or network error.");
  } else {
    // Something else happened
    console.error("❌ Error:", error.message);
  }
}

};


// Pehle folder se files nikaalta hai
// Fir har 10 images ki batch banata hai
// Har batch ko await uploadBatch() karta hai (sequentially)
// End me success message print karta hai
const main = async () => {
  const files = getAllFiles(FOLDER_PATH);
  console.log(`Found ${files.length} images`);

  for (let i = 0; i < files.length; i += BATCH_SIZE) {
    const batch = files.slice(i, i + BATCH_SIZE);
    console.log(`⏫ Uploading batch ${i / BATCH_SIZE + 1}...`);
    await uploadBatch(batch);
  }

  console.log("🎉 All uploads complete!");
};

main();
