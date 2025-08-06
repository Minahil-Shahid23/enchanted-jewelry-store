// import { Order } from "../models/Order.js";

// export const createOrder = async (req, res) => {
//   try {
//     const {
//       name, email, address, city, state, zip,
//       phone, country, shippingMethod, items, total
//     } = req.body;

//     if (!name || !email || !address || !items || !total) {
//       return res.status(400).json({ error: "Missing required fields" });
//     }

//     //     This is creating a new order object using the Mongoose Order model.
//     // All the form values are passed into it.
//     // But it’s not saved yet.


//     const order = new Order({
//       name, email, address, city, state, zip,
//       phone, country, shippingMethod, items, total
//     });

//     const savedOrder = await order.save();

// //     ends back a success response to the user.
// // 201 is the HTTP status code for "Created".
// // json(savedOrder) sends the newly saved order data back in JSON format.
//     res.status(201).json(savedOrder);
//   } catch (err) {
//     console.error("❌ Order Error:", err);  // ✅ this is critical
//     res.status(500).json({ error: "Server error while creating order." });
//   }
// };



















import { Order } from "../models/order.js";

// Already exists: createOrder()
export const createOrder = async (req, res) => {
  try {
    const {
      name, email, address, city, state, zip,
      phone, country, shippingMethod, items, total
    } = req.body;

    if (!name || !email || !address || !items || !total) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    //     This is creating a new order object using the Mongoose Order model.
    // All the form values are passed into it.
    // But it’s not saved yet.


    const order = new Order({
      name, email, address, city, state, zip,
      phone, country, shippingMethod, items, total
    });

    const savedOrder = await order.save();

//     ends back a success response to the user.
// 201 is the HTTP status code for "Created".
// json(savedOrder) sends the newly saved order data back in JSON format.
    res.status(201).json(savedOrder);
  } catch (err) {
    console.error("❌ Order Error:", err);  // ✅ this is critical
    res.status(500).json({ error: "Server error while creating order." });
  }
};

// Fetch all orders
export const getOrders = async (req, res) => {
  try {
    const status = req.query.status;

    let query = {};
    if (status === 'Pending') {
      // include docs missing status too (old orders)
      query = { $or: [{ status: 'Pending' }, { status: { $exists: false } }] };
    } else if (status === 'Shipped') {
      query = { status: 'Shipped' };
    }
    
    const orders = await Order.find(query).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error('❌ Error fetching orders:', err);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
};


// Fetch single order by ID
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: "Order not found" });
    res.json(order);
  } catch (err) {
    console.error("❌ Error fetching order:", err);
    res.status(500).json({ error: "Failed to fetch order" });
  }
};

// Update status (mark as shipped)
export const updateOrderStatus = async (req, res) => {
  try {
    console.log("Incoming PUT body:", req.body);  // Add this

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );

    if (!order) return res.status(404).json({ error: "Order not found" });
    res.json(order);
  } catch (err) {
    console.error("❌ Error updating order status:", err);
    res.status(500).json({ error: "Failed to update order status" });
  }
};





export const deleteOrder = async (req, res) => {
  try {
    const deleted = await Order.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "Order not found" });
    }
    res.json({ message: "Order deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting order:", err);
    res.status(500).json({ error: "Failed to delete order" });
  }
};

