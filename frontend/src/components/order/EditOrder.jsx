import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const EditOrder = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  // statusDate represents the date associated with the current status change (for Received/Cancelled)
  const [statusDate, setStatusDate] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/order/${id}`, {
          headers: { "Authorization": `Bearer ${localStorage.getItem('token')}` }
        });
        if (response.data.success) {
          const ord = response.data.order;
          setOrder(ord);
          // If order is not Placed, use modifiedDate (if set), otherwise default to today.
          if (ord.status === "Received" || ord.status === "Cancelled") {
            setStatusDate(ord.modifiedDate ? new Date(ord.modifiedDate).toISOString().substring(0, 10) : new Date().toISOString().substring(0, 10));
          } else {
            setStatusDate("");
          }
        }
      } catch (error) {
        if (error.response && !error.response.data.success) {
          alert(error.response.data.error);
        }
      }
    };
    fetchOrder();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "quantity") {
      // Update quantity and recalc total
      setOrder(prev => ({
        ...prev,
        quantity: value,
        total: Number(prev.price) * Number(value)
      }));
    } else if (name === "status") {
      // Update status and reset statusDate if status is Received or Cancelled.
      setOrder(prev => ({ ...prev, status: value }));
      if (value === "Received" || value === "Cancelled") {
        setStatusDate(new Date().toISOString().substring(0, 10));
      } else {
        setStatusDate("");
      }
    }
  };

  const handleDateChange = (e) => {
    setStatusDate(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedOrder = {
        quantity: Number(order.quantity),
        status: order.status,
        total: Number(order.price) * Number(order.quantity)
      };

      // If status is Received or Cancelled, include modifiedDate.
      if (order.status === "Received" || order.status === "Cancelled") {
        updatedOrder.modifiedDate = statusDate;
      }

      const response = await axios.put(`http://localhost:5000/api/order/${id}`, updatedOrder, {
        headers: { "Authorization": `Bearer ${localStorage.getItem('token')}` }
      });
      if (response.data.success) {
        navigate("/admin-dashboard/orders");
      }
    } catch (error) {
      if (error.response && !error.response.data.success) {
        alert(error.response.data.error);
      }
    }
  };

  if (!order) return <div>Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto mt-10 bg-white p-8 rounded-md shadow-md">
      <h2 className="text-2xl font-bold mb-6">Edit Order</h2>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Quantity and Total */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Quantity</label>
            <input
              type="number"
              name="quantity"
              value={order.quantity}
              onChange={handleChange}
              className="mt-1 p-2 block w-full border-gray-300 rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Total Amount</label>
            <input
              type="number"
              value={Number(order.price) * Number(order.quantity)}
              readOnly
              className="mt-1 p-2 block w-full border-gray-300 rounded-md"
            />
          </div>
          {/* Status and Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <select
              name="status"
              value={order.status}
              onChange={handleChange}
              className="mt-1 p-2 block w-full border-gray-300 rounded-md"
            >
              <option value="Placed">Placed</option>
              <option value="Received">Received</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
          {(order.status === "Received" || order.status === "Cancelled") && (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                {order.status} Date
              </label>
              <input
                type="date"
                name="statusDate"
                value={statusDate}
                onChange={handleDateChange}
                className="mt-1 p-2 block w-full border-gray-300 rounded-md"
                required
              />
            </div>
          )}
        </div>
        <button
          type="submit"
          className="w-full mt-6 bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditOrder;