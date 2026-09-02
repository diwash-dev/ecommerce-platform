import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",

  initialState: {
    cartitems: [],
    totalprice: 0,
    totalquantity: 0,
  },
  reducers: {
    addToCart: (state, action) => {
      const newitem = action.payload;
      const existingitemIndex = state.cartitems.findIndex(
        (item) => item._id === newitem._id,
      );

      if (existingitemIndex === -1) {
        // New item - add to cart
        state.cartitems.push({
          ...newitem,
          quantity: newitem.quantity || 1,
          totalitemprice: newitem.price * (newitem.quantity || 1),
        });
        state.totalquantity += newitem.quantity || 1;
        state.totalprice = Number(
          (state.totalprice + newitem.price * (newitem.quantity || 1)).toFixed(
            2,
          ),
        );
      } else {
        // Existing item - increase quantity
        const existingitem = state.cartitems[existingitemIndex];
        const qtyToAdd = newitem.quantity || 1;
        existingitem.quantity += qtyToAdd;
        existingitem.totalitemprice += newitem.price * qtyToAdd;
        state.totalquantity += qtyToAdd;
        state.totalprice = Number(
          (state.totalprice + newitem.price * qtyToAdd).toFixed(2),
        );
      }
    },

    removeFromCart: (state, action) => {
      const itemToRemove = action.payload;
      const existingitemIndex = state.cartitems.findIndex(
        (item) => item._id === itemToRemove._id,
      );

      if (existingitemIndex === -1) return;

      const existingitem = state.cartitems[existingitemIndex];
      const qtyToRemove = itemToRemove.quantity || 1;

      existingitem.quantity -= qtyToRemove;
      existingitem.totalitemprice -= itemToRemove.price * qtyToRemove;
      state.totalquantity -= qtyToRemove;
      state.totalprice = Number(
        (state.totalprice - itemToRemove.price * qtyToRemove).toFixed(2),
      );

      if (existingitem.quantity <= 0) {
        state.cartitems.splice(existingitemIndex, 1);
      }
    },

    emptycart: (state) => {
      state.cartitems = [];
      state.totalprice = 0;
      state.totalquantity = 0;
    },
  },
});

export const { addToCart, removeFromCart, emptycart } = cartSlice.actions;
export default cartSlice.reducer;
