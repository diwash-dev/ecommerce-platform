const roles = require("../utils/const");
const Orders = require("../models/order");
const Product = require("../models/Products");
const User = require("../models/User");

// get orders by user id
const getordersByUserId = async (req, res) => {
  const userId = req.id;

  try {
    const orders = await Orders.find({ userId })
      .populate({
        path: "products.id",
        select: "name price image category",
      })
      .sort({ updatedAt: -1, createdAt: -1 });

    if (!orders || orders.length === 0)
      return res
        .status(404)
        .json({ message: "No orders found", success: false });

    return res.status(200).json({ data: orders, success: true });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};

// get all orders
const getallorders = async (req, res) => {
  if (req.role !== roles.admin) {
    return res
      .status(403)
      .json({ message: "you are not authorized ", success: false });
  }
  const { limit, page } = req.query;

  try {
    const orders = await Orders.find()
      .populate({
        path: "products.id",
        select: "name price image category",
      })

      .populate({ path: "userId", select: "name email" })
      .limit(limit * 1)

      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    if (!orders || orders.length === 0)
      return res
        .status(404)
        .json({ message: "No orders found", success: false });

    const count = await Orders.countDocuments();

    return res.status(200).json({
      success: true,
      data: orders,
      totalPages: Math.ceil(count / limit),
      currentPage: Number(page),
    });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};
// update order status
const updateorderstatus = async (req, res) => {
  if (req.role !== roles.admin) {
    return res
      .status(403)
      .json({ message: "you are not authorized", success: false });
  }

  const { id } = req.params;
  const { status } = req.body;

  try {
    const order = await Orders.findByIdAndUpdate(
      id,
      { status, updatedAt: new Date() },
      { new: true, runValidators: true },
    ).populate({
      path: "products.id",
      select: "name price image category",
    });

    if (!order)
      return res
        .status(404)
        .json({ message: "Order not found", success: false });
    return res.status(200).json({
      message: "Order status updated successfully",
      success: true,
      data: order,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};
// get sales metrics
const getMetrics = async (req, res) => {
  if (req.role !== roles.admin) {
    return res
      .status(403)
      .json({ message: "you are not authorized", success: false });
  }

  const { startDate, endDate } = req.query;

  try {
    const now = new Date();
    const start = startDate
      ? new Date(startDate)
      : new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const end = endDate ? new Date(endDate) : now;

    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
      return res
        .status(400)
        .json({ message: "Invalid date range", success: false });
    }

    // total sales in the given date range
    const ordersInRange = await Orders.find({
      createdAt: { $gte: start, $lte: end },
    });
    const totalSales = ordersInRange.reduce(
      (acc, order) => acc + order.amount,
      0,
    );

    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    // monthly sales for the current month
    const thisMonthOrders = await Orders.find({
      createdAt: { $gte: currentMonthStart, $lte: now },
    });

    // monthly sales for the previous month
    const lastMonthOrders = await Orders.find({
      createdAt: { $gte: lastMonthStart, $lt: currentMonthStart },
    });

    // total sales for this month and last month
    const totalThisMonth = thisMonthOrders.reduce(
      (acc, order) => acc + order.amount,
      0,
    );

    const totalLastMonth = lastMonthOrders.reduce(
      (acc, order) => acc + order.amount,
      0,
    );

    const totalOrders = await Orders.countDocuments();
    //  calculate sales growth percentage
    const salesGrowth = totalLastMonth
      ? ((totalThisMonth - totalLastMonth) / totalLastMonth) * 100
      : 0;

    const thisMonthusers = await User.find({
      createdAt: { $gte: currentMonthStart, $lte: now },
    });

    const lastMonthusers = await User.find({
      createdAt: { $gte: lastMonthStart, $lt: currentMonthStart },
    });
    // calculate user growth percentage
    const userGrowth = lastMonthusers.length
      ? ((thisMonthusers.length - lastMonthusers.length) /
          lastMonthusers.length) *
        100
      : 0;
    // Last hour order growth percentage based on previous day's total orders
    const lastHour = new Date(now.getTime() - 60 * 60 * 1000);
    // get orders from the last hour
    const lastHourOrders = await Orders.find({
      createdAt: { $gte: lastHour, $lte: now },
    });
    // calculate last hour growth percentage
    const previousDayOrders = await Orders.find({
      createdAt: {
        $gte: new Date(now.getTime() - 24 * 60 * 60 * 1000),
        $lte: now,
      },
    });

    const lastHourGrowth = previousDayOrders.length
      ? (lastHourOrders.length / previousDayOrders.length) * 100
      : 0;

    //  get recent orders with user details
    const recentOrders = await Orders.find()
      .populate({
        path: "userId",
        select: "name email",
      })
      .sort({ createdAt: -1 })
      .limit(8);
    // get orders from the last 6 months with product details
    const sixMonthAgo = new Date(
      new Date().setMonth(new Date().getMonth() - 6),
    );

    const sixMonthOrders = await Orders.find({
      createdAt: { $gte: sixMonthAgo },
    }).populate({
      path: "products.id",
      select: "category",
    });

    // calculate monthwise sales for each category
    const monthwise = sixMonthOrders.reduce((acc, order) => {
      const month = new Date(order.createdAt).toLocaleString("default", {
        month: "short",
      });

      order.products.forEach((product) => {
        const category = product?.id?.category || "Unknown";

        if (!acc[month]) {
          acc[month] = {};
        }

        if (!acc[month][category]) {
          acc[month][category] = 1;
        } else {
          acc[month][category]++;
        }
      });

      return acc;
    });

    return res.status(200).json({
      success: true,
      data: {
        totalSales: {
          count: totalSales,
          growth: salesGrowth,
        },
        users: {
          count: thisMonthusers.length,
          growth: userGrowth,
        },
        Users: {
          count: thisMonthusers.length,
          growth: userGrowth,
        },
        sales: {
          count: totalThisMonth,
          growth: salesGrowth,
        },
        orders: {
          count: totalOrders,
          growth: 0,
        },
        activeNow: {
          count: lastHourOrders.length,
          growth: lastHourGrowth,
        },
        recentSales: {
          count: totalThisMonth,
          users: recentOrders,
        },
        sixMonthChartData: monthwise,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};

// Create order
const createOrder = async (req, res) => {
  const userId = req.id;
  const {
    amount,
    address,
    products,
    paymentMethod,
    customerName,
    customerPhone,
  } = req.body;

  try {
    if (!amount || !address || !products) {
      return res.status(400).json({
        message: "Missing required fields",
        success: false,
      });
    }

    const newOrder = new Orders({
      amount,
      address,
      customerName,
      customerPhone,
      paymentMethod: paymentMethod || "esewa",
      products: products.map((p) => ({
        id: p.id || p._id,
        quantity: p.quantity,
        color: "N/A",
      })),
      userId,
      status: "pending",
    });

    await newOrder.save();

    return res.status(201).json({
      message: "Order created successfully",
      success: true,
      data: newOrder,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

module.exports = {
  getordersByUserId,
  getallorders,
  updateorderstatus,
  getMetrics,
  createOrder,
};
