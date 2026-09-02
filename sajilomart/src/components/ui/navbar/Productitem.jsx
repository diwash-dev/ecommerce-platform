import React from "react";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const Productitem = ({
  name,
  price,
  quantity,
  image,
  _id,
  rating,
  stock,
  blacklistek,
  onRemove,
}) => {


  const navigate =useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth );
  return (
    <div className="flex items-center gap-3 p-3 bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 hover:shadow-md transition-shadow">
      {/* Product Image */}
      <img
        src={image}
        alt={name}
        className="w-16 h-16 object-cover rounded-md flex-shrink-0"
      />

      {/* Product Details */}
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
          {name}
        </h3>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            Rs {price} × {quantity}
          </span>
        </div>
        <div className="text-sm font-bold text-gray-900 dark:text-white mt-1">
          Rs {(price * quantity).toFixed(2)}
        </div>
      </div>

      {/* Remove Button */}
      <button 
        onClick={() => onRemove?.({ _id, price, quantity })}
        className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-full transition-colors"
      >
        <X className="w-4 h-4 text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300" />
      </button>
    </div>
  );
};

export default Productitem;
