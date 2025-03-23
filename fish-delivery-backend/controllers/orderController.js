import Order from '../models/Order.js';
import Supplier from '../models/Supplier.js';
import Payment from '../models/Payment.js';

// Add a new order and create a Payment record for it
export const addOrder = async (req, res) => {
  try {
    const { product, supplierId, price, quantity } = req.body;
    // Verify supplier exists
    const supplier = await Supplier.findById(supplierId);
    if (!supplier) {
      return res.status(404).json({ success: false, error: "Supplier not found" });
    }
    const orderId = "ORD" + Date.now();
    const total = Number(price) * Number(quantity);
    // Create the new order with placedDate automatically set
    const newOrder = new Order({
      orderId,
      supplier: supplierId,
      product,
      price: Number(price),
      quantity: Number(quantity),
      total,
      status: "Placed" // Default status
      // placedDate is set by default
    });
    await newOrder.save();
    const populatedOrder = await Order.findById(newOrder._id).populate('supplier');
    
    // Create a Payment record for the order
    const newPayment = new Payment({
      order: newOrder._id,
      total: newOrder.total,
      paymentStatus: "Pending",
      payedDate: null
    });
    await newPayment.save();

    return res.status(200).json({ success: true, message: "Order added", order: populatedOrder });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: "Add order server error" });
  }
};

// Retrieve all orders (unchanged)
export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('supplier');
    if (!orders) {
      return res.status(404).json({ success: false, error: "No orders found." });
    }
    return res.status(200).json({ success: true, orders });
  } catch (error) {
    return res.status(500).json({ success: false, error: "Get orders server error" });
  }
};

// Retrieve a single order (unchanged)
export const getOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id).populate('supplier');
    if (!order) {
      return res.status(404).json({ success: false, error: "Order not found" });
    }
    return res.status(200).json({ success: true, order });
  } catch (error) {
    console.error("Get Order Error:", error);
    return res.status(500).json({ success: false, error: "Get order server error" });
  }
};

// Update order details and update Payment record accordingly
export const updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity, status, modifiedDate } = req.body;
    const order = await Order.findById(id).populate('supplier');
    if (!order) {
      return res.status(404).json({ success: false, error: "Order not found" });
    }
    order.quantity = Number(quantity);
    order.status = status;
    order.total = order.price * Number(quantity);
    // Update modifiedDate when status changes (for Received or Cancelled)
    if (status === "Received" || status === "Cancelled") {
      order.modifiedDate = modifiedDate ? new Date(modifiedDate) : new Date();
    }
    await order.save();

    // Update (or create) the associated Payment record.
    let payment = await Payment.findOne({ order: order._id });
    if (!payment) {
      payment = new Payment({
        order: order._id,
        total: order.total,
        paymentStatus: "Pending",
        payedDate: null
      });
      await payment.save();
    } else {
      payment.total = order.total;
      // We do not update payedDate here because payment processing is separate.
      await payment.save();
    }

    return res.status(200).json({ success: true, message: "Order updated", order });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: "Update order server error" });
  }
};

// Delete order and associated Payment record
export const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findByIdAndDelete(id);
    if (!order) {
      return res.status(404).json({ success: false, error: "Order not found" });
    }
    await Payment.findOneAndDelete({ order: order._id });
    return res.status(200).json({ success: true, message: "Order deleted successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, error: "Delete order server error" });
  }
};