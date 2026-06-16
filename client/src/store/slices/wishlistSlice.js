import { createSlice } from '@reduxjs/toolkit';

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: [],
  reducers: {
    toggleWishlist: (state, action) => {
      const id = action.payload._id || action.payload;
      const exists = state.find((item) => (item._id || item) === id);
      if (exists) {
        return state.filter((item) => (item._id || item) !== id);
      }
      state.push(action.payload);
    },
    clearWishlist: () => [],
  },
});

export const { toggleWishlist, clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
