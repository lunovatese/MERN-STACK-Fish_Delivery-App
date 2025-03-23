import Payment from '../models/Payment.js';

export const getPayments = async (req, res) => {
  try {
    const payments = await Payment.find().populate({
      path: 'order',
      populate: { path: 'supplier' }
    });
    if (!payments) {
      return res.status(404).json({ success: false, error: "No payments found." });
    }
    return res.status(200).json({ success: true, payments });
  } catch (error) {
    return res.status(500).json({ success: false, error: "Get payments server error" });
  }
};

export const getPayment = async (req, res) => {
  try {
    const { id } = req.params;
    const payment = await Payment.findById(id).populate({
      path: 'order',
      populate: { path: 'supplier' }
    });
    if (!payment) {
      return res.status(404).json({ success: false, error: "Payment not found" });
    }
    return res.status(200).json({ success: true, payment });
  } catch (error) {
    return res.status(500).json({ success: false, error: "Get payment server error" });
  }
};

export const updatePayment = async (req, res) => {
  try {
    const { id } = req.params;
    const { paymentStatus, paymentDate } = req.body;
    const payment = await Payment.findById(id);
    if (!payment) {
      return res.status(404).json({ success: false, error: "Payment not found" });
    }
    payment.paymentStatus = paymentStatus;
    if (paymentStatus === "Payed" && paymentDate) {
      payment.payedDate = new Date(paymentDate);
    }
    payment.updatedAt = Date.now();
    await payment.save();
    return res.status(200).json({ success: true, message: "Payment updated", payment });
  } catch (error) {
    return res.status(500).json({ success: false, error: "Update payment server error" });
  }
};

export const deletePayment = async (req, res) => {
  try {
    const { id } = req.params;
    const payment = await Payment.findByIdAndDelete(id);
    if (!payment) {
      return res.status(404).json({ success: false, error: "Payment not found" });
    }
    return res.status(200).json({ success: true, message: "Payment deleted successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, error: "Delete payment server error" });
  }
};