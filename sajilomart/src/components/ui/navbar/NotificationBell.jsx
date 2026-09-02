import React, { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const NotificationBell = () => {
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();

  const READ_NOTIFICATIONS_KEY = "admin_read_notifications";

  const getReadNotificationIds = () => {
    try {
      const value = localStorage.getItem(READ_NOTIFICATIONS_KEY);
      const ids = value ? JSON.parse(value) : [];
      return Array.isArray(ids) ? ids : [];
    } catch {
      return [];
    }
  };

  const getPaymentTypeFromOrder = (order) => {
    const paymentMethod = String(order?.paymentMethod || "").toLowerCase();
    if (paymentMethod === "cod") {
      return "cod";
    }
    if (["esewa", "khalti", "fonepay"].includes(paymentMethod)) {
      return "success";
    }
    return null;
  };

  const fetchNotifications = async () => {
    const token = localStorage.getItem("token");
    if (!token || token === "undefined" || token === "null") {
      setUnreadCount(0);
      return;
    }

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/getallorders?limit=50&page=1`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const orders = Array.isArray(response?.data?.data)
        ? response.data.data
        : [];
      const readIds = new Set(getReadNotificationIds());

      let unread = 0;
      orders.forEach((order) => {
        const orderId = order?._id;
        if (!orderId) return;

        const orderNotificationId = `${orderId}-order`;
        if (!readIds.has(orderNotificationId)) {
          unread += 1;
        }

        const paymentType = getPaymentTypeFromOrder(order);
        if (paymentType) {
          const paymentNotificationId = `${orderId}-payment`;
          if (!readIds.has(paymentNotificationId)) {
            unread += 1;
          }
        }
      });

      setUnreadCount(unread);
    } catch (error) {
      if ([400, 401, 403, 404].includes(error?.response?.status)) {
        if ([400, 401].includes(error?.response?.status)) {
          localStorage.removeItem("token");
        }
        setUnreadCount(0);
        return;
      }
      console.error("Error fetching notifications:", error);
    }
  };

  useEffect(() => {
    fetchNotifications();

    const pollTimer = setInterval(() => {
      fetchNotifications();
    }, 30000);

    const handleStorageChange = (e) => {
      // Listen for storage changes from other tabs when notifications are marked as read
      if (e.key === READ_NOTIFICATIONS_KEY) {
        fetchNotifications();
      }
    };

    const handleNotificationsMarkedAsRead = () => {
      // Listen for custom event when marked as read in same tab
      fetchNotifications();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener(
      "notificationsMarkedAsRead",
      handleNotificationsMarkedAsRead,
    );

    return () => {
      clearInterval(pollTimer);
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener(
        "notificationsMarkedAsRead",
        handleNotificationsMarkedAsRead,
      );
    };
  }, []);

  return (
    <button
      onClick={() => navigate("/dashboard/notifications")}
      className="relative p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-lg transition-colors"
    >
      <Bell className="w-6 h-6" />
      {/* Red badge showing unread notification count */}
      {unreadCount > 0 && (
        <span className="absolute top-0 right-0 flex items-center justify-center w-5 h-5 text-xs font-bold bg-red-500 text-white rounded-full">
          {unreadCount > 9 ? "9+" : unreadCount}
        </span>
      )}
    </button>
  );
};

export default NotificationBell;
