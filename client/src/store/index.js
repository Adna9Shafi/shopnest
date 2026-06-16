import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import cartReducer from './slices/cartSlice';
import wishlistReducer from './slices/wishlistSlice';

const preloadedState = {
  cart: JSON.parse(localStorage.getItem('cart') || '{"items":[],"isOpen":false}'),
  wishlist: JSON.parse(localStorage.getItem('wishlist') || '[]'),
};

const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    wishlist: wishlistReducer,
  },
  preloadedState,
});

store.subscribe(() => {
  const { cart, wishlist } = store.getState();
  localStorage.setItem('cart', JSON.stringify(cart));
  localStorage.setItem('wishlist', JSON.stringify(wishlist));
});

export default store;
