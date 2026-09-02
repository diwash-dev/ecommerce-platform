import { Edit, Search, Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Label } from "../label";
import { Input } from "../input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../select";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../card";
import { Button } from "../button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../dialog";
import { Textarea } from "../textarea";

import { useDispatch, useSelector } from "react-redux";
import { setProducts } from "../../../Redux/ReduxSlice/sliceproduct";
import Error from "@/hooks/Error";
import { useToast } from "@/hooks/use-toast";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../pagination";

const ProductManagement = () => {
  const [category, setCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [noResultsMessage, setNoResultsMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8;
  const dispatch = useDispatch();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editCategory, setEditCategory] = useState("");
  const { toast } = useToast();
  const { handleErrorLogout } = Error();

  const { products } = useSelector((state) => state.Product);

  const refreshProducts = async () => {
    const refreshRes = await axios.get(
      `${import.meta.env.VITE_API_URL}/get-product?category=${category}&search=${searchQuery}`,
    );
    dispatch(setProducts(refreshRes.data.data));
  };

  const handleDeleteProduct = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?",
    );

    if (!confirmed) return;

    try {
      const res = await axios.delete(
        import.meta.env.VITE_API_URL + "/delete-product/" + id,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      const { message } = res.data;
      toast({
        title: "Product Deleted",
        description: message,
        variant: "destructive",
      });

      await refreshProducts();
    } catch (error) {
      handleErrorLogout(error, "Failed to delete product. Please try again.");
    }
  };
  // handle edit button click
  const handleEdit = (product) => {
    setEditingProduct(product);
    setEditCategory(product.category);
    setIsEditModalOpen(true);
  };

  // fetch products based on search and filter
  useEffect(() => {
    const getFilterProducts = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/get-product?category=${category}&search=${searchQuery}`,
        );

        const data = res.data;
        dispatch(setProducts(data.data));
        setNoResultsMessage("");
        setCurrentPage(1);
      } catch (error) {
        if (error?.response?.status === 404) {
          dispatch(setProducts([]));
          setNoResultsMessage("No products found for the selected filter.");
          setCurrentPage(1);
          return;
        }

        dispatch(setProducts([]));
        setNoResultsMessage("Failed to load products. Please try again.");
        setCurrentPage(1);
        console.error("Error fetching products:", error);
      }
    };

    getFilterProducts();
  }, [searchQuery, category, dispatch]);

  const totalPages = Math.max(
    1,
    Math.ceil((products?.length || 0) / productsPerPage),
  );
  const paginatedProducts =
    products?.slice(
      (currentPage - 1) * productsPerPage,
      currentPage * productsPerPage,
    ) || [];

  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const updatedData = {
      name: formData.get("product-name"),
      description: formData.get("description"),
      price: parseFloat(formData.get("price")),
      category: editCategory,
    };

    try {
      const res = await axios.put(
        import.meta.env.VITE_API_URL + `/update-product/${editingProduct._id}`,
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      const { message } = res.data;
      toast({
        title: "Product Updated",
        description: message,
        variant: "default",
      });

      // Refresh products
      await refreshProducts();

      setIsEditModalOpen(false);
      setEditingProduct(null);
    } catch (error) {
      handleErrorLogout(error, "Failed to update product. Please try again.");
    }
  };

  return (
    <div className="mx-auto px-4 sm:px-5 lg:px-8 rounded-lg w-full min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-900 py-4 sm:py-6 lg:py-8">
      <div className="text-center mb-4 sm:mb-6 lg:mb-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent mb-2 sm:mb-3">
          📦 Product Management
        </h1>
        <p className="text-sm sm:text-base lg:text-lg text-zinc-600 dark:text-zinc-400 mt-1 sm:mt-2 px-4">
          Manage your products, update details, and keep your inventory up
          to-date with ease.
        </p>
      </div>

      {/* search and filter */}

      <div className="mb-6 sm:mb-8 lg:mb-9 max-w-5xl mx-auto px-2">
        <form className="flex flex-col sm:flex-row gap-3 sm:gap-4 lg:gap-5 items-stretch sm:items-end">
          <div className="flex-1 w-full sm:min-w-[300px] lg:min-w-[400px]">
            <div className="relative">
              <Input
                type="text"
                id="product-search"
                placeholder="Search products"
                className="pl-10 h-11 sm:h-12 rounded-xl bg-zinc-50 dark:bg-zinc-900 border-2 border-zinc-300 dark:border-zinc-600 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/30 shadow-lg transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search
                size={18}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 dark:text-zinc-500"
              />
            </div>
          </div>
          <div className="w-full sm:w-64 lg:w-72">
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger
                id="category"
                className="h-11 sm:h-12 rounded-xl bg-zinc-50 dark:bg-zinc-900 border-2 border-zinc-300 dark:border-zinc-600 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/30 shadow-lg transition-all"
              >
                <SelectValue placeholder="🏷️ Select a category" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="all">All Category</SelectItem>
                <SelectItem value="Monitor">Monitor</SelectItem>
                <SelectItem value="Laptop">Laptop</SelectItem>
                <SelectItem value="Mobile">Mobile</SelectItem>
                <SelectItem value="Camera">Camera</SelectItem>
                <SelectItem value="RAM">RAM</SelectItem>
                <SelectItem value="Speaker">Speaker</SelectItem>
                <SelectItem value="Headphone">Headphone</SelectItem>
                <SelectItem value="Mouse">Mouse</SelectItem>
                <SelectItem value="Keyboard">Keyboard</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </form>
      </div>

      {/*       product details */}

      {products?.length === 0 ? (
        <div className="max-w-2xl mx-auto mt-10 rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white/90 dark:bg-zinc-800/90 shadow-lg p-6 sm:p-8 text-center">
          <h3 className="text-lg sm:text-xl font-bold text-zinc-800 dark:text-zinc-100 mb-2">
            No Products Found
          </h3>
          <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400">
            {noResultsMessage ||
              "No products found. Try adjusting your search or filter criteria."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6 mx-0">
          {paginatedProducts?.map((product) => (
            <Card
              key={product._id}
              className="flex flex-col bg-white dark:bg-zinc-800 shadow-lg sm:shadow-xl border-2 rounded-xl sm:rounded-2xl hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 border-zinc-200 dark:border-zinc-700"
            >
              <div className="relative">
                <img
                  src={product.images}
                  className="rounded-t-xl sm:rounded-t-2xl h-40 sm:h-48 w-full object-cover ring-2 ring-zinc-100 dark:ring-zinc-700"
                  alt={product.name}
                />
              </div>
              <CardContent className="flex-grow p-4 sm:p-5 flex flex-col justify-between">
                <h2 className="text-lg sm:text-xl font-bold text-zinc-800 dark:text-zinc-100 mb-2">
                  {product.name}
                </h2>
                <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mb-3 sm:mb-4 line-clamp-2">
                  {product.description}
                </p>
                <div className="flex items-center justify-between border-t border-zinc-200 dark:border-zinc-700 pt-2 sm:pt-3">
                  <p className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
                    Rs. {product.price.toFixed(2)}
                  </p>
                  <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 sm:px-3 py-1 rounded-full font-semibold">
                    In Stock
                  </span>
                </div>
              </CardContent>

              <CardFooter className="p-3 sm:p-4 pt-2 flex flex-col gap-2">
                <Button
                  variant="outline"
                  onClick={() => handleEdit(product)}
                  className="h-10 sm:h-11 text-sm border-2 border-blue-400 dark:border-blue-500 text-blue-600 dark:text-blue-400 hover:bg-blue-500 hover:text-white dark:hover:bg-blue-600 font-semibold rounded-xl transition-all hover:scale-105 active:scale-95 w-full"
                >
                  <Edit className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                  Edit
                </Button>
                <Button
                  onClick={() => handleDeleteProduct(product._id)}
                  className="h-10 sm:h-11 text-sm font-semibold rounded-xl transition-all hover:scale-105 active:scale-95 shadow-md w-full flex items-center justify-center bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700 text-white"
                >
                  <Trash2 className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                  Delete
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {products?.length > 0 && (
        <div className="mt-8">
          <Pagination className="justify-center">
            <PaginationContent className="flex-wrap gap-2">
              <PaginationItem>
                <PaginationPrevious
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  className={
                    currentPage === 1
                      ? "pointer-events-none opacity-40 rounded-xl border border-zinc-200 dark:border-zinc-700"
                      : "cursor-pointer rounded-xl border border-zinc-200 hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
                  }
                />
              </PaginationItem>

              {Array.from({ length: totalPages }, (_, index) => index + 1).map(
                (page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      isActive={currentPage === page}
                      onClick={() => setCurrentPage(page)}
                      className="cursor-pointer rounded-xl border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ),
              )}

              <PaginationItem>
                <PaginationNext
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  className={
                    currentPage === totalPages
                      ? "pointer-events-none opacity-40 rounded-xl border border-zinc-200 dark:border-zinc-700"
                      : "cursor-pointer rounded-xl border border-zinc-200 hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      {/* Dialog box for editing product details */}
      {/* open={true} */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="w-[95vw] sm:w-full max-w-2xl rounded-2xl p-0 shadow-2xl border-2 border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 animate-in fade-in zoom-in-95 duration-300">
          <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-zinc-200 dark:border-zinc-700">
            <DialogHeader className="space-y-1">
              <DialogTitle className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
                ✏️ Edit Product
              </DialogTitle>
              <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
                Update product information below
              </p>
            </DialogHeader>
          </div>

          <form
            onSubmit={handleEditSubmit}
            className="px-4 sm:px-6 py-4 sm:py-6"
          >
            <div className="space-y-4 sm:space-y-6">
              <div className="space-y-2 ">
                <Label
                  htmlFor="product-name"
                  className="text-left text-sm font-semibold text-zinc-700 dark:text-zinc-300"
                >
                  📦 Product Name
                </Label>
                <Input
                  type="text"
                  name="product-name"
                  id="product-name"
                  defaultValue={editingProduct?.name || "Dell Monitor"}
                  className="h-12 px-4 rounded-xl border-2 border-zinc-300 dark:border-zinc-600 bg-zinc-50 dark:bg-zinc-900 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/30 transition-all"
                />
              </div>
              <div className="space-y-2 ">
                <Label
                  htmlFor="description"
                  className="text-left text-sm font-semibold text-zinc-700 dark:text-zinc-300"
                >
                  📝 Description
                </Label>
                <Textarea
                  name="description"
                  id="description"
                  defaultValue={
                    editingProduct?.description || "High quality monitor"
                  }
                  rows={3}
                  className="resize-none px-4 py-3 rounded-xl border-2 border-zinc-300 dark:border-zinc-600 bg-zinc-50 dark:bg-zinc-900 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/30 transition-all"
                />
              </div>

              {/* price + category */}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2 ">
                  <Label
                    htmlFor="price"
                    className="text-left text-sm font-semibold text-zinc-700 dark:text-zinc-300"
                  >
                    💰 Price
                  </Label>
                  <Input
                    type="number"
                    name="price"
                    id="price"
                    defaultValue={editingProduct?.price || 0}
                    className="h-12 px-4 rounded-xl border-2 border-zinc-300 dark:border-zinc-600 bg-zinc-50 dark:bg-zinc-900 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/30 transition-all"
                  />
                </div>
                <div className="space-y-2 ">
                  <Label
                    htmlFor="category"
                    className="text-left text-sm font-semibold text-zinc-700 dark:text-zinc-300"
                  >
                    🏷️ Category
                  </Label>
                  <Select value={editCategory} onValueChange={setEditCategory}>
                    <SelectTrigger className="h-12 rounded-xl border-2 border-zinc-300 dark:border-zinc-600 bg-zinc-50 dark:bg-zinc-900 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/30 transition-all">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Category</SelectItem>
                      <SelectItem value="Monitor">Monitor</SelectItem>
                      <SelectItem value="Laptop">Laptop </SelectItem>
                      <SelectItem value="Mobile">Mobile</SelectItem>
                      <SelectItem value="Camera">Camera</SelectItem>
                      <SelectItem value="RAM">RAM </SelectItem>
                      <SelectItem value="Speaker">Speaker</SelectItem>
                      <SelectItem value="Headphone">Headphone</SelectItem>
                      <SelectItem value="Mouse">Mouse</SelectItem>
                      <SelectItem value="Keyboard">Keyboard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <div className="px-4 sm:px-6 py-3 sm:py-4 border-t  flex justify-end gap-2 sm:gap-3">
              <Button
                type="submit"
                className="h-11 sm:h-12 text-sm sm:text-base bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-xl px-6 sm:px-8 transition-all hover:scale-105 active:scale-95 shadow-lg"
              >
                💾 Save Changes
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductManagement;
