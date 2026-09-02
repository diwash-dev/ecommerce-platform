import { Star } from "lucide-react";
import React, { memo } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Linkbutton from "./Linkbutton";
import { starsGenerator } from "@/const/Help";

// Memoized component - only re-renders when props actually change
const ItemCart = memo(function ItemCart({
  name = "Product Title",
  price = 1000,
  rating = 3.5,
  images = {
    url: "https://images.unsplash.com/photo-1636489948870-058e57b5f7d9?q=80&w=1172&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    id: "38383",
  },
}) {
  const productSlug = encodeURIComponent(
    (name || "").trim().replace(/\s+/g, "-"),
  );

  // Normalize image source from different formats
  const imageSrc =
    typeof images === "string"
      ? images
      : Array.isArray(images)
        ? (images[0]?.url ?? images[0])
        : (images?.url ??
          "https://images.unsplash.com/photo-1636489948870-058e57b5f7d9?q=80&w=1172&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D");

  // ------------------cart design----------------

  return (
    <div className="group relative w-full overflow-hidden rounded-2xl sm:rounded-3xl border border-slate-200 bg-gradient-to-br from-white via-slate-50/50 to-white shadow-md transition-all duration-300 hover:shadow-2xl dark:border-zinc-700 dark:from-zinc-900 dark:via-zinc-800/50 dark:to-zinc-900">
      <div className="relative overflow-hidden">
        <img
          src={imageSrc}
          alt={name}
          className="h-[12rem] sm:h-[14rem] md:h-[16rem] w-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </div>

      <div className="grid gap-2 sm:gap-3 p-3 sm:p-4 md:p-5">
        <h2 className="line-clamp-2 text-base sm:text-lg font-bold text-slate-900 dark:text-white">
          {name}
        </h2>

        <div className="flex items-center justify-between gap-2">
          <div className="flex gap-0.5 text-amber-400 text-sm sm:text-base">
            {starsGenerator(rating)}
          </div>

          <span className="rounded-lg bg-rose-50 px-2 sm:px-3 py-1 text-xs sm:text-sm font-bold text-rose-600 dark:bg-rose-500/10 dark:text-rose-400">
            Rs. {price}
          </span>
        </div>
        <Link to={`/product/${productSlug}`}>
          <Button
            size="lg"
            className="w-full rounded-xl sm:rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:from-purple-600 hover:to-indigo-600 hover:shadow-xl dark:from-indigo-500 dark:to-purple-500"
          >
            Shop Now
          </Button>
        </Link>
        {/* <Linkbutton to = {`/product/${images.id}`} text="View Product" /> */}
      </div>
    </div>
  );
});

ItemCart.displayName = "ItemCart";
export default ItemCart;
