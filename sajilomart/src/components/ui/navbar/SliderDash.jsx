import {
  AlertCircle,
  BarChart2,
  Bell,
  BellRing,
  Box,
  BoxIcon,
  Calendar,
  CirclePlus,
  Clipboard,
  Home,
  Inbox,
  PlusIcon,
  Search,
  Settings,
  Settings2,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "../button";
import { useDispatch } from "react-redux";
import { setUserLogout } from "@/Redux/ReduxSlice/authslice";
import { useState, useEffect } from "react";
import axios from "axios";
import { Toggle } from "./Toggle";

// Menu items.
const items = [
  {
    title: "Orders management",
    url: "/dashboard/orderManagement",
    icon: Clipboard,
  },
  {
    title: "Add Products",
    url: "/dashboard/addproducts",
    icon: CirclePlus,
  },
  {
    title: "Products management",
    url: "/dashboard/productsmanagement",
    icon: BoxIcon,
  },
  {
    title: "Performance Metrics",
    url: "/dashboard/performanceMatrix",
    icon: BarChart2,
  },
  {
    title: "Notifications",
    url: "/dashboard/notifications",
    icon: Bell,
  },
  {
    title: "Store Settings",
    url: "/dashboard/storesettings",
    icon: Settings2,
  },
];

const SliderDash = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [unreadCount, setUnreadCount] = useState(0); // Track unread notifications for sidebar badge

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

    // Poll for notification updates every 30 seconds
    const pollTimer = setInterval(() => {
      fetchNotifications();
    }, 30000);

    return () => clearInterval(pollTimer);
  }, []);

  const handleLogout = () => {
    // Redux state clear
    dispatch(setUserLogout());
    // localStorage manually verify गर्न
    localStorage.clear();
    // Admin login redirect
    navigate("/adminlogin");
    // Page reload गर्न to reset all state
    window.location.reload();
  };

  return (
    <Sidebar className="bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700">
      <SidebarHeader className="text-3xl font-bold px-6 py-6 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
        <span className="text-orange-600 dark:text-orange-500">
          Admin Panel
        </span>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu className="space-y-2 px-2 py-4">
            {items.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  className={`relative rounded-lg transition-all duration-200 ${
                    pathname === item.url
                      ? "bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 font-semibold shadow-sm border-l-4 border-indigo-600 dark:border-indigo-400"
                      : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                >
                  <Link to={item.url} className="gap-3 px-4 py-2.5">
                    <item.icon size={20} />
                    <span className="text-base">{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="px-6 py-6 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
        <Button
          onClick={() => dispatch(setUserLogout())}
          className="w-full bg-gradient-to-r from-orange-500 to-orange-600 dark:from-orange-600 dark:to-orange-700 text-white font-semibold py-2.5 px-4 rounded-lg hover:from-orange-600 hover:to-orange-700 dark:hover:from-orange-700 dark:hover:to-orange-800 transition-all duration-200 shadow-md hover:shadow-lg focus:outline-none"
        >
          Logout
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
};

export default SliderDash;
