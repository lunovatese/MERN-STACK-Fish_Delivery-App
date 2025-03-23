import Department from "../models/Department.js";
import Employee from "../models/Employee.js";
import Order from "../models/Order.js";

const getSummary = async (req, res) => {
  try {
    // Total Employees and Departments
    const totalEmployees = await Employee.countDocuments();
    const totalDepartments = await Department.countDocuments();
    
    // Calculate Total Salary
    const totalSalaries = await Employee.aggregate([
      { $group: { _id: null, totalSalary: { $sum: { $toDouble: { $ifNull: ["$salary", 0] } } } } }
    ]);
    const totalSalaryAmount = totalSalaries.length > 0 ? totalSalaries[0].totalSalary : 0;

    // Orders Summary
    const totalOrders = await Order.countDocuments();
    const placedOrders = await Order.countDocuments({ status: "Placed" });
    const receivedOrders = await Order.countDocuments({ status: "Received" });
    const cancelledOrders = await Order.countDocuments({ status: "Cancelled" });

    const ordersSummary = {
      totalOrders,
      placed: placedOrders,
      received: receivedOrders,
      cancelled: cancelledOrders
    };

    return res.status(200).json({
      success: true,
      totalEmployees,
      totalDepartments,
      totalSalary: totalSalaryAmount,
      ordersSummary
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: "Dashboard summary error" });
  }
};

export { getSummary };