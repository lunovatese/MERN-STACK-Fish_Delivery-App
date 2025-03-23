import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import SupplierSelect from '../../utils/Supplier';

const AddOrder = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    product: 'PID001',
    supplierId: '',
    price: '',
    quantity: '',
    date: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Auto-calculate total (price * quantity)
  const total = Number(formData.price) * Number(formData.quantity);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const orderData = {
      ...formData,
      price: Number(formData.price),
      quantity: Number(formData.quantity),
      total: total,
      status: "Placed" // default status
    };

    try {
      const response = await axios.post('http://localhost:5000/api/order/add', orderData, {
        headers: { "Authorization": `Bearer ${localStorage.getItem('token')}` },
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

  return (
    <div className="max-w-4xl mx-auto mt-10 bg-white p-8 rounded-md shadow-md">
      <h2 className="text-2xl font-bold mb-6">Add New Order</h2>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Product</label>
            <select
              name="product"
              value={formData.product}
              onChange={handleChange}
              className="mt-1 p-2 block w-full border-gray-300 rounded-md"
            >
              <option value="PID001">PID001</option>
              <option value="PID002">PID002</option>
              <option value="PID003">PID003</option>
              <option value="PID004">PID004</option>
              <option value="PID005">PID005</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Supplier</label>
            <SupplierSelect
              name="supplierId"
              value={formData.supplierId}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Price</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="mt-1 p-2 block w-full border-gray-300 rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Quantity</label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              className="mt-1 p-2 block w-full border-gray-300 rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="mt-1 p-2 block w-full border-gray-300 rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Total Amount</label>
            <input
              type="number"
              value={total || 0}
              readOnly
              className="mt-1 p-2 block w-full border-gray-300 rounded-md"
            />
          </div>
        </div>
        <button
          type="submit"
          className="w-full mt-6 bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4"
        >
          Add Order
        </button>
      </form>
    </div>
  );
};

export default AddOrder;