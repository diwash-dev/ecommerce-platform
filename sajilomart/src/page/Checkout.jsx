import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import Checkoutfeed from "@/components/ui/navbar/CheckoutFeed";
import Esewa from "@/hooks/Esewa";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Checkout = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { generatePayment, verifyPayment } = Esewa();

  const {
    cartitems = [],
    totalprice = 0,
    totalquantity = 0,
  } = useSelector((state) => state.cart || {});
  const { isAuthenticated, User } = useSelector((state) => state.auth || {});

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("esewa");

  const shipping = useMemo(() => (totalprice > 500 ? 0 : 50), [totalprice]);
  const tax = useMemo(
    () => Number((totalprice * 0.02).toFixed(2)),
    [totalprice],
  );
  const discount = useMemo(() => (totalprice > 1000 ? 100 : 0), [totalprice]);
  const grandTotal = useMemo(
    () => Number((totalprice + shipping + tax - discount).toFixed(2)),
    [totalprice, shipping, tax, discount],
  );

  const onChange = (event) => {
    const { id, value } = event.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handlePlaceOrder = async () => {
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

    if (
      !formData.name ||
      !formData.email ||
      !formData.phone ||
      !formData.address
    ) {
      toast({
        title: "Please fill all personal info fields",
        variant: "destructive",
      });
      return;
    }

    // Save order details to localStorage BEFORE payment/navigation
    const orderDetails = {
      products: cartitems.map((item) => ({
        id: item._id,
        quantity: item.quantity,
      })),
      address: formData.address,
      amount: grandTotal,
      customerName: formData.name,
      customerPhone: formData.phone,
    };
    localStorage.setItem("pendingOrder", JSON.stringify(orderDetails));

    // Handle Cash on Delivery
    if (paymentMethod === "cod") {
      navigate(`/payment-success?method=cod&amount=${grandTotal}`);
      return;
    }

    // Handle eSewa Payment
    const order = await generatePayment({
      amount: grandTotal,
      productId: `cart-${Date.now()}`,
      paymentGateway: "esewa",
      customerName: formData.name,
      customerEmail: formData.email,
      customerPhone: formData.phone,
      productName: `Cart items (${totalquantity})`,
    });

    if (!order) return;

    await verifyPayment(order);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-900 py-12 px-4">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
        {/* --------------- Transaction Summary Section --------------- */}

        <div className="flex-1 lg:max-w-2xl">
          <div className="bg-white dark:bg-zinc-800 rounded-2xl p-6 lg:p-8 shadow-xl border border-zinc-200 dark:border-zinc-700 space-y-6">
            <h1 className="text-3xl lg:text-4xl font-bold text-zinc-900 dark:text-white">
              🛒 Transaction Summary
            </h1>
            <div className="space-y-4">
              {cartitems.length > 0 ? (
                cartitems.map((item) => (
                  <Checkoutfeed
                    key={item._id}
                    name={item.name}
                    quantity={item.quantity}
                    price={item.totalitemprice || item.price * item.quantity}
                    image={{ URL: item.image }}
                  />
                ))
              ) : (
                <p className="text-zinc-600 dark:text-zinc-300 text-sm">
                  No items in cart.
                </p>
              )}
            </div>

            {/* Price Breakdown */}
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-zinc-700 dark:to-zinc-800 p-6 rounded-xl border border-blue-200 dark:border-zinc-600 space-y-3">
              <p className="flex justify-between items-center py-2 text-base">
                <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                  Cart Total:
                </span>
                <span className="font-bold text-zinc-900 dark:text-white">
                  Rs. {totalprice.toFixed(2)}
                </span>
              </p>
              <p className="flex justify-between items-center py-2 text-base">
                <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                  Shipping:
                </span>
                <span className="font-bold text-zinc-900 dark:text-white">
                  Rs. {shipping.toFixed(2)}
                </span>
              </p>
              <p className="flex justify-between items-center py-2 text-base">
                <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                  Tax:
                </span>
                <span className="font-bold text-zinc-900 dark:text-white">
                  Rs. {tax.toFixed(2)}
                </span>
              </p>
              <p className="flex justify-between items-center py-2 text-base">
                <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                  Discount:
                </span>
                <span className="font-bold text-green-600 dark:text-green-400">
                  - Rs. {discount.toFixed(2)}
                </span>
              </p>
            </div>

            <div className="h-px bg-gradient-to-r from-transparent via-zinc-300 dark:via-zinc-600 to-transparent"></div>

            <div className="flex justify-between items-center px-4 py-3 bg-zinc-100 dark:bg-zinc-900 rounded-xl">
              <span className="text-xl font-bold text-zinc-900 dark:text-white">
                Total:
              </span>
              <span className="text-2xl font-bold text-red-600 dark:text-red-500">
                Rs. {grandTotal.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/*-------------------- Personal Info Section ------------------------------------------*/}

        <div className="flex-1 lg:max-w-xl">
          <Card className="w-full bg-white dark:bg-zinc-800 p-6 lg:p-8 space-y-6 shadow-xl rounded-2xl border border-zinc-200 dark:border-zinc-700">
            <h3 className="text-3xl font-bold text-center text-zinc-900 dark:text-white mb-2">
              📋 Personal Info
            </h3>

            <div className="space-y-5">
              {/* full name */}
              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="name"
                  className="text-sm font-semibold text-zinc-700 dark:text-zinc-300"
                >
                  👤 Full Name
                </Label>
                <input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={onChange}
                  placeholder="Enter your full name"
                  className="w-full h-12 px-4 rounded-xl border-2 border-zinc-300 dark:border-zinc-600 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-white placeholder-zinc-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/30 transition-all duration-200"
                />
              </div>

              {/* email */}

              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="email"
                  className="text-sm font-semibold text-zinc-700 dark:text-zinc-300"
                >
                  📧 Email Address
                </Label>
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={onChange}
                  placeholder="Enter your email address"
                  className="w-full h-12 px-4 rounded-xl border-2 border-zinc-300 dark:border-zinc-600 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-white placeholder-zinc-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/30 transition-all duration-200"
                />
              </div>

              {/* phone */}

              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="phone"
                  className="text-sm font-semibold text-zinc-700 dark:text-zinc-300"
                >
                  📱 Phone Number
                </Label>
                <input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={onChange}
                  placeholder="Enter your phone number"
                  className="w-full h-12 px-4 rounded-xl border-2 border-zinc-300 dark:border-zinc-600 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-white placeholder-zinc-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/30 transition-all duration-200"
                />
              </div>

              {/* address */}

              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="adress"
                  className="text-sm font-semibold text-zinc-700 dark:text-zinc-300"
                >
                  📍 Delivery Address
                </Label>
                <Textarea
                  rows={5}
                  id="address"
                  value={formData.address}
                  onChange={onChange}
                  placeholder="House No, Street, Area, City"
                  className="min-h-[120px] w-full p-4 rounded-xl border-2 border-zinc-300 dark:border-zinc-600 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-white placeholder-zinc-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/30 transition-all duration-200 resize-none"
                />
              </div>

              {/* Payment Method */}
              <div className="flex flex-col gap-3 p-4 bg-zinc-100 dark:bg-zinc-700 rounded-xl">
                <Label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                  💳 Payment Method
                </Label>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="payment"
                      value="esewa"
                      checked={paymentMethod === "esewa"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-4 h-4"
                    />
                    <span className="text-sm text-zinc-700 dark:text-zinc-300">
                      eSewa (Online)
                    </span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="payment"
                      value="cod"
                      checked={paymentMethod === "cod"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-4 h-4"
                    />
                    <span className="text-sm text-zinc-700 dark:text-zinc-300">
                      💵 Cash on Delivery
                    </span>
                  </label>
                </div>
              </div>

              {/* button */}
              <Button
                onClick={handlePlaceOrder}
                disabled={cartitems.length === 0}
                className="w-full mt-2 h-14 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                🛍️ Place Order
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
