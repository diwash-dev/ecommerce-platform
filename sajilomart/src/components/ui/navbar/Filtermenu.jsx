import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "../input";
import { Search, Tag } from "lucide-react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { setProducts } from "@/Redux/ReduxSlice/sliceproduct";

// Custom debounce hook - prevents API spam
const useDebounce = (value, delay = 400) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};

const categoryData = {
  Trigger: "Category",
  items: [
    "All",
    "Monitor",
    "Laptop",
    "Mobile",
    "Camera",
    "RAM",
    "Speaker",
    "Headphone",
    "Mouse",
    "Keyboard",
  ],
};
const priceData = {
  Trigger: "Price",
  items: [
    "All",
    "3000",
    "5000",
    "10000",
    "20000",
    "50000",
    "100000",
    "200000",
    "500000",
  ],
};

const Filtermenu = () => {
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();

  // Debounce all filter values - prevents API spam on every keystroke
  const debouncedCategory = useDebounce(category, 300);
  const debouncedPrice = useDebounce(price, 300);
  const debouncedSearch = useDebounce(search, 500);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    const getFilteredProducts = async () => {
      try {
        const params = new URLSearchParams();
        if (debouncedCategory.trim() && debouncedCategory !== "All")
          params.append("category", debouncedCategory.trim());
        if (debouncedPrice) params.append("price", debouncedPrice);
        if (debouncedSearch.trim())
          params.append("search", debouncedSearch.trim());

        const queryString = params.toString();
        const url = `${import.meta.env.VITE_API_URL}/get-product${queryString ? `?${queryString}` : ""}`;

        const res = await axios.get(url);
        if (isMounted) {
          const data = res.data;
          dispatch(setProducts(data?.data ?? []));
        }
      } catch (error) {
        if (isMounted) {
          if (error?.response?.status === 404) {
            dispatch(setProducts([]));
            return;
          }
          console.error("Error fetching products:", error);
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    // Delay execution to wait for debounced values
    const timeoutId = setTimeout(getFilteredProducts, 100);

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [debouncedCategory, debouncedPrice, debouncedSearch, dispatch]);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-1 lg:py-1 ">
      {/* Main container with gradient, shadow, and padding */}

      <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-zinc-900 dark:to-zinc-800 rounded-2xl shadow-lg p-5 lg:p-6 border border-gray-200 dark:border-zinc-700">
        <div className="flex flex-col lg:flex-row items-center justify-center gap-4 lg:gap-6">
          {/* Search Input */}

          <div className="w-full lg:flex-1 lg:max-w-2xl">
            <div className="relative group">
              {/* Search Icon */}

              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 h-5 w-5 transition-colors " />
              <Input
                id="search"
                placeholder="Search Products"
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-5 py-3.5 h-12 lg:h-13 text-sm lg:text-base rounded-xl border-2 border-gray-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500 dark:focus:border-blue-400 dark:focus:ring-blue-400/20 shadow-md hover:shadow-lg transition-all duration-300"
              />
            </div>
          </div>

          {/* Filters: Category + Price */}

          <div className="w-full lg:w-auto flex flex-col sm:flex-row gap-3 lg:gap-4">
            {/* Category Select */}
            <div className="w-full sm:w-56 lg:w-60">
              <Select
                onValueChange={(value) =>
                  setCategory(value === "All" ? "" : value)
                }
              >
                <SelectTrigger
                  id={categoryData.Trigger}
                  className="w-full h-12 lg:h-13 rounded-xl border-2 border-gray-300 dark:border-zinc-600 bg-gradient-to-br from-white to-gray-50 dark:from-zinc-800 dark:to-zinc-900 shadow-md hover:shadow-xl focus:ring-4 focus:ring-blue-500 transition-all duration-300 font-medium"
                >
                  {/* Tag Icon */}

                  <Tag className="mr-2 h-4 w-4 text-purple-500 dark:text-purple-400" />
                  <SelectValue placeholder={categoryData.Trigger} />
                </SelectTrigger>
                <SelectContent
                  position="popper"
                  className="rounded-xl border-2 shadow-2xl"
                >
                  {categoryData.items.map((items) => (
                    <SelectItem
                      key={items}
                      value={items}
                      className="capitalize text-sm lg:text-base py-2.5 hover:bg-purple-50 dark:hover:bg-purple-900/20 cursor-pointer transition-colors"
                    >
                      {items}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Price Select */}

            <div className="w-full sm:w-56 lg:w-60">
              <Select
                onValueChange={(value) =>
                  setPrice(value === "All" ? "" : value)
                }
              >
                <SelectTrigger
                  id={priceData.Trigger}
                  className="w-full h-12 lg:h-13 rounded-xl border-2 border-gray-300 dark:border-zinc-600 bg-gradient-to-br from-white to-gray-50 dark:from-zinc-800 dark:to-zinc-900 shadow-md hover:shadow-xl focus:ring-4 focus:ring-blue-500 transition-all duration-300 font-medium"
                >
                  <SelectValue placeholder={priceData.Trigger} />
                </SelectTrigger>
                <SelectContent
                  position="popper"
                  className="rounded-xl border-2 shadow-2xl"
                >
                  {priceData.items.map((items) => (
                    <SelectItem
                      key={items}
                      value={items}
                      className="capitalize text-sm lg:text-base py-2.5 hover:bg-green-50 dark:hover:bg-green-900/20 cursor-pointer transition-colors"
                    >
                      {items}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Filtermenu;
