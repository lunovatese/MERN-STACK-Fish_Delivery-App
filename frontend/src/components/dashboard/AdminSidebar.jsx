import React from 'react';
import { FaBuilding, FaCogs, FaTachometerAlt, FaMoneyBillWave, FaUsers, FaShoppingCart, FaCreditCard } from 'react-icons/fa';
import { NavLink } from 'react-router-dom';
import siteIcon from './joker.png';

// Import the CSS file
import '../../customStyles.css';

const AdminSidebar = () => {
  return (
    <div className="sidebar">
      <div className='bg-teal-600 h-12 flex items-center justify-center'>
        <h3 className='text-2xl text-center font-pacific text-primary'>Fish Marcket MS</h3>
      </div>
      <div className="mb-2 text-center">
        <img src={siteIcon} alt="Site Icon" style={{ width: '120px' }} />
      </div>
      <div className="px-4">
        <NavLink to="/admin-dashboard" className={({ isActive }) => `${isActive ? "bg-teal-500" : ""} flex items-center space-x-4 py-2.5 px-4 rounded`} end>
          <FaTachometerAlt /> <span>Dashboard</span>
        </NavLink>
        <NavLink to="/admin-dashboard/employees" className={({ isActive }) => `${isActive ? "bg-teal-500" : ""} flex items-center space-x-4 py-2.5 px-4 rounded`}>
          <FaUsers /> <span>Employee</span>
        </NavLink>
        <NavLink to="/admin-dashboard/suppliers" className={({ isActive }) => `${isActive ? "bg-teal-500" : ""} flex items-center space-x-4 py-2.5 px-4 rounded`}>
          <FaUsers /> <span>Suppliers</span>
        </NavLink>
        <NavLink to="/admin-dashboard/departments" className={({ isActive }) => `${isActive ? "bg-teal-500" : ""} flex items-center space-x-4 py-2.5 px-4 rounded`}>
          <FaBuilding /> <span>Department</span>
        </NavLink>
        <NavLink to="/admin-dashboard/salary/add" className={({ isActive }) => `${isActive ? "bg-teal-500" : ""} flex items-center space-x-4 py-2.5 px-4 rounded`}>
          <FaMoneyBillWave /> <span>Salary</span>
        </NavLink>
        <NavLink to="/admin-dashboard/orders" className={({ isActive }) => `${isActive ? "bg-teal-500" : ""} flex items-center space-x-4 py-2.5 px-4 rounded`}>
          <FaShoppingCart /> <span>Orders</span>
        </NavLink>
        <NavLink to="/admin-dashboard/payments" className={({ isActive }) => `${isActive ? "bg-teal-500" : ""} flex items-center space-x-4 py-2.5 px-4 rounded`}>
          <FaCreditCard /> <span>Payments</span>
        </NavLink>
        <NavLink to="/admin-dashboard/setting" className="flex items-center space-x-4 py-2.5 px-4 rounded">
          <FaCogs /> <span>Setting</span>
        </NavLink>
      </div>
    </div>
  );
};

export default AdminSidebar;