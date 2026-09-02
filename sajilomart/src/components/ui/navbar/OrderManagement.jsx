import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card } from "../card";
import Ordermanegementdisplay from "./Ordermanegementdisplay";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../pagination";

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  // CHANGED: Added state to track which order is being updated
  const [updatingOrderId, setUpdatingOrderId] = useState(null);
  // CHANGED: Added state to show status update errors
  const [statusUpdateError, setStatusUpdateError] = useState(null);
  const ordersPerPage = 4;

  // CHANGED: Added status options for order status dropdown with separate value and display
  const statusOptions = [
    { value: "pending", label: "⏳ Pending" },
    { value: "shipped", label: "🚚 Shipped" },
    { value: "delivered", label: "✅ Delivered" },
    { value: "cancelled", label: "❌ Cancelled" },
  ];

  // CHANGED: Helper function to get status display with icon
  const getStatusDisplay = (status) => {
    const statusOption = statusOptions.find((opt) => opt.value === status);
    return statusOption ? statusOption.label : status;
  };

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem("token");
      if (!token || token === "undefined" || token === "null") {
        setOrders([]);
        setError("Please login again");
        return;
      }

      try {
        setError(null);
        setLoading(true);
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/getallorders?limit=100&page=1`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        const { data } = res.data;
        // Sort orders by createdAt in descending order (newest first)
        const sortedOrders =
          data?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) ||
          [];
        setOrders(sortedOrders);
        setCurrentPage(1);
      } catch (error) {
        const status = error?.response?.status;
        if ([400, 401].includes(status)) {
          localStorage.removeItem("token");
          setError("Session expired. Please login again.");
        } else if (status === 403) {
          setError("Admin access required.");
        } else if (status === 404) {
          setOrders([]);
          setError(null);
        } else {
          setError(error?.response?.data?.message || error.message);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  // CHANGED: NEW FUNCTION - Handle order status updates
  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingOrderId(orderId);
    setStatusUpdateError(null);
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_API_URL}/updateorderstatus/${orderId}`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      if (res.data.success) {
        // Update the orders state with the new status
        setOrders(
          orders.map((order) =>
            order._id === orderId ? { ...order, status: newStatus } : order,
          ),
        );
      }
    } catch (err) {
      setStatusUpdateError(err.response?.data?.message || err.message);
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const totalPages = Math.ceil(orders.length / ordersPerPage);
  const startIndex = (currentPage - 1) * ordersPerPage;
  const endIndex = startIndex + ordersPerPage;
  const paginatedOrders = orders.slice(startIndex, endIndex);

  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-900 p-4 sm:p-6 lg:p-8">
      <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent mb-8 text-center">
        📦 Order Management
      </h1>
      <div className="space-y-6 max-w-6xl mx-auto">
        {loading && (
          <h1 className="text-center text-zinc-600 dark:text-zinc-300">
            ⏳ Loading orders...
          </h1>
        )}

        {error && !loading && (
          <div className="bg-red-100 dark:bg-red-900/20 border-2 border-red-600 rounded-lg p-4">
            <p className="text-red-700 dark:text-red-400 font-semibold">
              ❌ Error: {error}
            </p>
          </div>
        )}

        {!loading && orders.length === 0 && !error && (
          <h1 className="text-center text-zinc-600 dark:text-zinc-300">
            No orders to show
          </h1>
        )}

        {!loading &&
          paginatedOrders.length > 0 &&
          paginatedOrders.map((item) => (
            <Card
              key={item._id}
              className="p-6 space-y-5 shadow-xl border-2 border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 rounded-2xl"
            >
              {/* Products */}
              <div className="space-y-4">
                {item?.products?.map((product, idx) => {
                  const productData = product?.id || product;
                  return (
                    <Ordermanegementdisplay
                      key={`${item._id}-${product._id || idx}`}
                      id={productData?._id}
                      name={productData?.name}
                      price={productData?.price}
                      quantity={product?.quantity}
                      image={productData?.image}
                    />
                  );
                })}
              </div>

              <hr className="border-zinc-200 dark:border-zinc-700" />

              {/* Customer Details - Name & Phone */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Customer Name */}
                <div className="p-4 bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 rounded-lg border-2 border-cyan-300 dark:border-cyan-700 shadow-md">
                  <p className="text-xs font-bold text-cyan-700 dark:text-cyan-400 uppercase mb-2">
                    👤 Customer Name
                  </p>
                  <p className="text-lg font-bold text-cyan-900 dark:text-cyan-200">
                    {item?.customerName || "N/A"}
                  </p>
                </div>

                {/* Customer Phone */}
                <div className="p-4 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-lg border-2 border-emerald-300 dark:border-emerald-700 shadow-md">
                  <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase mb-2">
                    📱 Phone Number
                  </p>
                  <p className="text-lg font-bold text-emerald-900 dark:text-emerald-200">
                    {item?.customerPhone || "N/A"}
                  </p>
                </div>
              </div>

              <hr className="border-zinc-200 dark:border-zinc-700" />

              {/* Info Grid - 4 Columns */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                {/* Order ID */}
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <p className="text-xs font-bold text-blue-700 dark:text-blue-400 uppercase mb-1">
                    Order ID
                  </p>
                  <p className="font-bold text-blue-600 dark:text-blue-400">
                    #{item?._id?.slice(-6).toUpperCase()}
                  </p>
                </div>

                {/* Date */}
                <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                  <p className="text-xs font-bold text-purple-700 dark:text-purple-400 uppercase mb-1">
                    Date
                  </p>
                  <p className="font-bold text-purple-600 dark:text-purple-400">
                    {new Date(item?.updatedAt || item?.createdAt).toLocaleString()}
                  </p>
                </div>

                {/* Payment Method */}
                <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                  <p className="text-xs font-bold text-green-700 dark:text-green-400 uppercase mb-1">
                    Payment
                  </p>
                  <p className="font-bold text-green-600 dark:text-green-400">
                    {item?.paymentMethod?.toUpperCase() === "COD"
                      ? "💵 COD"
                      : "🏦 Online"}
                  </p>
                </div>

                {/* Status */}
                <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
                  <p className="text-xs font-bold text-orange-700 dark:text-orange-400 uppercase mb-1">
                    Status
                  </p>
                  <p className="font-bold text-orange-600 dark:text-orange-400">
                    {getStatusDisplay(item?.status)}
                  </p>
                </div>
              </div>

              {/* Address & Amount */}
              <div className="grid md:grid-cols-2 gap-4">
                {/* Address */}
                <div className="p-4 bg-slate-50 dark:bg-slate-900/20 rounded-lg border border-slate-200 dark:border-slate-700">
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-400 uppercase mb-2">
                    📍 Address
                  </p>
                  <p className="text-sm text-slate-700 dark:text-slate-300">
                    {item?.address || "N/A"}
                  </p>
                </div>

                {/* Total Amount */}
                <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <p className="text-xs font-bold text-blue-700 dark:text-blue-400 uppercase mb-2">
                    💰 Total Amount
                  </p>
                  <p className="text-2xl font-black text-blue-600 dark:text-blue-400">
                    Rs. {item?.amount || 0}
                  </p>
                </div>
              </div>

              {/* CHANGED: NEW SECTION - Status Change Dropdown */}
              <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-lg border border-amber-200 dark:border-amber-700">
                <div className="flex flex-col gap-3">
                  <div>
                    <p className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase mb-2">
                      ✏️ Update Order Status
                    </p>
                    <select
                      value={item?.status || "pending"}
                      onChange={(e) =>
                        handleStatusChange(item._id, e.target.value)
                      }
                      disabled={updatingOrderId === item._id}
                      className="w-full p-3 border border-amber-300 dark:border-amber-600 rounded-lg bg-white dark:bg-zinc-800 text-amber-900 dark:text-amber-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:border-amber-400 transition"
                    >
                      {statusOptions.map((status) => (
                        <option key={status.value} value={status.value}>
                          {status.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  {updatingOrderId === item._id && (
                    <p className="text-xs text-amber-600 dark:text-amber-400 font-medium">
                      ⏳ Updating status...
                    </p>
                  )}
                  {statusUpdateError && (
                    <p className="text-xs text-red-600 dark:text-red-400 font-medium">
                      ❌ {statusUpdateError}
                    </p>
                  )}
                </div>
              </div>
            </Card>
          ))}

        {!loading && !error && orders.length > 0 && totalPages > 1 && (
          <div className="mt-8 rounded-2xl border border-zinc-200/80 bg-white/80 backdrop-blur-sm shadow-md px-4 py-5 dark:border-zinc-700 dark:bg-zinc-900/70 space-y-4">
            <p className="text-center text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Showing {startIndex + 1}-{Math.min(endIndex, orders.length)} of{" "}
              {orders.length} orders
            </p>
            <Pagination className="justify-center">
              <PaginationContent className="flex-wrap gap-2">
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    className={
                      currentPage === 1
                        ? "pointer-events-none opacity-40 rounded-xl border border-zinc-200 dark:border-zinc-700"
                        : "cursor-pointer rounded-xl border border-zinc-200 hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
                    }
                  />
                </PaginationItem>

                {Array.from(
                  { length: totalPages },
                  (_, index) => index + 1,
                ).map((page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      isActive={currentPage === page}
                      onClick={() => setCurrentPage(page)}
                      className="cursor-pointer rounded-xl border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}

                <PaginationItem>
                  <PaginationNext
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    className={
                      currentPage === totalPages
                        ? "pointer-events-none opacity-40 rounded-xl border border-zinc-200 dark:border-zinc-700"
                        : "cursor-pointer rounded-xl border border-zinc-200 hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderManagement;
