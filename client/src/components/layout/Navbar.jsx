import { useState, useRef, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiHeart, FiShoppingBag, FiUser, FiChevronDown, FiLogOut, FiPackage, FiSettings, FiMenu } from 'react-icons/fi';
import { useAuth } from '../../hooks/useAuth';
import { useCart } from '../../hooks/useCart';
import { useWishlist } from '../../hooks/useWishlist';
import { productService } from '../../services/productService';
import { formatPrice } from '../../utils/formatPrice';
import Sidebar from './Sidebar';

const categories = [
  { name: 'Electronics', icon: '🔌' },
  { name: 'Clothing', icon: '👕' },
  { name: 'Home & Garden', icon: '🏡' },
  { name: 'Sports', icon: '⚽' },
  { name: 'Beauty', icon: '💄' },
];

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const { count: cartCount, open: openCart } = useCart();
  const { count: wishlistCount } = useWishlist();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMegaMenu, setShowMegaMenu] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const searchRef = useRef(null);
  const userMenuRef = useRef(null);
  const megaMenuRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const handler = setTimeout(async () => {
      if (searchQuery.trim().length >= 2) {
        try {
          const res = await productService.search(searchQuery);
          setSearchResults(res.data);
          setShowSearch(true);
        } catch { setSearchResults([]); }
      } else { setSearchResults([]); setShowSearch(false); }
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  useEffect(() => {
    const handleClick = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) setShowUserMenu(false);
      if (megaMenuRef.current && !megaMenuRef.current.contains(e.target)) setShowMegaMenu(false);
      if (searchRef.current && !searchRef.current.contains(e.target)) setShowSearch(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setShowSearch(false);
      setSearchQuery('');
    }
  };

  return (
    <>
      <div className="bg-primary text-white text-center text-xs sm:text-sm py-2 px-4">
        Free Shipping on orders $50+
      </div>
      <nav className={`sticky top-0 z-40 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm' : 'bg-white'}`}>
        <div className="container-custom">
          <div className="flex items-center justify-between h-16 md:h-20">
            <div className="flex items-center gap-4">
              <button className="lg:hidden p-2 hover:bg-gray-100 rounded-lg" onClick={() => setSidebarOpen(true)}>
                <FiMenu size={22} />
              </button>
              <Link to="/" className="flex items-center gap-2">
                <span className="text-2xl">🛍️</span>
                <span className="font-heading font-bold text-xl text-primary">ShopNest</span>
              </Link>
            </div>

            <div ref={megaMenuRef} className="hidden lg:flex items-center gap-6" onMouseEnter={() => setShowMegaMenu(true)} onMouseLeave={() => setShowMegaMenu(false)}>
              <Link to="/shop" className="text-sm font-medium text-textMuted hover:text-primary transition-colors">Home</Link>
              <div className="relative">
                <button className="flex items-center gap-1 text-sm font-medium text-textMuted hover:text-primary transition-colors">
                  Shop <FiChevronDown size={14} className={`transition-transform ${showMegaMenu ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {showMegaMenu && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute top-full left-0 mt-2 bg-white rounded-xl shadow-lg border border-border p-4 min-w-[400px] grid grid-cols-2 gap-2">
                      {categories.map((cat) => (
                        <Link key={cat.name} to={`/shop?category=${encodeURIComponent(cat.name)}`} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors" onClick={() => setShowMegaMenu(false)}>
                          <span className="text-xl">{cat.icon}</span>
                          <span className="text-sm font-medium">{cat.name}</span>
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <Link to="/shop" className="text-sm font-medium text-textMuted hover:text-primary transition-colors">All Products</Link>
            </div>

            <div ref={searchRef} className="hidden md:flex flex-1 max-w-md mx-6 relative">
              <form onSubmit={handleSearchSubmit} className="w-full">
                <div className="relative">
                  <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-textMuted" size={18} />
                  <input type="text" placeholder="Search products..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-gray-100 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all" />
                </div>
              </form>
              <AnimatePresence>
                {showSearch && searchResults.length > 0 && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-border max-h-96 overflow-y-auto z-50">
                    {searchResults.slice(0, 6).map((p) => (
                      <Link key={p._id} to={`/product/${p._id}`} className="flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors" onClick={() => { setShowSearch(false); setSearchQuery(''); }}>
                        <img src={p.images?.[0] || '/placeholder.jpg'} alt={p.name} className="w-10 h-10 object-cover rounded-lg" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{p.name}</p>
                          <p className="text-xs text-textMuted">{formatPrice(p.price)}</p>
                        </div>
                      </Link>
                    ))}
                    {searchResults.length > 6 && <div className="p-2 text-center text-xs text-textMuted border-t border-border">View all {searchResults.length} results</div>}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="flex items-center gap-2">
              <Link to="/wishlist" className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <FiHeart size={20} className="text-textMuted hover:text-primary" />
                {wishlistCount > 0 && <span className="absolute -top-0.5 -right-0.5 bg-danger text-white text-xs font-bold w-4 h-4 rounded-full flex items-center justify-center">{wishlistCount}</span>}
              </Link>
              <button onClick={openCart} className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <FiShoppingBag size={20} className="text-textMuted hover:text-primary" />
                {cartCount > 0 && <span className="absolute -top-0.5 -right-0.5 bg-secondary text-white text-xs font-bold w-4 h-4 rounded-full flex items-center justify-center">{cartCount}</span>}
              </button>
              <div ref={userMenuRef} className="relative">
                <button onClick={() => setShowUserMenu(!showUserMenu)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <FiUser size={20} className="text-textMuted hover:text-primary" />
                </button>
                <AnimatePresence>
                  {showUserMenu && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-lg border border-border py-2 min-w-[200px] z-50">
                      {isAuthenticated ? (
                        <>
                          <div className="px-4 py-2 border-b border-border">
                            <p className="text-sm font-medium">{user?.name}</p>
                            <p className="text-xs text-textMuted">{user?.email}</p>
                          </div>
                          <Link to="/profile" className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50" onClick={() => setShowUserMenu(false)}><FiUser size={15} /> Profile</Link>
                          <Link to="/orders" className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50" onClick={() => setShowUserMenu(false)}><FiPackage size={15} /> Orders</Link>
                          {user?.isAdmin && <Link to="/admin" className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50" onClick={() => setShowUserMenu(false)}><FiSettings size={15} /> Admin</Link>}
                          <button onClick={() => { logout(); setShowUserMenu(false); navigate('/'); }} className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50 w-full text-left text-danger"><FiLogOut size={15} /> Logout</button>
                        </>
                      ) : (
                        <>
                          <Link to="/login" className="block px-4 py-2 text-sm hover:bg-gray-50" onClick={() => setShowUserMenu(false)}>Login</Link>
                          <Link to="/register" className="block px-4 py-2 text-sm hover:bg-gray-50" onClick={() => setShowUserMenu(false)}>Register</Link>
                        </>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </nav>
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} categories={categories} onCategoryClick={() => setSidebarOpen(false)} />
    </>
  );
}
