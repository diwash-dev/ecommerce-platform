import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk for fetching products
export const fetchProducts = createAsyncThunk(
  "product/fetchProducts",
  async (filters = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      if (filters.category && filters.category !== "All")
        params.append("category", filters.category);
      if (filters.price) params.append("price", filters.price);
      if (filters.search) params.append("search", filters.search);
      if (filters.page) params.append("page", filters.page);
      if (filters.limit) params.append("limit", filters.limit);

      const queryString = params.toString();
      const url = `${import.meta.env.VITE_API_URL}/get-product${queryString ? `?${queryString}` : ""}`;

      const response = await axios.get(url);
      return response.data?.data || [];
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  },
);

const productSlice = createSlice({
  name: "product",
  initialState: {
    products: [],
    loading: false,
    error: null,
    filters: { category: "", price: "", search: "" },
    pagination: {
      currentPage: 1,
      totalPages: 1,
      totalProducts: 0,
    },
  },

  reducers: {
    setProducts: (state, action) => {
      state.products = action.payload;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = { category: "", price: "", search: "" };
    },
    clearProducts: (state) => {
      state.products = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setProducts, setFilters, clearFilters, clearProducts } =
  productSlice.actions;
export default productSlice.reducer;
