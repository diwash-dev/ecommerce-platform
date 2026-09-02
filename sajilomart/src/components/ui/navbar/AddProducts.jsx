import React, { useState, useRef } from "react";
import { useDispatch } from "react-redux";
import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../card";

import { Label } from "../label";
import { Input } from "../input";
import { Textarea } from "../textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../select";
import { Button } from "../button";
import { Loader2, Upload, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Error from "@/hooks/Error";
import axios from "axios";
import { setProducts } from "../../../Redux/ReduxSlice/sliceproduct";

const AddProducts = () => {
  const [currentColor, setCurrentColor] = useState("#1db345");
  const { toast } = useToast();
  const { handleErrorLogout } = Error();
  const dispatch = useDispatch();
  const [images, setImages] = useState([]);
  const fileInputRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [colors, setColor] = useState([]);
  const [category, setCategory] = useState("");
  const [mainImagePreview, setMainImagePreview] = useState(
    "https://images.unsplash.com/photo-1764069970723-eff3e12de883?q=80&w=1170&auto=format&fit=crop",
  );

  const addcolor = () => {
    if (!colors.includes(currentColor)) {
      setColor([...colors, currentColor]);
    }
  };

  const removeColor = (colorToRemove) => {
    setColor(colors.filter((c) => c !== colorToRemove));
  };

  const removeImage = (indexToRemove) => {
    const updatedImages = images.filter((_, index) => index !== indexToRemove);
    setImages(updatedImages);
    // Update main preview if first image is removed
    if (indexToRemove === 0 && updatedImages.length > 0) {
      setMainImagePreview(updatedImages[0].preview);
    } else if (updatedImages.length === 0) {
      setMainImagePreview(
        "https://images.unsplash.com/photo-1764069970723-eff3e12de883?q=80&w=1170&auto=format&fit=crop",
      );
    }
  };

  const handleImagesUpload = (e) => {
    const files = e.target.files;
    if (files) {
      const newImages = Array.from(files).map((file) => ({
        preview: URL.createObjectURL(file),
        file,
      }));
      const updatedImages = [...images, ...newImages].slice(0, 5);
      setImages(updatedImages);
      // Set first image as main preview
      if (updatedImages.length > 0) {
        setMainImagePreview(updatedImages[0].preview);
      }
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    const form = e.currentTarget;
    const name = form.name.value.trim();
    const description = form.description.value.trim();
    const price = form.price.value;
    const stock = form.stock.value;

    if (
      name === "" ||
      description === "" ||
      category === "" ||
      price === "" ||
      stock === ""
    ) {
      return toast({
        title: "Invalid fields",
        description: "Please fill all the fields with valid values",
      });
    }

    if (images.length < 3) {
      return toast({
        title: "Too few images",
        description: "You must upload at least 3 images",
        variant: "destructive",
      });
    }
    setIsLoading(true);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("price", price);
    formData.append("stock", stock);

    colors.forEach((color) => formData.append("colors", color));
    images.forEach((image) => formData.append("images", image.file));

    try {
      const token = localStorage.getItem("token");
      const baseURL = import.meta.env.VITE_BASE_URL || "http://localhost:3000";

      const res = await axios.post(`${baseURL}/api/create-product`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      toast({
        title: "Product Added",
        description: "The product has been successfully added.",
      });

      // Refetch and update products in Redux for ProductManagement
      try {
        const baseURL =
          import.meta.env.VITE_BASE_URL || "http://localhost:3000";
        const refreshRes = await axios.get(
          `${baseURL}/api/get-product?category=all&search=`,
        );
        if (refreshRes.data.data) {
          dispatch(setProducts(refreshRes.data.data));
        }
      } catch (error) {
        console.error("Error refreshing products:", error);
      }

      // Reset form
      form.reset();
      setImages([]);
      setColor([]);
      setCategory("");
      setMainImagePreview(
        "https://images.unsplash.com/photo-1764069970723-eff3e12de883?q=80&w=1170&auto=format&fit=crop",
      );
    } catch (error) {
      handleErrorLogout(error, "Failed to add product. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin h-12 w-12 text-orange-500" />
        <div className="text-center space-y-2">
          <p className="text-xl font-bold text-zinc-900 dark:text-white">
            Uploading Product...
          </p>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Please wait, images are being uploaded to cloud storage. This may
            take a moment.
          </p>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen rounded-lg bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-900 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <CardHeader className="text-center mb-8">
          <CardTitle className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent  sm:mb-4 text-center">
            📦 Product Information
          </CardTitle>
          {/* <CardDescription>
          {" "}
          enter the details for the new products
        </CardDescription> */}
        </CardHeader>

        <form onSubmit={onSubmit}>
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            {/* Left side: Product Info */}

            <CardContent className="flex-1 bg-white dark:bg-zinc-800 rounded-2xl p-6 lg:p-8 shadow-xl border border-zinc-200 dark:border-zinc-700 space-y-6">
              {/* Product Name */}
              <div className="space-y-2">
                <Label
                  htmlFor="name"
                  className="text-sm font-semibold text-zinc-700 dark:text-zinc-300"
                >
                  📝 Product Name
                </Label>
                <Input
                  type="text"
                  name="name"
                  id="name"
                  placeholder="Enter product name"
                  required
                  className="w-full h-12 px-4 rounded-xl border-2 border-zinc-300 dark:border-zinc-600 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-white placeholder-zinc-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/30 transition-all duration-200"
                />
              </div>

              {/* Product Description */}
              <div className="space-y-2">
                <Label
                  htmlFor="description"
                  className="text-sm font-semibold text-zinc-700 dark:text-zinc-300"
                >
                  📄 Product Description
                </Label>
                <Textarea
                  name="description"
                  id="description"
                  placeholder="Enter product description"
                  required
                  className="w-full min-h-[120px] p-4 rounded-xl border-2 border-zinc-300 dark:border-zinc-600 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-white placeholder-zinc-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/30 transition-all duration-200 resize-none"
                />
              </div>

              {/*            product category    */}

              <div className="space-y-2">
                <Label
                  htmlFor="category"
                  className="text-sm font-semibold text-zinc-700 dark:text-zinc-300"
                >
                  🏷️ Product Category
                </Label>
                <Select
                  name="category"
                  required
                  value={category}
                  onValueChange={setCategory}
                >
                  <SelectTrigger className="w-full h-12 px-4 rounded-xl border-2 border-zinc-300 dark:border-zinc-600 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/30 transition-all duration-200">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-zinc-800 rounded-xl shadow-xl border border-zinc-200 dark:border-zinc-700">
                    <SelectItem
                      value="Monitor"
                      className="px-4 py-3 cursor-pointer hover:bg-blue-50 dark:hover:bg-zinc-700 rounded-lg transition-colors duration-150"
                    >
                      Monitor
                    </SelectItem>
                    <SelectItem
                      value="Ram"
                      className="px-4 py-3 cursor-pointer hover:bg-blue-50 dark:hover:bg-zinc-700 rounded-lg transition-colors duration-150"
                    >
                      RAM
                    </SelectItem>
                    <SelectItem
                      value="Laptop"
                      className="px-4 py-3 cursor-pointer hover:bg-blue-50 dark:hover:bg-zinc-700 rounded-lg transition-colors duration-150"
                    >
                      Laptop
                    </SelectItem>
                    <SelectItem
                      value="Mobile"
                      className="px-4 py-3 cursor-pointer hover:bg-blue-50 dark:hover:bg-zinc-700 rounded-lg transition-colors duration-150"
                    >
                      Mobile
                    </SelectItem>
                    <SelectItem
                      value="Headphones"
                      className="px-4 py-3 cursor-pointer hover:bg-blue-50 dark:hover:bg-zinc-700 rounded-lg transition-colors duration-150"
                    >
                      Headphones
                    </SelectItem>
                    <SelectItem
                      value="Watch"
                      className="px-4 py-3 cursor-pointer hover:bg-blue-50 dark:hover:bg-zinc-700 rounded-lg transition-colors duration-150"
                    >
                      Watch
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Price & Stock */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Price */}
                <div className="space-y-2">
                  <Label
                    htmlFor="price"
                    className="text-sm font-semibold text-zinc-700 dark:text-zinc-300"
                  >
                    💰 Product Price
                  </Label>
                  <Input
                    type="number"
                    name="price"
                    id="price"
                    placeholder="0.00"
                    required
                    step="0.01"
                    min="0"
                    className="w-full h-12 px-4 rounded-xl border-2 border-zinc-300 dark:border-zinc-600 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-white placeholder-zinc-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/30 transition-all duration-200"
                  />
                </div>

                {/* Stock */}
                <div className="space-y-2">
                  <Label
                    htmlFor="stock"
                    className="text-sm font-semibold text-zinc-700 dark:text-zinc-300"
                  >
                    📊 Product Stock
                  </Label>
                  <Input
                    type="number"
                    name="stock"
                    id="stock"
                    placeholder="0"
                    required
                    min="0"
                    className="w-full h-12 px-4 rounded-xl border-2 border-zinc-300 dark:border-zinc-600 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-white placeholder-zinc-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/30 transition-all duration-200"
                  />
                </div>
              </div>
            </CardContent>

            {/* Right side: Category & Images */}

            <CardContent className="flex-1 bg-white dark:bg-zinc-800 rounded-2xl p-6 lg:p-8 shadow-xl border border-zinc-200 dark:border-zinc-700 space-y-6">
              <div className="space-y-4">
               

                <div className="space-y-4">
                  <Label
                    htmlFor="images"
                    className="text-sm font-semibold text-zinc-700 dark:text-zinc-300"
                  >
                    🖼️ Product Images
                  </Label>

                  {/*   main preview */}

                  <div className="w-full rounded-2xl overflow-hidden border-2 border-zinc-200 dark:border-zinc-700 shadow-lg hover:shadow-xl transition-shadow duration-200 cursor-pointer">
                    <img
                      src={mainImagePreview}
                      alt="Main product"
                      className="w-full h-72 object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  <div className="flex items-center gap-4 flex-wrap">
                    {images.map((image, index) => (
                      <div
                        key={index}
                        className={`relative w-24 h-24 rounded-xl overflow-hidden border-2 shadow-md hover:shadow-lg transition-all duration-200 group hover:scale-105 cursor-pointer ${
                          mainImagePreview === image.preview
                            ? "border-blue-500 ring-2 ring-blue-400"
                            : "border-zinc-300 dark:border-zinc-600"
                        }`}
                        onClick={() => setMainImagePreview(image.preview)}
                      >
                        <img
                          src={image.preview}
                          alt={`product image ${index + 1} `}
                          className="w-full h-full object-cover"
                        />

                        <Button
                          variant="destructive"
                          size="icon"
                          className="absolute top-1 right-1 h-7 w-7 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-lg"
                          onClick={() => removeImage(index)}
                        >
                          <X className="h-4 w-4" />
                          <span className="sr-only">Remove image</span>
                        </Button>
                      </div>
                    ))}
                    {images.length < 5 && (
                      <Button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="w-24 h-24 flex flex-col items-center justify-center gap-2 border-2 border-dashed border-zinc-300 dark:border-zinc-600 rounded-xl text-zinc-500 dark:text-zinc-400 hover:border-blue-500 hover:text-blue-500 dark:hover:border-blue-400 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200 hover:scale-105"
                        variant="outline"
                      >
                        <Upload className="h-6 w-6" />
                        <span className="text-xs font-semibold">Upload</span>
                      </Button>
                    )}
                  </div>

                  <Input
                    type="file"
                    id="images"
                    accept="image/*"
                    multiple
                    onChange={handleImagesUpload}
                    ref={fileInputRef}
                    className="hidden"
                  />

                  <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2">
                    📸 Upload multiple images. Hover on image to remove.
                  </p>
                </div>
              </div>
            </CardContent>
          </div>

          <CardFooter className="mt-8">
            <Button
              type="submit"
              className="w-full h-14 flex items-center justify-center gap-3 font-bold text-lg text-white rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
              disabled={isLoading}
            >
              {isLoading && <Loader2 className="animate-spin h-5 w-5" />}
              {isLoading ? "Adding product..." : "💾 Save Product"}
            </Button>
          </CardFooter>
        </form>
      </div>
    </div>
  );
};

export default AddProducts;
