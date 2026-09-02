import React from "react";
import { Card } from "../card";
import { colors } from "@/const/color";
import { ArrowDownToLine, Package, Calendar, MapPin } from "lucide-react";
import { PDFDocument, rgb } from "pdf-lib";

const Order = ({
  _id = "",
  amount = 2000,
  address = "453, npj street",
  date = "2024-01-01",
  status = "pending",
  createdAt = "2024-01-01",
  updatedAt = "2024-01-01",
  products = [],
  paymentMethod = "esewa",
}) => {
  const displayOrderId = _id ? String(_id) : "N/A";
  const simpleOrderId =
    displayOrderId === "N/A"
      ? "N/A"
      : `#${displayOrderId.slice(-6).toUpperCase()}`;

  // Calculate base total amount from products
  const calculateBaseTotal = () => {
    if (!products || !Array.isArray(products) || products.length === 0) {
      return amount;
    }

    let totalPrice = 0;
    products.forEach((product) => {
      const productData = product?.id || product;
      if (productData) {
        const qty = product.quantity || 1;
        const price = productData.price || 0;
        totalPrice += qty * price;
      }
    });

    return totalPrice || amount;
  };

  // Apply same calculation logic as Checkout page
  const baseTotal = calculateBaseTotal();
  const shipping = baseTotal > 500 ? 0 : 50;
  const tax = Number((baseTotal * 0.02).toFixed(2));
  const discount = baseTotal > 1000 ? 100 : 0;
  const displayAmount = Number(
    (baseTotal + shipping + tax - discount).toFixed(2),
  );

  const formatDateTime = (value) => {
    const dt = new Date(value);
    if (Number.isNaN(dt.getTime())) return "N/A";
    return dt.toLocaleString();
  };

  const handleDownload = async () => {
    try {
      console.log("Starting PDF generation...");

      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage([600, 900]);

      // Premium Header with gradient effect
      page.drawRectangle({
        x: 0,
        y: 820,
        width: 600,
        height: 80,
        color: rgb(0.38, 0.18, 0.62),
      });

      // Top accent line
      page.drawRectangle({
        x: 0,
        y: 800,
        width: 600,
        height: 3,
        color: rgb(0.12, 0.72, 0.64),
      });

      // Invoice title with styling
      page.drawText("Order Receipt", {
        x: 50,
        y: 850,
        size: 32,
        color: rgb(1, 1, 1),
      });

      // Company info
      page.drawText("SAJILO MART", {
        x: 400,
        y: 845,
        size: 14,
        color: rgb(1, 1, 1),
      });
      page.drawText("Nepalgunj, Banke, Nepal", {
        x: 400,
        y: 825,
        size: 10,
        color: rgb(0.95, 0.95, 0.95),
      });

      // Order Details Section with background box
      const detailsY = 770;

      // Background box for order details
      page.drawRectangle({
        x: 45,
        y: detailsY - 90,
        width: 510,
        height: 100,
        color: rgb(0.98, 0.97, 0.99),
      });

      // Border for details box (drawn as outline)
      page.drawRectangle({
        x: 45,
        y: detailsY - 90,
        width: 510,
        height: 1,
        color: rgb(0.85, 0.82, 0.9),
      });
      page.drawRectangle({
        x: 45,
        y: detailsY + 10,
        width: 510,
        height: 1,
        color: rgb(0.85, 0.82, 0.9),
      });
      page.drawRectangle({
        x: 45,
        y: detailsY - 90,
        width: 1,
        height: 100,
        color: rgb(0.85, 0.82, 0.9),
      });
      page.drawRectangle({
        x: 554,
        y: detailsY - 90,
        width: 1,
        height: 100,
        color: rgb(0.85, 0.82, 0.9),
      });

      page.drawText("ORDER DETAILS", {
        x: 50,
        y: detailsY,
        size: 13,
        color: rgb(0.38, 0.18, 0.62),
      });

      page.drawText(`Invoice Amount: Rs. ${amount || 0}`, {
        x: 55,
        y: detailsY - 22,
        size: 11,
        color: rgb(0, 0, 0),
      });

      const paymentMethodText =
        paymentMethod?.toUpperCase() === "COD"
          ? "Cash on Delivery"
          : "Online Payment (eSewa)";
      page.drawText(`Payment Method: ${paymentMethodText}`, {
        x: 55,
        y: detailsY - 40,
        size: 11,
        color:
          paymentMethod?.toUpperCase() === "COD"
            ? rgb(0.75, 0.2, 0.36)
            : rgb(0.15, 0.55, 0.6),
      });

      page.drawText(`Status: ${String(status).toUpperCase()}`, {
        x: 55,
        y: detailsY - 58,
        size: 11,
        color: rgb(0, 0, 0),
      });

      page.drawText(`Order ID: ${simpleOrderId}`, {
        x: 330,
        y: detailsY - 40,
        size: 11,
        color: rgb(0, 0, 0),
      });

      try {
        const orderDate = new Date(createdAt).toLocaleDateString("en-US", {
          weekday: "short",
          year: "numeric",
          month: "short",
          day: "numeric",
        });
        page.drawText(`Order Date: ${orderDate}`, {
          x: 330,
          y: detailsY - 22,
          size: 11,
          color: rgb(0, 0, 0),
        });
      } catch (e) {
        console.log("Date formatting error:", e);
      }

      page.drawText(`Delivery Address: ${String(address).substring(0, 50)}`, {
        x: 55,
        y: detailsY - 76,
        size: 10,
        color: rgb(0.2, 0.2, 0.2),
      });

      // Product Items Header with enhanced styling
      const tableTopY = 630;

      // Product section title
      page.drawText("ITEMS PURCHASED", {
        x: 50,
        y: tableTopY + 30,
        size: 13,
        color: rgb(0.38, 0.18, 0.62),
      });

      page.drawRectangle({
        x: 50,
        y: tableTopY - 3,
        width: 500,
        height: 28,
        color: rgb(0.95, 0.93, 0.98),
      });

      // Bottom border for header
      page.drawRectangle({
        x: 50,
        y: tableTopY - 3,
        width: 500,
        height: 2,
        color: rgb(0.38, 0.18, 0.62),
      });

      page.drawText("ITEM NAME", {
        x: 60,
        y: tableTopY + 8,
        size: 10,
        color: rgb(0.38, 0.18, 0.62),
      });
      page.drawText("QTY", {
        x: 260,
        y: tableTopY + 8,
        size: 10,
        color: rgb(0.38, 0.18, 0.62),
      });
      page.drawText("UNIT PRICE", {
        x: 330,
        y: tableTopY + 8,
        size: 10,
        color: rgb(0.38, 0.18, 0.62),
      });
      page.drawText("TOTAL", {
        x: 460,
        y: tableTopY + 8,
        size: 10,
        color: rgb(0.38, 0.18, 0.62),
      });

      // Products Table
      let yOffset = tableTopY - 20;
      let productsTotalPrice = 0;

      if (products && Array.isArray(products) && products.length > 0) {
        products.forEach((product, idx) => {
          try {
            const productData = product?.id || product;
            if (productData) {
              const qty = product.quantity || 1;
              const price = productData.price || 0;
              const itemTotal = qty * price;
              productsTotalPrice += itemTotal;

              // Alternate row background
              if (idx % 2 === 0) {
                page.drawRectangle({
                  x: 50,
                  y: yOffset - 4,
                  width: 500,
                  height: 20,
                  color: rgb(0.97, 0.95, 0.99),
                });
              }

              // Smart product name truncation
              let itemName = String(productData.name || "Product");
              const maxChars = 28;
              if (itemName.length > maxChars) {
                itemName = itemName.substring(0, maxChars - 3) + "...";
              }

              page.drawText(itemName, {
                x: 60,
                y: yOffset + 5,
                size: 9.5,
                color: rgb(0, 0, 0),
              });
              page.drawText(String(qty), {
                x: 260,
                y: yOffset + 5,
                size: 10,
                color: rgb(0, 0, 0),
              });
              page.drawText(`Rs. ${price}`, {
                x: 330,
                y: yOffset + 5,
                size: 10,
                color: rgb(0, 0, 0),
              });
              page.drawText(`Rs. ${itemTotal}`, {
                x: 460,
                y: yOffset + 5,
                size: 10,
                color: rgb(0.38, 0.18, 0.62),
              });
              yOffset -= 24;
            }
          } catch (e) {
            console.log("Product row error:", e);
          }
        });
      }

      // Summary Section with enhanced styling
      yOffset -= 10;

      // Top border
      page.drawRectangle({
        x: 50,
        y: yOffset,
        width: 500,
        height: 2,
        color: rgb(0.38, 0.18, 0.62),
      });

      yOffset -= 25;

      // Calculate final amount (same as checkout logic)
      const pdfShipping = productsTotalPrice > 500 ? 0 : 50;
      const pdfTax = Number((productsTotalPrice * 0.02).toFixed(2));
      const pdfDiscount = productsTotalPrice > 1000 ? 100 : 0;
      const pdfFinalAmount = Number(
        (productsTotalPrice + pdfShipping + pdfTax - pdfDiscount).toFixed(2),
      );

      // Total box with shadow effect
      page.drawRectangle({
        x: 282,
        y: yOffset - 20,
        width: 270,
        height: 26,
        color: rgb(0.3, 0.3, 0.3),
      });

      page.drawRectangle({
        x: 280,
        y: yOffset - 18,
        width: 270,
        height: 26,
        color: rgb(0.38, 0.18, 0.62),
      });
      page.drawText("TOTAL AMOUNT:", {
        x: 290,
        y: yOffset - 8,
        size: 11,
        color: rgb(1, 1, 1),
      });
      page.drawText(`Rs. ${pdfFinalAmount || 0}`, {
        x: 445,
        y: yOffset - 8,
        size: 13,
        color: rgb(1, 1, 1),
      });

      // Footer with accent line
      page.drawRectangle({
        x: 0,
        y: 52,
        width: 600,
        height: 3,
        color: rgb(0.12, 0.72, 0.64),
      });

      page.drawRectangle({
        x: 0,
        y: 0,
        width: 600,
        height: 52,
        color: rgb(0.38, 0.18, 0.62),
      });

      page.drawText(
        "Thank you for your purchase! Keep the receipt for returns & guarantees.",
        {
          x: 50,
          y: 28,
          size: 10,
          color: rgb(1, 1, 1),
        },
      );
      page.drawText("For support: support@sajilomart.com | Phone: 9808357411", {
        x: 50,
        y: 12,
        size: 9,
        color: rgb(0.95, 0.95, 0.95),
      });

      console.log("PDF content created, saving...");

      // Save and download
      const pdfBytes = await pdfDoc.save();
      console.log("PDF saved successfully, size:", pdfBytes.length);

      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Invoice-${new Date().getTime()}.pdf`;

      console.log("Appending link to body and clicking...");
      document.body.appendChild(link);
      link.click();

      // Cleanup
      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        console.log("Download cleanup complete");
      }, 100);
    } catch (error) {
      console.error("PDF Download Error:", error);
      console.error("Error stack:", error.stack);
      alert(`Failed to download invoice: ${error.message}`);
    }
  };

  return (
    // my code - Card wrapper with styling
    <Card className="border-0 p-0 rounded-xl overflow-hidden bg-white dark:bg-zinc-800 shadow-sm hover:shadow-xl transition-all duration-300">
      {/* my code - Header section with product info */}
      {products && products.length > 0 ? (
        products.map((product, index) => {
          // Handle both product.id (populated) and direct product structure
          const productData = product?.id || product;

          // Image is an array of objects with url property (from backend populate)
          let productImage = "https://via.placeholder.com/80";
          if (productData?.image?.[0]) {
            // Check if image is object with url property (lowercase from backend)
            if (typeof productData.image[0] === "object") {
              productImage =
                productData.image[0].url ||
                productData.image[0].URL ||
                productImage;
            } else if (typeof productData.image[0] === "string") {
              productImage = productData.image[0];
            }
          }

          const productName = productData?.name || "Product Name";
          const productPrice = productData?.price || amount;
          const productQty = product?.quantity || 1;
          return (
            <div
              key={product._id || index}
              className="bg-gradient-to-r from-blue-500 via-blue-600 to-purple-600 dark:from-zinc-700 dark:via-zinc-700 dark:to-zinc-700/50 px-6 py-7 border-b border-white/20 dark:border-zinc-700 hover:shadow-inner transition-all duration-300 group"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-5">
                {/* my code - Product Info with image and details */}
                <div className="flex items-center gap-4 flex-1">
                  <div className="relative group">
                    {/* Product image with premium styling */}
                    <div className="relative overflow-hidden rounded-2xl">
                      <img
                        src={productImage}
                        alt={productName}
                        className="w-24 h-24 rounded-2xl object-cover flex-shrink-0 border-3 border-white/80 dark:border-zinc-600/80 shadow-lg group-hover:shadow-2xl transition-all duration-300 group-hover:scale-110 group-hover:-translate-y-1"
                        onError={(e) => {
                          e.target.src =
                            "https://via.placeholder.com/96?text=No+Image";
                        }}
                      />
                      {/* Gradient overlay on hover */}
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    {/* Premium badge */}
                    <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-2 rounded-full shadow-lg border-2 border-white dark:border-zinc-700 group-hover:scale-110 transition-transform duration-300">
                      <Package size={16} />
                    </div>
                  </div>

                  {/* Product title and details - improved styling */}
                  <div className="flex-1 min-w-0 space-y-2">
                    <h3 className="font-bold text-lg text-white dark:text-white line-clamp-2 group-hover:text-blue-100 transition-colors duration-300">
                      {productName}
                    </h3>
                    <p className="text-sm text-blue-100 dark:text-zinc-400 font-semibold">
                      Order ID:{" "}
                      <span className="font-bold text-white">
                        {simpleOrderId}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Enhanced Amount and Quantity display */}
                <div className="flex flex-col sm:items-end gap-3">
                  <div className="text-right">
                    <p className="text-sm text-blue-100 dark:text-zinc-400 font-medium">
                      Price
                    </p>
                    <p className="text-3xl font-black text-white dark:text-white drop-shadow-lg">
                      Rs.{productPrice}
                    </p>
                  </div>
                  <span className="inline-flex items-center justify-center px-4 py-2.5 bg-white/20 dark:bg-blue-900/40 text-white dark:text-blue-200 rounded-full text-sm font-bold border-2 border-white/50 dark:border-blue-700/50 shadow-lg w-fit">
                    📦 Qty: {productQty}
                  </span>
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 dark:from-zinc-700 dark:to-zinc-700/50 px-6 py-6 border-b border-white/20 dark:border-zinc-700">
          <p className="text-white text-center">No product details available</p>
        </div>
      )}

      {/* my code - Details section: Status, Date, Address */}
      <div className="px-6 py-5 border-b border-zinc-100 dark:border-zinc-700">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* my code - Status with dynamic color based on status value */}
          <div className="flex items-center gap-3 p-3 bg-zinc-50 dark:bg-zinc-700/50 rounded-lg border border-zinc-200 dark:border-zinc-600">
            <div
              className={`p-2 rounded-lg ${
                status === "delivered"
                  ? "bg-green-100 dark:bg-green-900/20"
                  : status === "shipped"
                    ? "bg-blue-100 dark:bg-blue-900/20"
                    : status === "processing"
                      ? "bg-amber-100 dark:bg-amber-900/20"
                      : "bg-red-100 dark:bg-red-900/20"
              }`}
            >
              <Package
                size={18}
                className={`${
                  status === "delivered"
                    ? "text-green-600 dark:text-green-400"
                    : status === "shipped"
                      ? "text-blue-600 dark:text-blue-400"
                      : status === "processing"
                        ? "text-amber-600 dark:text-amber-400"
                        : "text-red-600 dark:text-red-400"
                }`}
              />
            </div>
            <div>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 font-medium">
                Status
              </p>
              <p
                className={`font-bold text-sm capitalize ${
                  status === "delivered"
                    ? "text-green-700 dark:text-green-400"
                    : status === "shipped"
                      ? "text-blue-700 dark:text-blue-400"
                      : status === "processing"
                        ? "text-amber-700 dark:text-amber-400"
                        : "text-red-700 dark:text-red-400"
                }`}
              >
                {status}
              </p>
            </div>
          </div>

          {/* my code - Date section with Calendar icon */}
          <div className="flex items-center gap-3 p-3 bg-zinc-50 dark:bg-zinc-700/50 rounded-lg border border-zinc-200 dark:border-zinc-600">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
              <Calendar
                size={18}
                className="text-purple-600 dark:text-purple-400"
              />
            </div>
            <div>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 font-medium">
                Order Date
              </p>
              <p className="font-bold text-sm text-zinc-900 dark:text-white">
                {formatDateTime(updatedAt || createdAt)}
              </p>
            </div>
          </div>

          {/* my code - Address section with Location icon */}
          <div className="flex items-center gap-3 p-3 bg-zinc-50 dark:bg-zinc-700/50 rounded-lg border border-zinc-200 dark:border-zinc-600">
            <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
              <MapPin
                size={18}
                className="text-orange-600 dark:text-orange-400"
              />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-zinc-600 dark:text-zinc-400 font-medium">
                Address
              </p>
              <p className="font-bold text-sm text-zinc-900 dark:text-white truncate">
                {address}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced footer with Total Amount and Download Invoice button */}
      <div className="px-6 py-6 flex items-center justify-between bg-gradient-to-r from-slate-50 via-blue-50 to-purple-50 dark:from-zinc-800 dark:via-zinc-800 dark:to-zinc-800 border-t-2 border-blue-200 dark:border-zinc-700">
        <div className="space-y-1">
          {/* Total amount section with enhanced styling */}
          <p className="text-sm text-zinc-600 dark:text-zinc-400 font-semibold">
            💰 Total Amount
          </p>
          {/* Amount with premium gradient text */}
          <p className="text-3xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent mt-2 drop-shadow-sm">
            Rs. {displayAmount}
          </p>
        </div>
        {/* Enhanced download receipt button */}
        <button
          onClick={handleDownload}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 dark:from-blue-600 dark:to-blue-700 dark:hover:from-blue-700 dark:hover:to-blue-800 text-white rounded-xl font-bold text-sm transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 border border-blue-400/30 hover:border-blue-300/50"
        >
          <ArrowDownToLine size={18} className="animate-bounce" />
          Download Invoice
        </button>
      </div>
    </Card>
  );
};

export default Order;
