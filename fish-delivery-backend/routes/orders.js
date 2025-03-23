import express from "express";
import { protect } from "../middleware/auth.js";
import Order from "../models/Order.js";
import Stripe from 'stripe'; // Import Stripe


const stripe = new Stripe("sk_test_51R2v8YCSrU1D14YGNBVYCABUkwzSVMfIuoTTH58CQdpRHobqT39JHXw9ibukq7bXlWYc5vhKhkDHF4W89kkSgBGQ009SHFKLr0"); // <-- Put your test secret key here!

const router = express.Router();

router.post("/", protect, async (req, res) => {s
  console.log("Received req.body in /api/orders:", req.body);
  try {
    const { items, deliveryInformation, total, paymentMethodId } = req.body; // Extract paymentMethodId

    if (!items || items.length === 0 || !deliveryInformation || !total) {
      return res
        .status(400)
        .json({ message: "Invalid order data. Missing required fields." });
    }

    let paymentSuccess = false; // Track payment success
    if (deliveryInformation.paymentMethod === "card" && paymentMethodId) {
      try {
        const paymentIntent = await stripe.paymentIntents.create({
          amount: Math.round(total * 100), // Amount in cents
          currency: "lkr", 
          payment_method: paymentMethodId,
          confirm: true, // Immediately confirm the PaymentIntent
          automatic_payment_methods: { 
            enabled: true,
            allow_redirects: 'never',
          },
        });


        if (paymentIntent.status === 'succeeded') {
          paymentSuccess = true;
        } else {
          console.error("Stripe PaymentIntent failed:", paymentIntent);
          return res.status(400).json({ message: "Payment failed. Please check your card details." });
        }
      } catch (stripeError) {
        console.error("Error processing Stripe payment:", stripeError);
        return res.status(500).json({ message: "Payment processing error.", error: stripeError.message });
      }
    } else if (deliveryInformation.paymentMethod !== "cash" && !paymentMethodId ) {
      return res.status(400).json({ message: "Payment method ID is missing for card payments." });
    } else {
        paymentSuccess = true; // If Cash on Delivery, payment is considered "success" for order creation flow.
    }


    if (!paymentSuccess) {
        return res.status(400).json({ message: "Payment was not successful. Order cannot be placed." });
    }

    const orderItems = items.map((item) => ({
      item: item.item._id,
      quantity: item.quantity,
      price: item.price,
    }));

    const newOrder = new Order({
      user: req.user._id,
      items: orderItems,
      totalAmount: total,
      deliveryInformation,
      paymentMethod: deliveryInformation.paymentMethod, // Store selected payment method in order
    });

    const createdOrder = await newOrder.save();
    await createdOrder.populate("items.item");

    res.status(201).json(createdOrder);
  } catch (error) {
    console.error("Error creating order:", error);
    if (error.name === "ValidationError") {
      return res
        .status(400)
        .json({ message: "Order validation failed", errors: error.errors });
    }
    res
      .status(500)
      .json({ message: "Error creating order", error: error.message });
  }
});

// @route   GET /api/orders/me
// @desc    Get logged in user orders
// @access  Private
router.get("/me", protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate({
        path: 'items.item', 
        model: 'FishItem'   
      })
      .sort({ createdAt: -1 }); // Sort by creation date, newest first

    res.json(orders);
  } catch (error) {
    console.error("Error fetching user orders:", error);
    res.status(500).json({ message: "Error fetching orders", error: error.message });
  }
});

export default router;