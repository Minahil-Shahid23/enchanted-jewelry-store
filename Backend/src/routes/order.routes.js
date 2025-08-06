// import express from "express";
// import { createOrder } from "../controllers/orderController.js";

// const router = express.Router();

// //Jab bhi koi POST request /orders pe aaye, toh createOrder function ko run karo
// router.post("/orders", createOrder);

// export default router;


import express from "express";
import {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder   // ✅ add
} from "../controllers/orderController.js";

const router = express.Router();

router.post("/orders", createOrder);
router.get("/orders", getOrders);
router.get("/orders/:id", getOrderById);
router.patch("/orders/:id", updateOrderStatus);
router.delete("/orders/:id", deleteOrder);   // ✅ add this

export default router;
