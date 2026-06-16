import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiSearch } from 'react-icons/fi';
import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';

export default function Sidebar({ isOpen, onClose, categories, onCategoryClick }) {
  const { isAuthenticated, logout } = useAuth();
  const [search, setSearch] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      window.location.href = `/shop?search=${encodeURIComponent(search.trim())}`;
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-50" onClick={onClose} />
          <motion.div initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} transition={{ type: 'tween', duration: 0.3 }} className="fixed top-0 left-0 bottom-0 w-80 bg-white z-50 shadow-xl">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <span className="font-heading font-bold text-lg">ShopNest</span>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg"><FiX size={20} /></button>
            </div>
            <form onSubmit={handleSearch} className="p-4 border-b border-border">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-textMuted" size={18} />
                <input type="text" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-gray-100 rounded-xl text-sm" />
              </div>
            </form>
            <div className="p-4">
              <p className="text-xs font-semibold text-textMuted uppercase tracking-wider mb-3">Categories</p>
              <div className="space-y-1">
                {categories.map((cat) => (
                  <Link key={cat.name} to={`/shop?category=${encodeURIComponent(cat.name)}`} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 text-sm" onClick={onCategoryClick}>
                    <span>{cat.icon}</span> {cat.name}
                  </Link>
                ))}
              </div>
            </div>
            <div className="border-t border-border p-4 space-y-2">
              {isAuthenticated ? (
                <>
                  <Link to="/profile" className="block p-3 rounded-lg hover:bg-gray-50 text-sm" onClick={onClose}>Profile</Link>
                  <Link to="/orders" className="block p-3 rounded-lg hover:bg-gray-50 text-sm" onClick={onClose}>Orders</Link>
                  <Link to="/wishlist" className="block p-3 rounded-lg hover:bg-gray-50 text-sm" onClick={onClose}>Wishlist</Link>
                  <button onClick={() => { logout(); onClose(); }} className="block w-full text-left p-3 rounded-lg hover:bg-gray-50 text-sm text-danger">Logout</button>
                </>
              ) : (
                <>
                  <Link to="/login" className="block p-3 rounded-lg hover:bg-gray-50 text-sm" onClick={onClose}>Login</Link>
                  <Link to="/register" className="block p-3 rounded-lg hover:bg-gray-50 text-sm" onClick={onClose}>Register</Link>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
