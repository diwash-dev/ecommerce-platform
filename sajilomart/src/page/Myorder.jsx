import React, { useEffect, useState } from "react";
import Order from "@/components/ui/navbar/order";
import Error from "@/hooks/Error";
import axios from "axios";

const Myorder = () => {
  const [orders, setOrders] = useState([]);

  const { handleErrorLogout } = Error();

  useEffect(() => {
    const getMyOrders = async () => {
      const token = localStorage.getItem("token");
      if (!token || token === "undefined" || token === "null") {
        setOrders([]);
        return;
      }

      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/getordersbyuserid?ts=${Date.now()}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        const { data } = res.data;
        if (data && Array.isArray(data)) {
          // Show most recently changed orders first.
          const sortedOrders = [...data].sort(
            (a, b) =>
              new Date(b.updatedAt || b.createdAt) -
              new Date(a.updatedAt || a.createdAt),
          );
          setOrders(sortedOrders);
        } else {
          setOrders([]);
        }
      } catch (error) {
        return handleErrorLogout(error, "Failed to fetch orders");
      }
    };

    getMyOrders();

    const intervalId = setInterval(getMyOrders, 15000);
    const handleFocus = () => getMyOrders();
    window.addEventListener("focus", handleFocus);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener("focus", handleFocus);
    };
  }, [handleErrorLogout]);

  // Fetch orders from backend (placeholder function)
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-purple-50 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-900 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl lg:text-5xl font-bold text-zinc-900 dark:text-white mb-2">
            My Orders
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            Track and manage your purchases
          </p>
        </div>

        {/* Orders List */}
        <div className="grid gap-6">
          {orders.length === 0 ? (
            <h1 className="text-xl text-center text-zinc-700 dark:text-zinc-300">
              No orders to show
            </h1>
          ) : (
            orders.map((order) => <Order key={order._id} {...order} />)
          )}
        </div>
      </div>
    </div>
  );
};

export default Myorder;
