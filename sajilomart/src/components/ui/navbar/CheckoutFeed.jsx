import { colors } from "@/const/color";
import React from "react";

const Checkoutfeed = ({
  price = 460,
  quantity = 5,
  name = "Gun",
  image = {
    URL: "https://images.unsplash.com/photo-1591123720164-de1348028a82?q=80&w=1025&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  color = colors.Yellow,
}) => {
  return (
    <div className="flex items-center gap-4 lg:gap-6 p-5 lg:p-6 rounded-2xl bg-white dark:bg-zinc-800 border-2 border-zinc-200 dark:border-zinc-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-blue-300 dark:hover:border-blue-600">
      {/*---------------------- Left: Image + Name + Price -------------------*/}

      <div className="flex items-center gap-4 lg:gap-6 flex-1">
        <div className="w-20 h-20 lg:w-24 lg:h-24 flex-shrink-0 overflow-hidden rounded-xl ring-4 ring-blue-100 dark:ring-blue-900/30 shadow-md">
          <img
            src={image.URL}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
          />
        </div>
        <div className="flex flex-col gap-2 flex-1 min-w-0">
          <h1 className="text-lg lg:text-xl font-bold text-zinc-900 dark:text-white break-words leading-snug">
            {name}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-sm lg:text-base">
            <span className="font-semibold text-zinc-700 dark:text-zinc-300">
              Qty:{" "}
              <span className="font-bold text-blue-600 dark:text-blue-400">
                {quantity}
              </span>
            </span>

            <span className="w-px h-4 bg-zinc-300 dark:bg-zinc-600"></span>

            <span className="font-semibold text-zinc-700 dark:text-zinc-300">
              Price:{" "}
              <span className="font-bold text-red-600 dark:text-red-500">
                Rs. {price}
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkoutfeed;
