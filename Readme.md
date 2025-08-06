# Enchanted Trinkets ✨

A beautifully designed handcrafted jewelry ecommerce website inspired by romantic aesthetics and soft elegance.

---

## 🌸 Features

- 💍 Shop by Category — Rings, Necklaces, Earrings, Charms, Bracelets
- 🧾 Add to Cart & Buy Now functionality
- 🛍️ Weekly Featured Products — Admin controlled
- 📦 Full Checkout Experience
- 📬 Contact Form with attachment support
- 💫 Elegant UI — Fonts: *Quicksand* + *Lavishly Yours*
- 🛠️ Backend with Express.js + MongoDB
- ☁️ Cloudinary for Image Hosting

---

## 🗂️ Folder Structure

av1/
├── Backend/ → Express.js + MongoDB backend
│ └── src/
│ ├── models/ → Mongoose schemas
│ ├── routes/ → Product, Contact, Weekly APIs
│ └── index.js → Entry point with Cloudinary, MongoDB, etc.
├── Frontend/ → Complete responsive HTML, CSS, JS
│ ├── index.html → Home Page
│ ├── product.html → Single Product View
│ ├── cart.html → Cart Page
│ ├── checkout.html → Buy Now Page
│ ├── admin.html → Admin Dashboard (Add/Delete Weekly Products)
│ └── styles.css → Elegant, soft-styled theme
├── .gitignore
└── Readme.md

yaml
Copy
Edit

---

## ⚙️ Tech Stack

**Frontend**
- HTML5 + CSS3
- JavaScript (Vanilla)
- Responsive Design

**Backend**
- Node.js + Express.js
- MongoDB + Mongoose
- dotenv
- multer (for uploads)
- Cloudinary (image hosting)

---

## 🔐 Admin Features

- Add Weekly Products (Name, Price, Image Upload to Cloudinary)
- Delete Weekly Products
- Weekly section appears dynamically on homepage
- No login page yet — for demo simplicity

---

## 🚀 How to Run Locally

1. **Clone the repo**
   ```bash
   git clone https://github.com/YOUR_USERNAME/av1.git
   cd av1/Backend
2.Install dependencies

bash
Copy
Edit
npm install
3.Setup .env file

ini
Copy
Edit
PORT=8025
MONGODB_URI=your_mongodb_connection_string
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
4.Run backend server

bash
Copy
Edit
npm run dev
5.Open Frontend

Open Frontend/index.html in any browser
