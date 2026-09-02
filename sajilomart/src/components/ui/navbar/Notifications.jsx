import React, { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import {
  Bell,
  CheckCheck,
  CreditCard,
  Loader2,
  PackageCheck,
  PackageX,
  RefreshCcw,
} from "lucide-react";

const filterOptions = ["all", "unread", "order", "success", "cod"];
const READ_NOTIFICATIONS_KEY = "admin_read_notifications";
const POLL_INTERVAL = 20000;

const typeUI = {
  order: {
    label: "Order",
    icon: PackageCheck,
    chip: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  },
  success: {
    label: "Success",
    icon: CreditCard,
    chip: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
  },
  cod: {
    label: "COD",
    icon: PackageX,
    chip: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  },
};

const formatRelativeTime = (isoDate) => {
  const timestamp = new Date(isoDate).getTime();
  if (Number.isNaN(timestamp)) return "unknown time";

  const diffSeconds = Math.floor((Date.now() - timestamp) / 1000);
  if (diffSeconds < 60) return "just now";

  const minutes = Math.floor(diffSeconds / 60);
  if (minutes < 60) return `${minutes} min${minutes > 1 ? "s" : ""} ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;

  const days = Math.floor(hours / 24);
  return `${days} day${days > 1 ? "s" : ""} ago`;
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

const formatOrderCode = (orderId) => {
  if (!orderId) return "#N/A";
  return `#${String(orderId).slice(-6).toUpperCase()}`;
};

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [activeFilter, setActiveFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [newAlertCount, setNewAlertCount] = useState(0);
  const knownOrderIdsRef = useRef(new Set());

  const getReadNotificationIds = () => {
    try {
      const value = localStorage.getItem(READ_NOTIFICATIONS_KEY);
      const ids = value ? JSON.parse(value) : [];
      return Array.isArray(ids) ? ids : [];
    } catch {
      return [];
    }
  };

  const setReadNotificationIds = (ids) => {
    localStorage.setItem(READ_NOTIFICATIONS_KEY, JSON.stringify(ids));
  };

  const buildNotificationsFromOrders = (orders) => {
    const readIds = new Set(getReadNotificationIds());
    const built = [];

    orders.forEach((order) => {
      const customerName =
        order?.customerName || order?.userId?.name || "Customer";
      const orderId = order?._id;
      const orderCode = formatOrderCode(orderId);
      const paymentMode =
        String(order?.paymentMethod || "").toUpperCase() === "COD"
          ? "COD"
          : "Online";

      if (!orderId) {
        return;
      }

      const orderNotificationId = `${orderId}-order`;
      built.push({
        id: orderNotificationId,
        title: "Order received",
        description: `Order ${orderCode} received from ${customerName}.`,
        type: "order",
        status: readIds.has(orderNotificationId) ? "read" : "unread",
        orderId,
        orderCode,
        paymentMode,
        eventAt: order?.createdAt,
      });

      const paymentType = getPaymentTypeFromOrder(order);
      if (paymentType) {
        const paymentNotificationId = `${orderId}-payment`;
        built.push({
          id: paymentNotificationId,
          title: paymentType === "success" ? "Payment successful" : "COD", // Changed from "COD order" to "COD"
          description:
            paymentType === "success"
              ? `${String(order?.paymentMethod || "Payment").toUpperCase()} payment completed for Order ${orderCode}.`
              : `Cash on Delivery selected for Order ${orderCode}.`,
          type: paymentType,
          status: readIds.has(paymentNotificationId) ? "read" : "unread",
          orderId,
          orderCode,
          paymentMode,
          eventAt: order?.updatedAt || order?.createdAt,
        });
      }
    });

    return built.sort(
      (a, b) => new Date(b.eventAt).getTime() - new Date(a.eventAt).getTime(),
    );
  };

  const fetchOrderNotifications = async (silent = false) => {
    const token = localStorage.getItem("token");
    if (!token || token === "undefined" || token === "null") {
      setNotifications([]);
      setIsLoading(false);
      setIsRefreshing(false);
      return;
    }

    try {
      if (silent) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }

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
      const latestOrderIds = new Set(orders.map((order) => order._id));

      if (knownOrderIdsRef.current.size > 0) {
        let incoming = 0;
        latestOrderIds.forEach((id) => {
          if (!knownOrderIdsRef.current.has(id)) {
            incoming += 1;
          }
        });
        if (incoming > 0) {
          setNewAlertCount((prev) => prev + incoming);
        }
      }

      knownOrderIdsRef.current = latestOrderIds;
      setNotifications(buildNotificationsFromOrders(orders));
    } catch (error) {
      if ([400, 401, 403, 404].includes(error?.response?.status)) {
        if ([400, 401].includes(error?.response?.status)) {
          localStorage.removeItem("token");
        }
        setNotifications([]);
        return;
      }
      console.error("Error fetching notifications:", error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrderNotifications(false);

    const pollTimer = setInterval(() => {
      fetchOrderNotifications(true);
    }, POLL_INTERVAL);

    return () => clearInterval(pollTimer);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setNotifications((prev) => [...prev]);
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  const counts = useMemo(() => {
    const unread = notifications.filter(
      (item) => item.status === "unread",
    ).length;
    const success = notifications.filter(
      (item) => item.type === "success",
    ).length;
    const cod = notifications.filter((item) => item.type === "cod").length;

    return {
      total: notifications.length,
      unread,
      success,
      cod,
    };
  }, [notifications]);

  const filteredNotifications = useMemo(() => {
    if (activeFilter === "all") {
      return notifications;
    }

    if (activeFilter === "unread") {
      return notifications.filter((item) => item.status === "unread");
    }

    return notifications.filter((item) => item.type === activeFilter);
  }, [activeFilter, notifications]);

  const markAllAsRead = () => {
    const ids = notifications.map((item) => item.id);
    setReadNotificationIds(ids);
    setNotifications((prev) =>
      prev.map((item) => ({ ...item, status: "read" })),
    );
    setNewAlertCount(0);
    window.dispatchEvent(new Event("notificationsMarkedAsRead")); // Dispatch event to update bell immediately
  };

  const markOneAsRead = (id) => {
    const readIds = new Set(getReadNotificationIds());
    readIds.add(id);
    setReadNotificationIds(Array.from(readIds));

    setNotifications((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: "read" } : item)),
    );
    window.dispatchEvent(new Event("notificationsMarkedAsRead")); // Dispatch event to update bell immediately
  };

  const refreshNow = async () => {
    setNewAlertCount(0);
    await fetchOrderNotifications(true);
  };

  return (
    <section className="w-full min-h-[70vh] rounded-2xl bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-900 border-2 border-zinc-200 dark:border-zinc-700 p-5 sm:p-6 lg:p-8 shadow-lg sm:shadow-xl">
      <div className="mb-6 text-center sm:text-left">
        <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
          Notifications
        </h1>
        <p className="mt-2 text-sm sm:text-base text-zinc-600 dark:text-zinc-400">
          Real-time notifications from your live orders with real order ID and
          real time.
        </p>
      </div>

      {newAlertCount > 0 && (
        <div className="mb-4 rounded-xl border border-orange-300 dark:border-orange-700 bg-orange-50 dark:bg-orange-900/20 px-4 py-3 flex items-center justify-between gap-3">
          <p className="text-sm font-semibold text-orange-700 dark:text-orange-300">
            {newAlertCount} new notification{newAlertCount > 1 ? "s" : ""}{" "}
            arrived.
          </p>
          <button
            onClick={() => setNewAlertCount(0)}
            className="px-3 py-1.5 rounded-md text-xs font-semibold bg-orange-500 text-white hover:bg-orange-600 transition-colors"
          >
            Dismiss
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-5">
        <div className="rounded-xl bg-white dark:bg-zinc-800 border-2 border-zinc-200 dark:border-zinc-700 p-4">
          <p className="text-xs text-zinc-500 dark:text-zinc-400">Total</p>
          <p className="text-2xl font-bold text-zinc-800 dark:text-zinc-100">
            {counts.total}
          </p>
        </div>
        <div className="rounded-xl bg-white dark:bg-zinc-800 border-2 border-zinc-200 dark:border-zinc-700 p-4">
          <p className="text-xs text-zinc-500 dark:text-zinc-400">Unread</p>
          <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
            {counts.unread}
          </p>
        </div>
        <div className="rounded-xl bg-white dark:bg-zinc-800 border-2 border-zinc-200 dark:border-zinc-700 p-4">
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Payment Success
          </p>
          <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
            {counts.success}
          </p>
        </div>
        <div className="rounded-xl bg-white dark:bg-zinc-800 border-2 border-zinc-200 dark:border-zinc-700 p-4">
          <p className="text-xs text-zinc-500 dark:text-zinc-400">COD Orders</p>
          <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
            {counts.cod}
          </p>
        </div>
      </div>

      <div className="rounded-xl sm:rounded-2xl bg-white dark:bg-zinc-800 border-2 border-zinc-200 dark:border-zinc-700 p-4 sm:p-5 min-h-[360px]">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <div className="flex flex-wrap gap-2">
            {filterOptions.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold capitalize border transition-all ${
                  activeFilter === filter
                    ? "bg-orange-500 text-white border-orange-500"
                    : "bg-slate-50 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={markAllAsRead}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-emerald-500 text-white hover:bg-emerald-600 transition-colors"
            >
              <CheckCheck className="w-4 h-4" />
              Mark all read
            </button>
            <button
              onClick={refreshNow}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-zinc-200 dark:bg-zinc-700 text-zinc-800 dark:text-zinc-100 hover:bg-zinc-300 dark:hover:bg-zinc-600 transition-colors"
            >
              {isRefreshing ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <RefreshCcw className="w-4 h-4" />
              )}
              Refresh
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="h-[260px] flex flex-col items-center justify-center text-center text-zinc-500 dark:text-zinc-400">
            <Loader2 className="w-10 h-10 mb-2 animate-spin" />
            <p className="text-sm">Loading notifications...</p>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="h-[260px] flex flex-col items-center justify-center text-center text-zinc-500 dark:text-zinc-400">
            <Bell className="w-10 h-10 mb-2" />
            <p className="text-sm">No notifications in this filter.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredNotifications.map((item) => {
              const itemType = typeUI[item.type] || typeUI.order;
              const TypeIcon = itemType.icon;

              return (
                <div
                  key={item.id}
                  className={`rounded-xl border p-4 flex items-start justify-between gap-3 ${
                    item.status === "unread"
                      ? "border-orange-300 dark:border-orange-700 bg-orange-50/60 dark:bg-orange-900/10"
                      : "border-zinc-200 dark:border-zinc-700 bg-slate-50/60 dark:bg-zinc-900/40"
                  }`}
                >
                  <div className="flex gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center shrink-0">
                      <TypeIcon className="w-4 h-4 text-zinc-700 dark:text-zinc-200" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">
                          {item.title}
                        </p>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${itemType.chip}`}
                        >
                          {itemType.label}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">
                        {item.description}
                      </p>
                      <p className="text-[11px] text-zinc-500 dark:text-zinc-500 mt-1">
                        Order ID: {item.orderCode}
                      </p>
                      <p className="text-[11px] text-zinc-500 dark:text-zinc-500 mt-1">
                        Payment:{" "}
                        {item.paymentMode === "COD" ? "💵 COD" : "🏦 Online"}
                      </p>
                      <p className="text-[11px] text-zinc-500 dark:text-zinc-500 mt-1.5">
                        {formatRelativeTime(item.eventAt)}
                      </p>
                    </div>
                  </div>

                  {item.status === "unread" ? (
                    <button
                      onClick={() => markOneAsRead(item.id)}
                      className="px-2.5 py-1.5 rounded-md text-[11px] font-semibold bg-orange-500 text-white hover:bg-orange-600 transition-colors shrink-0"
                    >
                      Mark read
                    </button>
                  ) : (
                    <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 shrink-0">
                      Read
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default Notifications;
