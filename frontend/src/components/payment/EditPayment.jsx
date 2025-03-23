import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchPaymentById, updatePaymentStatus } from '../../utils/PaymentHelper.jsx';
import Sidebar from '../dashboard/AdminSidebar.jsx';
import Navbar from '../../components/dashboard/Navbar';

const EditPayment = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [payment, setPayment] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState("Pending");
  const [paymentDate, setPaymentDate] = useState(""); // For manual selection
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadPayment = async () => {
      try {
        const response = await fetchPaymentById(id);
        if (response.success) {
          setPayment(response.payment);
          setPaymentStatus(response.payment.paymentStatus);
          if (response.payment.payedDate) {
            setPaymentDate(new Date(response.payment.payedDate)
              .toISOString().substring(0, 10));
          } else {
            setPaymentDate("");
          }
        } else {
          setError(response.error);
        }
      } catch (error) {
        setError("Server error fetching payment");
      }
    };
    loadPayment();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Build payload with paymentStatus and, if Payed, paymentDate
      const payload = { paymentStatus };
      if (paymentStatus === "Payed") {
        payload.paymentDate = paymentDate;
      }
      const response = await updatePaymentStatus(id, payload);
      if (response.success) {
        navigate('/admin-dashboard/payments');
      } else {
        setError(response.error || "Update failed");
      }
    } catch (error) {
      setError("Server error updating payment");
    }
  };

  return (
    <div className="flex">
      <div className="main-content">
        <div className="card">
          <h3 className="mb-2">Edit Payment</h3>
          <form onSubmit={handleSubmit}>
            <div className="mb-2">
              <label>Order ID</label>
              <input
                type="text"
                value={payment?.order?.orderId || ""}
                readOnly
                className="input"
              />
            </div>
            <div className="mb-2">
              <label>Supplier Name</label>
              <input
                type="text"
                value={payment?.order?.supplier?.name || ""}
                readOnly
                className="input"
              />
            </div>
            <div className="mb-2">
              <label>Total Amount</label>
              <input
                type="text"
                value={payment?.total || ""}
                readOnly
                className="input"
              />
            </div>
            <div className="mb-2">
              <label>Payment Status</label>
              <select
                value={paymentStatus}
                onChange={(e) => setPaymentStatus(e.target.value)}
                className="input"
              >
                <option value="Pending">Pending</option>
                <option value="Payed">Payed</option>
              </select>
            </div>
            {paymentStatus === "Payed" && (
              <div className="mb-2">
                <label>Payment Date</label>
                <input
                  type="date"
                  value={paymentDate}
                  onChange={(e) => setPaymentDate(e.target.value)}
                  className="input"
                  required
                />
              </div>
            )}
            <button type="submit" className="btn bg-pink text-white w-full">
              Save Changes
            </button>
          </form>
          {error && <div className="text-danger">{error}</div>}
        </div>
      </div>
    </div>
  );
};

export default EditPayment;