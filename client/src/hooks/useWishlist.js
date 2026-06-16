import { useSelector, useDispatch } from 'react-redux';
import { toggleWishlist } from '../store/slices/wishlistSlice';
import toast from 'react-hot-toast';

export function useWishlist() {
  const dispatch = useDispatch();
  const items = useSelector((s) => s.wishlist);

  const toggle = (product) => {
    dispatch(toggleWishlist(product));
    const id = product._id || product;
    const exists = items.some((i) => (i._id || i) === id);
    toast.success(exists ? 'Removed from wishlist' : 'Added to wishlist');
  };

  const isInWishlist = (id) => items.some((i) => (i._id || i) === id);

  return { items, count: items.length, toggle, isInWishlist };
}
