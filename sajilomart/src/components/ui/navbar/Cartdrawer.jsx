import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "../button";
import { ShoppingCart } from "lucide-react";
import { Badge } from "../badge";
import { useSelector, useDispatch } from "react-redux";
import { removeFromCart } from "@/Redux/ReduxSlice/cartslice";
import { useToast } from "@/hooks/use-toast";

import Productitem from "./Productitem";
import { useNavigate } from "react-router-dom";

const Cartdrawer = () => {
  const dispatch = useDispatch();
  const { toast } = useToast();

  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth || {});

  const {
    cartitems = [],
    totalquantity = 0,
    totalprice = 0,
  } = useSelector((state) => state.cart || {});

  const handleRemove = (item) => {
    dispatch(removeFromCart(item));
  };

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (cartitems.length === 0) {
      toast({
        title: "Your cart is empty",
        variant: "destructive",
      });
      return;
    }

    navigate("/checkout");
  };

  return (
    <Drawer side="left">
      <DrawerTrigger className="relative inline-flex items-center justify-center">
        {totalquantity > 0 && (
          <Badge
            className={
              "absolute -top-3 -right-3 min-w-6 px-1.5 py-0.5 text-[11px] leading-3 font-bold bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white shadow-lg shadow-indigo-600/50 rounded-full"
            }
          >
            {totalquantity}
          </Badge>
        )}
        <div className="relative p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex-shrink-0 flex items-center justify-center">
          <ShoppingCart
            className="text-slate-600 dark:text-slate-400"
            strokeWidth={2}
            size={20}
          ></ShoppingCart>
        </div>
      </DrawerTrigger>
      <DrawerContent className="rounded-t-2xl sm:rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 !h-[calc(100vh-4rem)] sm:!h-auto flex flex-col">
        <DrawerHeader className="border-b border-slate-200 dark:border-slate-700 px-4 py-4 sm:py-5 shrink-0 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900">
          <DrawerTitle className="text-lg sm:text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            🛒 Shopping Cart
          </DrawerTitle>
          <DrawerDescription className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mt-2">
            {totalquantity} {totalquantity === 1 ? "item" : "items"} in cart •{" "}
            <span className="font-semibold text-slate-900 dark:text-white">
              Rs {totalprice.toFixed(2)}
            </span>
          </DrawerDescription>
        </DrawerHeader>

        <div className="flex flex-col gap-2 sm:gap-3 px-4 py-4 overflow-y-auto flex-1 min-h-0 sm:max-h-[50vh]">
          {cartitems.length > 0 ? (
            cartitems.map((item) => (
              <Productitem key={item._id} {...item} onRemove={handleRemove} />
            ))
          ) : (
            <p className="text-center text-slate-500 dark:text-slate-400 py-12 sm:py-8 text-sm sm:text-base">
              📭 Your cart is empty
            </p>
          )}
        </div>

        <DrawerFooter className="border-t border-slate-200 dark:border-slate-700 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 px-4 py-4 sm:py-5 gap-3 shrink-0 mt-auto">
          <div className="flex items-center justify-between mb-1 px-3 bg-white dark:bg-slate-700/50 rounded-lg py-3">
            <span className="text-sm sm:text-base font-semibold text-slate-700 dark:text-slate-300">
              💰 Total:
            </span>
            <span className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Rs {totalprice.toFixed(2)}
            </span>
          </div>
          <Button
            onClick={handleCheckout}
            className="w-full py-2.5 sm:py-3 rounded-xl sm:rounded-2xl text-white font-semibold text-base sm:text-lg bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 transition-all duration-300 shadow-lg shadow-indigo-500/30"
          >
            ✓ Proceed to Checkout
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default Cartdrawer;
