import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { PaymentButtons, paymentColumns, fetchPayments } from '../../utils/PaymentHelper.jsx';
import { Link } from 'react-router-dom';

const AddPayment = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filteredPayments, setFilteredPayments] = useState([]);

  const handleDeletePayment = (id) => {
    setPayments(prev => prev.filter(payment => payment._id !== id));
    setFilteredPayments(prev => prev.filter(payment => payment._id !== id));
  };

  useEffect(() => {
    const loadPayments = async () => {
      setLoading(true);
      try {
        const response = await fetchPayments();
        if (response.success) {
          let count = 1;
          const data = response.payments.map((payment) => ({
            _id: payment._id,
            sno: count++,
            orderId: payment.order ? payment.order.orderId : "No Order",
            orderStatus: payment.order ? payment.order.status : "No Order",
            paymentDate: payment.payedDate ? new Date(payment.payedDate).toLocaleDateString() : "Not Paid",
            total: payment.total,
            paymentStatus: payment.paymentStatus || "Pending",
            action: (
              <PaymentButtons
                id={payment._id}
                onPaymentDelete={() => handleDeletePayment(payment._id)}
              />
            ),
          }));
          setPayments(data);
          setFilteredPayments(data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    loadPayments();
  }, []);

  const handleFilter = (e) => {
    const searchText = e.target.value.toLowerCase();
    const filtered = payments.filter(payment =>
      payment.orderId.toLowerCase().includes(searchText) ||
      payment.orderStatus.toLowerCase().includes(searchText) ||
      payment.paymentStatus.toLowerCase().includes(searchText) ||
      payment.paymentDate.toLowerCase().includes(searchText)
    );
    setFilteredPayments(filtered);
  };

  return (
    <div className="p-6">
      <h3 className="text-2xl font-bold">Manage Payments</h3>
      <div className="flex justify-between items-center my-4">
        <input
          type="text"
          placeholder="Search by Order ID, Order Status, Payment Date or Payment Status"
          className="px-4 py-1 border"
          onChange={handleFilter}
        />

      </div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <DataTable columns={paymentColumns} data={filteredPayments} pagination />
      )}
    </div>
  );
};

export default AddPayment;