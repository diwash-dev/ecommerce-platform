import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./ReduxSlice/authslice";
import cartSlice from "./ReduxSlice/cartslice";
import sliceproduct from "./ReduxSlice/sliceproduct";

export const store = configureStore({
  reducer: {
    //  Add your reducers here

    auth: authSlice,
    cart: cartSlice,
    Product: sliceproduct,
  },
});
