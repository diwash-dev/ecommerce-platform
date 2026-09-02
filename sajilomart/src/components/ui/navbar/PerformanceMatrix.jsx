import React, { useEffect, useState } from "react";
import { SidebarInset } from "../sidebar";
import {
  ActivityIcon,
  LucideCreditCard,
  ShoppingCart,
  Users2Icon,
} from "lucide-react";
import Chart from "./Chart";
import Error from "@/hooks/Error";
import axios from "axios";

const PerformanceMatrix = () => {
  const [metrics, setMetrics] = useState({});
  const { handleErrorLogout } = Error();

  const formatCompactAmount = (amount) =>
    new Intl.NumberFormat("en", {
      notation: "compact",
      maximumFractionDigits: 0,
    }).format(Number(amount || 0));

  useEffect(() => {
    const getMetrics = async () => {
      try {
        const res = await axios.get(
          import.meta.env.VITE_API_URL + "/getmetrics",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        );
        const { data } = res.data;
        setMetrics(data);
      } catch (error) {
        return handleErrorLogout(error);
      }
    };
    getMetrics();
  }, []);

  return (
    <div className="  w-full min-h-screen flex justify-center items-center  sm:px-6 lg:px-8">
      <SidebarInset className="rounded-lg bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-900">
        <div className="rounded-2xl flex flex-1 flex-col gap-4 sm:gap-6 lg:gap-8 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          <div className="mb-2 sm:mb-4 text-center">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent mb-2 sm:mb-3">
              📦Performance Dashboard
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-zinc-600 dark:text-zinc-400 mt-1 sm:mt-2">
              Track your business metrics
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
            <div className="h-fit p-4 sm:p-5 lg:p-6 rounded-xl sm:rounded-2xl bg-white dark:bg-zinc-800 shadow-lg sm:shadow-xl border-2 border-zinc-200 dark:border-zinc-700 hover:shadow-2xl hover:scale-105 transition-all duration-300">
              <div className="flex justify-between items-center mb-3 sm:mb-4">
                <h3 className="text-sm sm:text-base lg:text-lg font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wide">
                  💰 Total Sales
                </h3>
                <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 shadow-lg">
                  <LucideCreditCard
                    size={20}
                    className="sm:w-[22px] sm:h-[22px] text-white"
                  />
                </div>
              </div>
              <div className="grid gap-2 min-w-0">
                <span className="block w-full min-w-0 break-all leading-tight text-2xl sm:text-3xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
                  ₨ {formatCompactAmount(metrics?.totalSales?.count)}
                </span>
              </div>
            </div>
            {/* users */}
            <div className="h-fit p-4 sm:p-5 lg:p-6 rounded-xl sm:rounded-2xl bg-white dark:bg-zinc-800 shadow-lg sm:shadow-xl border-2 border-zinc-200 dark:border-zinc-700 hover:shadow-2xl hover:scale-105 transition-all duration-300">
              <div className="flex justify-between items-center mb-3 sm:mb-4">
                <h3 className="text-sm sm:text-base lg:text-lg font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wide">
                  👥 Users
                </h3>
                <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 shadow-lg">
                  <Users2Icon
                    size={20}
                    className="sm:w-[22px] sm:h-[22px] text-white"
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <span className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent">
                  {metrics?.users?.count ?? metrics?.Users?.count ?? 0}
                </span>
              </div>
            </div>
            {/* sales */}
            <div className="h-fit p-4 sm:p-5 lg:p-6 rounded-xl sm:rounded-2xl bg-white dark:bg-zinc-800 shadow-lg sm:shadow-xl border-2 border-zinc-200 dark:border-zinc-700 hover:shadow-2xl hover:scale-105 transition-all duration-300">
              <div className="flex justify-between items-center mb-3 sm:mb-4">
                <h3 className="text-sm sm:text-base lg:text-lg font-bold text-zinc-900 dark:text-zinc-300 uppercase tracking-wide">
                  📈 Sales
                </h3>
                <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-r from-blue-900 to-blue-600 shadow-lg">
                  <ActivityIcon
                    size={20}
                    className="sm:w-[22px] sm:h-[22px] text-white"
                  />
                </div>
              </div>
              <div className="grid gap-2 min-w-0">
                <span className="block w-full min-w-0 break-all leading-tight text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-900 to-blue-200 bg-clip-text text-transparent">
                  ₨ {formatCompactAmount(metrics?.sales?.count)}
                </span>
              </div>
            </div>

            <div className="h-fit p-4 sm:p-5 lg:p-6 rounded-xl sm:rounded-2xl bg-white dark:bg-zinc-800 shadow-lg sm:shadow-xl border-2 border-zinc-200 dark:border-zinc-700 hover:shadow-2xl hover:scale-105 transition-all duration-300">
              <div className="flex justify-between items-center mb-3 sm:mb-4">
                <h3 className="text-sm sm:text-base lg:text-lg font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wide">
                  🛒 Total Order
                </h3>
                <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-r from-purple-500 to-purple-600 shadow-lg">
                  <ShoppingCart
                    size={20}
                    className="sm:w-[22px] sm:h-[22px] text-white"
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <span className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-500 to-purple-600 bg-clip-text text-transparent">
                  {metrics?.orders?.count ?? 0}
                </span>
              </div>
            </div>
          </div>

          {/*-----------------------------------------  Cart  design------------------------------------------ */}

          <div className=" flex flex-col sm:flex-row gap-3 ">
            <Chart />
          </div>
        </div>
      </SidebarInset>
    </div>
  );
};

export default PerformanceMatrix;
