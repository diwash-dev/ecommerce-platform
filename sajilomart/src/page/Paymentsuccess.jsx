import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { emptycart } from "@/Redux/ReduxSlice/cartslice";

const PaymentSuccess = () => {
  const dispatch = useDispatch();
  const hasProcessed = useRef(false); // Prevent double processing in StrictMode
  const searchParams = new URLSearchParams(window.location.search);
  const isCod = searchParams.get("method") === "cod";
  const codAmount = searchParams.get("amount");
  const [isLoading, setIsLoading] = useState(true);
  const [paymentData, setPaymentData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Skip if already processed (prevents StrictMode double execution)
    if (hasProcessed.current) {
      return;
    }
    hasProcessed.current = true;

    const handlePaymentSuccess = async () => {
      try {
        if (isCod) {
          setPaymentData({
            status: "COD",
            total_amount: codAmount || "0",
          });

          // Create order for COD
          const orderData = JSON.parse(
            localStorage.getItem("pendingOrder") || "{}",
          );

          if (orderData.products && orderData.products.length > 0) {
            const response = await axios.post(
              `${import.meta.env.VITE_API_URL}/createorder`,
              {
                amount: parseFloat(codAmount),
                address: orderData.address,
                products: orderData.products,
                paymentMethod: "COD",
                customerName: orderData.customerName,
                customerPhone: orderData.customerPhone,
              },
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              },
            );
            localStorage.removeItem("pendingOrder");
            dispatch(emptycart()); // Clear cart after order creation
          }

          setTimeout(() => {
            setIsLoading(false);
          }, 800);
          return;
        }

        // Get data from URL query params
        const encodedData = searchParams.get("data");

        if (encodedData) {
          // Decode base64
          const decodedData = JSON.parse(atob(encodedData));
          setPaymentData(decodedData);

          // Send to backend to verify and update
          const response = await fetch(
            `${import.meta.env.VITE_API_URL}/payment-status`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                product_id: decodedData.transaction_uuid,
                pidx: decodedData.transaction_code,
                status:
                  decodedData.status === "COMPLETE" ? "COMPLETED" : "FAILED",
              }),
            },
          );

          const result = await response.json();
          // Create order after successful payment
          if (result.status === "COMPLETED") {
            const orderData = JSON.parse(
              localStorage.getItem("pendingOrder") || "{}",
            );
            if (orderData.products && orderData.products.length > 0) {
              const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/createorder`,
                {
                  amount: parseFloat(decodedData.total_amount),
                  address: orderData.address,
                  products: orderData.products,
                  paymentMethod: "esewa",
                  customerName: orderData.customerName,
                  customerPhone: orderData.customerPhone,
                },
                {
                  headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                  },
                },
              );
              localStorage.removeItem("pendingOrder");
              dispatch(emptycart()); // Clear cart after order creation
            }
          }
        }

        setTimeout(() => {
          setIsLoading(false);
          // Play success sound
          const audio = new Audio(
            "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBg==",
          );
          audio.play().catch(() => {});
        }, 1500);
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
      }
    };

    handlePaymentSuccess();
  }, [codAmount, isCod]);

  useEffect(() => {
    if (!isLoading) {
      const redirectTimer = setTimeout(() => {
        window.location.href = "/";
      }, 5000);
      return () => clearTimeout(redirectTimer);
    }
  }, [isLoading]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-violet-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex flex-col items-center justify-center px-4 py-8 overflow-hidden">
      <style>{`
        @keyframes fall {
          to {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }
        @keyframes scaleIn {
          from {
            transform: scale(0.5);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-scale-in {
          animation: scaleIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .animate-bounce-gentle {
          animation: bounce 2s ease-in-out infinite;
        }
      `}</style>

      <div className="w-full max-w-2xl">
        {/* my code - Loading state */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-purple-600 rounded-full animate-spin dark:border-slate-700 dark:border-t-purple-400"></div>
            <p className="mt-4 text-lg font-semibold text-zinc-600 dark:text-zinc-400">
              {isCod
                ? "Confirming your order..."
                : "Processing your payment..."}
            </p>
          </div>
        )}

        {/* my code - Success card with glass effect */}
        {!isLoading && (
          <div className="animate-scale-in backdrop-blur-xl bg-white/95 dark:bg-slate-800/85 rounded-3xl shadow-2xl border border-blue-200/40 dark:border-slate-700/50 p-8 sm:p-12">
            {/* my code - Success icon with animation */}
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full blur-2xl opacity-50 animate-pulse"></div>
                <div className="relative w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg animate-bounce-gentle">
                  <CheckCircle
                    size={64}
                    className="text-white animate-pulse"
                    strokeWidth={1}
                  />
                </div>
              </div>
            </div>

            {/* my code - Success title and subtitle */}
            <div className="text-center mb-8">
              <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent mb-2">
                {isCod ? "Order Placed!" : "Payment Successful!"}
              </h1>{" "}
              <span className=" text-4xl">🎉</span>
              <p className="text-lg text-zinc-600 dark:text-zinc-300">
                {isCod
                  ? "Your Cash on Delivery order is confirmed"
                  : "Your order has been placed successfully"}
              </p>
            </div>

            <div className="h-px bg-gradient-to-r from-transparent via-blue-200 to-transparent dark:via-slate-700/30 mb-8"></div>

            {/* Success message box */}
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700/50 rounded-xl mb-8">
              <p className="text-sm text-blue-800 dark:text-blue-300 text-center">
                {isCod
                  ? "✓ Order confirmed with Cash on Delivery. Please keep the exact amount ready at delivery time."
                  : "✓ Your payment has been securely processed. A confirmation email has been sent to your inbox."}
              </p>
            </div>

            {/* Payment Details */}
            {paymentData && (
              <div className="p-4 bg-slate-100 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-700/50 rounded-xl mb-8">
                <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-3">
                  {isCod ? "Order Details:" : "Payment Details:"}
                </h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {!isCod && (
                    <div>
                      <span className="text-slate-600 dark:text-slate-400">
                        Transaction Code:
                      </span>
                      <p className="font-mono text-slate-800 dark:text-slate-200">
                        {paymentData.transaction_code}
                      </p>
                    </div>
                  )}
                  <div>
                    <span className="text-slate-600 dark:text-slate-400">
                      {isCod ? "Pay on Delivery:" : "Amount:"}
                    </span>
                    <p className="font-semibold text-slate-800 dark:text-slate-200">
                      Rs. {paymentData.total_amount}
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-600 dark:text-slate-400">
                      Status:
                    </span>
                    <p className="font-semibold text-green-600 dark:text-green-400">
                      {isCod ? "CONFIRMED (COD)" : paymentData.status}
                    </p>
                  </div>
                  {!isCod && (
                    <div>
                      <span className="text-slate-600 dark:text-slate-400">
                        Transaction ID:
                      </span>
                      <p className="font-mono text-xs text-slate-800 dark:text-slate-200">
                        {paymentData.transaction_uuid}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {error && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700/50 rounded-xl mb-8">
                <p className="text-sm text-red-800 dark:text-red-300">
                  ⚠ Error: {error}
                </p>
              </div>
            )}

            {/* my code - Action buttons */}
            <div className="grid grid-cols-1 gap-4">
              <Link
                to="/"
                className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 dark:from-blue-600 dark:to-purple-600 dark:hover:from-blue-700 dark:hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentSuccess;
