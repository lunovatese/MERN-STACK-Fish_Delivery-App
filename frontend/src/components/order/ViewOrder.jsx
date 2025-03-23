import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const ViewOrder = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/order/${id}`, {
          headers: { "Authorization": `Bearer ${localStorage.getItem('token')}` },
        });
        if (response.data.success) {
          setOrder(response.data.order);
        }
      } catch (error) {
        if (error.response && !error.response.data.success) {
          alert(error.response.data.error);
        }
      }
    };
    fetchOrder();
  }, [id]);

  if (!order) return <div>Loading...</div>;

  let statusDate = "";
  if (order.status !== "Placed") {
    statusDate = order.modifiedDate ? new Date(order.modifiedDate).toLocaleDateString() : "";
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 bg-white p-8 rounded-md shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Order Details</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-xl font-bold mb-4">Order Information</h3>
          <p><strong>Order ID:</strong> {order.orderId}</p>
          <p><strong>Product:</strong> {order.product}</p>
          <p><strong>Price:</strong> {order.price}</p>
          <p><strong>Quantity:</strong> {order.quantity}</p>
          <p><strong>Total:</strong> {order.total}</p>
          <p><strong>Placed Date:</strong> {new Date(order.placedDate).toLocaleDateString()}</p>
          <p><strong>Status:</strong> {order.status}</p>
          {order.status !== "Placed" && (
            <p><strong>{order.status} Date:</strong> {statusDate}</p>
          )}
        </div>
        <div>
          <h3 className="text-xl font-bold mb-4">Supplier Information</h3>
          <p><strong>Supplier ID:</strong> {order.supplier._id}</p>
          <p><strong>Name:</strong> {order.supplier.name}</p>
          <p><strong>Business:</strong> {order.supplier.business}</p>
          <p><strong>Phone:</strong> {order.supplier.phone}</p>
          <p><strong>Email:</strong> {order.supplier.email}</p>
        </div>
      </div>
    </div>
  );
};

export default ViewOrder;