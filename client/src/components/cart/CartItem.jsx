import { Link } from 'react-router-dom';
import { FiTrash2, FiMinus, FiPlus } from 'react-icons/fi';
import { useCart } from '../../hooks/useCart';
import { formatPrice } from '../../utils/formatPrice';

export default function CartItem({ item }) {
  const { updateQty, remove } = useCart();

  return (
    <div className="flex gap-3 p-3 bg-gray-50 rounded-xl">
      <Link to={`/product/${item._id}`} className="shrink-0">
        <img src={item.images?.[0] || '/placeholder.jpg'} alt={item.name} className="w-16 h-16 object-cover rounded-lg" />
      </Link>
      <div className="flex-1 min-w-0">
        <Link to={`/product/${item._id}`} className="text-sm font-medium truncate block hover:text-secondary transition-colors">{item.name}</Link>
        <p className="text-sm font-semibold text-primary mt-0.5">{formatPrice(item.price)}</p>
        <div className="flex items-center gap-2 mt-2">
          <button onClick={() => updateQty(item._id, item.qty - 1)} disabled={item.qty <= 1} className="p-1 hover:bg-gray-200 rounded disabled:opacity-30"><FiMinus size={14} /></button>
          <span className="w-8 text-center text-sm font-medium">{item.qty}</span>
          <button onClick={() => updateQty(item._id, item.qty + 1)} className="p-1 hover:bg-gray-200 rounded"><FiPlus size={14} /></button>
          <button onClick={() => remove(item._id)} className="ml-auto p-1.5 text-gray-400 hover:text-danger transition-colors"><FiTrash2 size={15} /></button>
        </div>
      </div>
    </div>
  );
}
