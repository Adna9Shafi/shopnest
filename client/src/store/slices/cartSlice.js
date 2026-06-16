import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: { items: [], isOpen: false },
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      const exist = state.items.find((i) => i._id === item._id);
      if (exist) {
        exist.qty += item.qty || 1;
      } else {
        state.items.push({ ...item, qty: item.qty || 1 });
      }
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter((i) => i._id !== action.payload);
    },
    updateQty: (state, action) => {
      const { id, qty } = action.payload;
      const item = state.items.find((i) => i._id === id);
      if (item) item.qty = Math.max(1, qty);
    },
    clearCart: (state) => { state.items = []; },
    toggleCart: (state) => { state.isOpen = !state.isOpen; },
    openCart: (state) => { state.isOpen = true; },
    closeCart: (state) => { state.isOpen = false; },
  },
});

export const {
  addToCart, removeFromCart, updateQty, clearCart, toggleCart, openCart, closeCart,
} = cartSlice.actions;

export const selectCartItems = (state) => state.cart.items;
export const selectCartTotal = (state) =>
  state.cart.items.reduce((sum, i) => sum + i.price * i.qty, 0);
export const selectCartCount = (state) =>
  state.cart.items.reduce((sum, i) => sum + i.qty, 0);

export default cartSlice.reducer;
