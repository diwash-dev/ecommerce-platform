import React, { memo, useCallback } from "react";
import { Minus, Plus } from "lucide-react";

const QuantityCounter = memo(
  ({ quantity, onDecrement, onIncrement, maxStock }) => {
    return (
      <div className="flex items-center bg-zinc-100 dark:bg-zinc-700 rounded-xl border-2 border-zinc-300 dark:border-zinc-600 shadow-lg">
        {/* Minus Button */}
        <button
          onClick={onDecrement}
          className="p-4 hover:bg-zinc-200 dark:hover:bg-zinc-600 transition-colors rounded-l-xl active:scale-95"
        >
          <Minus className="h-5 w-5" />
        </button>

        {/* Quantity Number */}
        <span className="px-6 py-4 text-2xl font-bold min-w-[80px] text-center">
          {quantity}
        </span>

        {/* Plus Button */}
        <button
          onClick={onIncrement}
          className="p-4 hover:bg-zinc-200 dark:hover:bg-zinc-600 transition-colors rounded-r-xl active:scale-95"
        >
          <Plus className="h-5 w-5" />
        </button>
      </div>
    );
  },
);

QuantityCounter.displayName = "QuantityCounter";

export default QuantityCounter;
