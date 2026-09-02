import { Button } from "@/components/ui/button";
import ProductFeedback from "@/components/ui/navbar/ProductFeedback";
import QuantityCounter from "@/components/QuantityCounter";
import { starsGenerator } from "@/const/Help";

import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "@/Redux/ReduxSlice/cartslice";
import { useToast } from "@/hooks/use-toast";

const imageArray = [
  {
    url: "https://images.unsplash.com/photo-1590212151175-e58edd96185b?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    id: 1,
  },
  {
    url: "https://images.unsplash.com/photo-1590212151175-e58edd96185b?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    id: 2,
  },
  {
    url: "https://images.unsplash.com/photo-1590212151175-e58edd96185b?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    id: 3,
  },

  {
    url: "https://images.unsplash.com/photo-1590212151175-e58edd96185b?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    id: 4,
  },
];

const productStock = 10;

const formatDescription = (desc) => {
  if (!desc) return [];
  return desc
    .split(/[\n•-]/g)
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
};

const Product = () => {
  const { prodname } = useParams();

  const dispatch = useDispatch();
  const { toast } = useToast();

  const { isAuthenticated } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [productQuantity, setProductQuantity] = useState(1);

  const [product, setProduct] = useState({});
  const [selectedImage, setSelectedImages] = useState(0);
  // ------------------fetching product by name------------------------------
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    const fetchProductByName = async () => {
      try {
        const normalizedProductName = (prodname || "")
          .replace(/-+/g, " ")
          .trim()
          .replace(/\s+/g, " ");

        if (!normalizedProductName) return;

        const parsedProductName = encodeURIComponent(normalizedProductName);
        const res = await axios.get(
          import.meta.env.VITE_API_URL +
            `/get-product-by-name/${parsedProductName}`,
        );
        const { data } = await res.data;
        console.log("Full Product Data:", data);
        console.log("Product Images (data.image):", data?.image);
        console.log("Product Images (data.images):", data?.images);
        setProduct(data);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    if (prodname) {
      fetchProductByName();
    }
  }, [prodname]);

  const handleAddToCart = useCallback(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    dispatch(
      addToCart({
        _id: product._id,
        name: product.name,
        price: product.price,
        image:
          product?.image?.[0]?.url ||
          product?.images?.[0]?.url ||
          imageArray[0]?.url,
        quantity: productQuantity,
        stock: product.stock || productStock,
        blackList: product.blackList || false,
      }),
    );

    setProductQuantity(1);
    toast({
      title: "Product added to cart",
      description: `${product.name} has been added to your cart.`,
      variant: "default",
    });
  }, [isAuthenticated, product, productQuantity, dispatch, navigate, toast]);

  const handleDecrement = useCallback(() => {
    setProductQuantity((qty) => (qty > 1 ? qty - 1 : 1));
  }, []);

  const handleIncrement = useCallback(() => {
    setProductQuantity((qty) => {
      const maxQty = product.stock || productStock;
      return qty < maxQty ? qty + 1 : qty;
    });
  }, [product.stock]);

  // -------------------------handle buy now------------------------------
  const handleBuyNow = () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    const maxQty = product.stock || productStock;

    if (!product?._id || !product?.price) {
      toast({
        title: "Product details are not ready yet",
        variant: "destructive",
      });
      return;
    }

    if (productQuantity > maxQty) {
      toast({
        title: "product is out of stock",
      });
      return;
    }

    if (product.blackList) {
      toast({
        title: "Product is blacklisted  not  available for purchase",
      });
      return;
    }

    dispatch(
      addToCart({
        _id: product._id,
        name: product.name,
        price: product.price,
        image:
          product?.image?.[0]?.url ||
          product?.images?.[0]?.url ||
          imageArray[0]?.url,
        quantity: productQuantity,
        stock: product.stock || productStock,
        blackList: product.blackList || false,
      }),
    );

    navigate("/checkout");
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-900">
        <main className="container mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8 max-w-7xl">
          {/* -----------------------------left side ------------------------------*/}

          <div className="flex-1 lg:w-1/2 space-y-4">
            <img
              src={
                product?.image?.[selectedImage]?.url ||
                product?.images?.[selectedImage]?.url ||
                product?.image?.[0]?.url ||
                product?.images?.[0]?.url ||
                imageArray[selectedImage]?.url ||
                imageArray[0]?.url
              }
              className="w-full h-[400px] lg:h-[500px] rounded-2xl object-cover shadow-2xl border-4 border-white dark:border-zinc-700 hover:scale-[1.02] transition-transform duration-300"
              alt="Product"
              onError={(e) => {
                console.log("Image failed to load:", e.target.src);
                e.target.src = imageArray[0].url;
              }}
            />

            <div className="grid grid-cols-4 gap-3">
              {(product?.image || product?.images || [])?.map(
                ({ url, id }, index) => (
                  <img
                    src={url}
                    onClick={() => setSelectedImages(index)}
                    key={id || index}
                    className={`w-full h-24 aspect-square rounded-xl object-cover cursor-pointer border-2 transition-all duration-300 ${
                      selectedImage === index
                        ? "border-blue-500 shadow-lg"
                        : "border-transparent hover:border-blue-500 hover:shadow-lg"
                    }`}
                    onError={(e) => {
                      console.log("Thumbnail failed to load:", e.target.src);
                      e.target.src = imageArray[0].url;
                    }}
                  />
                ),
              )}
            </div>

            {/* --------- PRODUCT DESCRIPTION SECTION --------- */}
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-zinc-700 dark:to-zinc-800 p-6 rounded-2xl shadow-lg border border-blue-200 dark:border-zinc-600 space-y-4">
              {/* Header */}
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                📝 Product Details
              </h2>

              {/* Description Box */}
              <div className="bg-white dark:bg-zinc-800 p-4 rounded-xl space-y-3 border border-zinc-200 dark:border-zinc-600">
                {formatDescription(product?.description).map((item, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 text-sm text-zinc-700 dark:text-zinc-300"
                  >
                    <span className="text-green-500 font-bold text-lg">✓</span>
                    <span className="leading-relaxed">{item}</span>
                  </div>
                ))}
              </div>

              {/* Info Cards - Category & Warranty */}
              <div className="grid grid-cols-2 gap-3">
                {/* Category */}
                <div className="bg-white dark:bg-zinc-800 p-4 rounded-lg border border-purple-200 dark:border-zinc-600 shadow-sm">
                  <p className="text-xs font-semibold text-purple-600 dark:text-purple-400 uppercase">
                    Category
                  </p>
                  <p className="text-sm font-bold text-zinc-900 dark:text-white mt-2">
                    {product?.category || "N/A"}
                  </p>
                </div>

                {/* Warranty */}
                <div className="bg-white dark:bg-zinc-800 p-4 rounded-lg border border-orange-200 dark:border-zinc-600 shadow-sm">
                  <p className="text-xs font-semibold text-orange-600 dark:text-orange-400 uppercase">
                    Warranty
                  </p>
                  <p className="text-sm font-bold text-zinc-900 dark:text-white mt-2">
                    {product?.warranty || "1 Year"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ------------------------Right side ------------------------------------------------*/}

          <div className="flex-1 lg:w-1/2 space-y-6 bg-white dark:bg-zinc-800 p-6 lg:p-8 rounded-2xl shadow-xl">
            <div className="space-y-4 pb-6 border-b border-zinc-200 dark:border-zinc-700">
              <h1 className="font-bold text-3xl lg:text-4xl text-zinc-900 dark:text-white leading-tight">
                {product?.name || "Loading..."}
              </h1>
              <div className="flex items-center gap-3">
                <div className="flex items-center">
                  {starsGenerator(product.rating || 0, "0", 20)}
                </div>
                <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  ({product?.reviews?.length || 0} reviews)
                </span>
                <span
                  className={`px-3 py-1 ${product?.stock > 0 ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400" : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"} text-xs font-semibold rounded-full`}
                >
                  {product.stock > 0
                    ? `In Stock (${product.stock})`
                    : "Out of Stock"}
                </span>
              </div>
            </div>

            {/* -------------------------price---------------- */}

            <div className="py-6 space-y-2">
              <div className="flex items-baseline gap-3 flex-wrap">
                <span className="text-4xl lg:text-5xl font-bold text-red-600 dark:text-red-500">
                  Rs. {product.price?.toLocaleString() || "0"}
                </span>
              </div>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Inclusive of all taxes • Free shipping on orders above Rs. 500
              </p>
            </div>

            {/*  -------------product counter------------------------------ */}

            <div className="space-y-3">
              <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                Quantity:
              </label>
              <div className="flex items-center gap-4">
                <QuantityCounter
                  quantity={productQuantity}
                  onDecrement={handleDecrement}
                  onIncrement={handleIncrement}
                  maxStock={product.stock || productStock}
                />
              </div>
            </div>

            {/*--------------------------- Button section --------------------------*/}

            <div className="flex flex-col sm:flex-row gap-3">
              {/* Add to Cart Button */}
              <Button
                className="flex-1 h-14 text-base font-bold bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-xl shadow-lg hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300"
                onClick={handleAddToCart}
              >
                🛒 Add to Cart
              </Button>

              {/* Buy Now Button */}
              <Button
                onClick={handleBuyNow}
                className="flex-1 h-14 text-base font-bold bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl shadow-lg hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300"
              >
                ⚡ Buy Now
              </Button>
            </div>

            {}

            {/*------------------------ Product Delivery & Benefits Section -----------------*/}

            <div className="space-y-4 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-zinc-700 dark:to-zinc-800 p-6 rounded-2xl border border-blue-200 dark:border-zinc-600 shadow-lg">
              {/* -------------Delivery Info------------------- */}
              <div className="space-y-2">
                <p className="font-bold text-base text-zinc-900 dark:text-white flex items-center gap-2">
                  🚚 Delivery Info
                </p>
                <div className="text-sm text-zinc-700 dark:text-zinc-300 space-y-1">
                  <p>• Arrives in 2-4 working days</p>
                  <p>• Free shipping on orders above Rs. 500</p>
                  <p>• Real-time order tracking available</p>
                </div>
              </div>

              {/* -----------Benefits--------------- */}
              <div className="pt-4 border-t border-zinc-300 dark:border-zinc-600 space-y-3">
                <p className="font-bold text-base text-zinc-900 dark:text-white flex items-center gap-2">
                  💡 Why Choose Us?
                </p>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2 bg-white dark:bg-zinc-800 p-3 rounded-lg shadow-sm">
                    <span>✅</span>
                    <span className="font-medium">7 Days Return</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white dark:bg-zinc-800 p-3 rounded-lg shadow-sm">
                    <span>💰</span>
                    <span className="font-medium">Cash on Delivery</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white dark:bg-zinc-800 p-3 rounded-lg shadow-sm">
                    <span>⭐</span>
                    <span className="font-medium">100% Original</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white dark:bg-zinc-800 p-3 rounded-lg shadow-sm">
                    <span>🔒</span>
                    <span className="font-medium">Secure Payment</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* ----------------revew section ----------------*/}
        <div className="mt-12">
          <ProductFeedback />
        </div>
      </div>
    </>
  );
};

export default Product;
