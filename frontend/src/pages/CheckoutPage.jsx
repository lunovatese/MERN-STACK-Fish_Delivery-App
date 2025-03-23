import  { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import instance from "../utils/axiosConfig";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(
  "pk_test_51R2v8YCSrU1D14YGNw3FENhcuiXAnhgxSrH3bpxOeTszuTLgWuv3zruqc1SJlfEMc0NVmSnLZPFQjmjDvTv4rj7P00UXrU2yI9"
);

const CheckoutForm = () => {
  const { cartItems, clearCart } = useCart(); 
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();

  const [deliveryInformationData, setDeliveryInformationData] = useState({
    fullName: "",
    contactNumber: "",
    deliveryAddress: "",
    deliveryTime: "",
    specialInstructions: "",
    paymentMethod: "cash",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentError, setPaymentError] = useState(null);

  useEffect(() => {
    if (cartItems.length === 0) {
      navigate("/cart");
    }
  }, [cartItems, navigate]);

  const validateForm = () => {
    const newErrors = {};
    if (!deliveryInformationData.fullName.trim())
      newErrors.fullName = "Full name is required";
    if (!deliveryInformationData.contactNumber.match(/^\+?[0-9]{10,15}$/))
      newErrors.contactNumber = "Invalid phone number";
    if (!deliveryInformationData.deliveryAddress.trim())
      newErrors.deliveryAddress = "Address is required";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    setPaymentError(null); 

    try {
      let paymentMethodId = null;

      if (deliveryInformationData.paymentMethod === "card") {
        if (!stripe || !elements) {
          return;
        }

        const cardElement = elements.getElement(CardElement);

        const { error, paymentMethod } = await stripe.createPaymentMethod({
          type: "card",
          card: cardElement,
        });

        if (error) {
          console.error("[stripe checkout error]", error);
          setPaymentError(error.message);
          setIsSubmitting(false);
          return;
        }

        paymentMethodId = paymentMethod.id; 
      }

      const orderData = {
        items: cartItems,
        deliveryInformation: deliveryInformationData,
        total: calculateTotal(),
        paymentMethodId: paymentMethodId,
      };

      const response = await instance.post("/orders", orderData);

      if (response.status !== 201) throw new Error("Order submission failed");

      await clearCart(); 
      navigate("/", { state: { orderSuccess: true } });
    } catch (error) {
      console.error("Checkout error:", error);
      setErrors({ submit: error.response?.data?.message || error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculateTotal = () => {
    const subtotal = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const deliveryFee = subtotal > 50 ? 0 : 5;
    return subtotal + deliveryFee;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDeliveryInformationData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Delivery Information Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Full Name
            </label>
            <input
              type="text"
              name="fullName"
              value={deliveryInformationData.fullName}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            />
            {errors.fullName && (
              <p className="text-red-500 text-sm">{errors.fullName}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Contact Number
            </label>
            <input
              type="tel"
              name="contactNumber"
              value={deliveryInformationData.contactNumber}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            />
            {errors.contactNumber && (
              <p className="text-red-500 text-sm">{errors.contactNumber}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Delivery Address
            </label>
            <textarea
              name="deliveryAddress"
              value={deliveryInformationData.deliveryAddress}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              rows="3"
              required
            />
            {errors.deliveryAddress && (
              <p className="text-red-500 text-sm">{errors.deliveryAddress}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Preferred Delivery Time
            </label>
            <input
              type="datetime-local"
              name="deliveryTime"
              value={deliveryInformationData.deliveryTime}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Special Instructions
            </label>
            <textarea
              name="specialInstructions"
              value={deliveryInformationData.specialInstructions}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              rows="2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Payment Method
            </label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cash"
                  checked={deliveryInformationData.paymentMethod === "cash"}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                Cash on Delivery
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="card"
                  checked={deliveryInformationData.paymentMethod === "card"}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                Credit/Debit Card
              </label>
            </div>
          </div>

          {deliveryInformationData.paymentMethod === "card" && (
            <div className="border p-4 rounded">
              <label className="block text-sm font-medium mb-2">
                Card Details
              </label>
              <CardElement
                options={{
                  style: {
                    base: {
                      fontSize: "16px",
                      color: "#424770",
                      "::placeholder": {
                        color: "#aab7c4",
                      },
                    },
                    invalid: {
                      color: "#9e2146",
                    },
                  },
                }}
              />
              {paymentError && (
                <p className="text-red-500 text-sm mt-2">{paymentError}</p>
              )}
            </div>
          )}

          {errors.submit && (
            <p className="text-red-500 text-sm mt-4">{errors.submit}</p>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white py-3 rounded mt-6 hover:bg-blue-700 disabled:opacity-50"
          >
            {isSubmitting ? "Processing..." : "Place Order"}
          </button>
          {errors.submit && (
            <p className="text-red-500 text-sm mt-4">{errors.submit}</p>
          )}
        </form>

        {/* Order Summary */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Order Summary</h2>
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-center"
              >
                <div>
                  <h3 className="font-medium">{item.name}</h3>
                  <p className="text-sm text-gray-600">
                    Qty: {item.quantity}
                  </p>
                </div>
                <p>${(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}

            <div className="border-t pt-4">
              <div className="flex justify-between mb-2">
                <span>Subtotal</span>
                <span>
                  $
                  {cartItems
                    .reduce(
                      (sum, item) => sum + item.price * item.quantity,
                      0
                    )
                    .toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between mb-2">
                <span>Delivery Fee</span>
                <span>$5.00</span>
              </div>
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>${calculateTotal().toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


const CheckoutPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <CheckoutFormComponent />
      </div>
    </div>
  );
};

const CheckoutFormComponent = () => (
  <Elements stripe={stripePromise}>
    <CheckoutForm />
  </Elements>
);


export default CheckoutPage;