import React from "react";

const Ordermanegementdisplay = ({ id, name, price, quantity, image }) => {
  let productImage = "https://via.placeholder.com/150?text=No+Image";
  if (image) {
    if (typeof image === "string") {
      productImage = image;
    } else if (Array.isArray(image) && image[0]) {
      // Image is array of {url, id} objects from backend
      if (typeof image[0] === "object") {
        productImage = image[0].url || image[0].URL || productImage;
      } else if (typeof image[0] === "string") {
        productImage = image[0];
      }
    } else if (typeof image === "object" && (image.url || image.URL)) {
      productImage = image.url || image.URL;
    }
  }

  return (
    <div className="w-full">
      {/* Product Card */}
      <div className="w-full flex flex-col sm:flex-row items-start sm:items-center rounded-xl sm:rounded-2xl bg-white dark:bg-zinc-800 border-2 border-zinc-200 dark:border-zinc-700 shadow-xl hover:shadow-2xl hover:scale-[1.01] hover:border-orange-400 dark:hover:border-orange-500 transition-all duration-300 overflow-hidden">
        {/* Product Image */}
        <img
          src={productImage}
          alt={name || "Product"}
          className="w-full sm:w-36 lg:w-40 h-36 sm:h-32 lg:h-36 object-cover rounded-t-xl sm:rounded-l-2xl sm:rounded-tr-none border-b-2 sm:border-b-0 sm:border-r-2 border-zinc-200 dark:border-zinc-700 ring-2 ring-zinc-100 dark:ring-zinc-700"
          onError={(e) =>
            (e.target.src = "https://via.placeholder.com/150?text=No+Image")
          }
        />

        {/* Product Info */}
        <div className="flex flex-col sm:flex-1 sm:flex-row sm:justify-between items-start sm:items-center p-4 sm:p-5 lg:p-6 gap-4 sm:gap-6 lg:gap-8 w-full">
          {/* Product Name */}
          <h1 className="font-bold text-lg sm:text-xl lg:text-2xl bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent flex items-center gap-2">
            <span className="text-2xl">📦</span> {name || "Product"}
          </h1>

          {/* Product Details */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-6 lg:gap-8 text-sm sm:text-base text-zinc-700 dark:text-zinc-300 w-full sm:w-auto">
            {/* Quantity */}
            <div className="flex items-center gap-2 mb-3 sm:mb-0 px-3 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <span className="font-semibold text-blue-700 dark:text-blue-400">
                📦 Qty:
              </span>
              <span className="ml-1 font-bold text-blue-800 dark:text-blue-300 text-lg">
                {quantity || 1}
              </span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
              <span className="font-semibold text-orange-700 dark:text-orange-400">
                💰 Price:
              </span>
              <span className="ml-1 font-bold text-orange-600 dark:text-orange-400 text-lg">
                Rs. {price || 0}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Ordermanegementdisplay;
