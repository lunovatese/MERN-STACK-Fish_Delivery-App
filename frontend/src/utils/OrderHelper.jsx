import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const orderColumns = [
  { name: "S No", selector: row => row.sno },
  { name: "Order ID", selector: row => row.orderId, sortable: true },
  { name: "Product", selector: row => row.product, sortable: true },
  { name: "Price", selector: row => row.price },
  { name: "Quantity", selector: row => row.quantity },
  { name: "Total", selector: row => row.total },
  { name: "Date", selector: row => row.date },
  { name: "Status", selector: row => row.status },
  { name: "Action", selector: row => row.action, center: "true", width: "190px" },
];

export const OrderButtons = ({ id, onOrderDelete }) => {
  const navigate = useNavigate();

  const handleDelete = async () => {
    if (!id) {
      alert("Order ID is undefined.");
      return;
    }
    const confirmDelete = window.confirm("Do you want to delete?");
    if (confirmDelete) {
      try {
        const response = await axios.delete(`http://localhost:5000/api/order/${id}`, {
          headers: { "Authorization": `Bearer ${localStorage.getItem('token')}` },
        });
        if (response.data.success) {
          alert("Order deleted successfully.");
          onOrderDelete();
        } else {
          alert(response.data.error || "Failed to delete order.");
        }
      } catch (error) {
        alert(error.response?.data?.error || "Error deleting order.");
      }
    }
  };

  return (
    <div className="flex space-x-3">
      <button
        className="px-3 py-1 bg-teal-600 text-white"
        onClick={() => navigate(`/admin-dashboard/order/view/${id}`)}
      >
        View
      </button>
      <button
        className="px-5 py-1 bg-teal-600 text-white"
        onClick={() => navigate(`/admin-dashboard/order/edit/${id}`)}
      >
        Edit
      </button>
      <button className="px-5 py-1 bg-red-600 text-white" onClick={handleDelete}>
        Delete
      </button>
    </div>
  );
};