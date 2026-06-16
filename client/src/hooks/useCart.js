import { useSelector, useDispatch } from 'react-redux';
import { addToCart, removeFromCart, updateQty, clearCart, openCart, closeCart, selectCartItems, selectCartTotal, selectCartCount } from '../store/slices/cartSlice';

export function useCart() {
  const dispatch = useDispatch();
  const items = useSelector(selectCartItems);
  const total = useSelector(selectCartTotal);
  const count = useSelector(selectCartCount);
  const isOpen = useSelector((s) => s.cart.isOpen);

  return {
    items, total, count, isOpen,
    add: (product, qty = 1) => dispatch(addToCart({ ...product, qty })),
    remove: (id) => dispatch(removeFromCart(id)),
    updateQty: (id, qty) => dispatch(updateQty({ id, qty })),
    clear: () => dispatch(clearCart()),
    open: () => dispatch(openCart()),
    close: () => dispatch(closeCart()),
  };
}
