import React, { useEffect } from "react";
import Filtermenu from "@/components/ui/navbar/Filtermenu";
import { Itemlist } from "@/components/ui/navbar/Itemlist";

const Products = () => {
  useEffect(() => {
    // Scroll to top when page loads with a small delay to ensure page is rendered
    const scrollTimer = setTimeout(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }, 0);
    
    return () => clearTimeout(scrollTimer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-900 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-12 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent dark:from-indigo-400 dark:to-purple-400 mb-4">
            Our Products
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-300">
            Browse our collection of premium products
          </p>
        </div>
        <Filtermenu />
        <Itemlist />
      </div>
    </div>
  );
};

export default Products;
