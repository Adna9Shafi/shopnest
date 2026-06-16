import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { FiGrid, FiPackage, FiShoppingCart, FiUsers, FiSettings, FiLogOut, FiChevronLeft } from 'react-icons/fi';

const links = [
  { to: '/admin', icon: FiGrid, label: 'Dashboard' },
  { to: '/admin/products', icon: FiPackage, label: 'Products' },
  { to: '/admin/orders', icon: FiShoppingCart, label: 'Orders' },
  { to: '/admin/users', icon: FiUsers, label: 'Users' },
  { to: '/admin/settings', icon: FiSettings, label: 'Settings' },
];

export default function AdminLayout() {
  const { pathname } = useLocation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-surface flex">
      <aside className="hidden lg:flex w-60 bg-primary text-white flex-col fixed inset-y-0 left-0 z-30">
        <div className="p-4 border-b border-white/10">
          <Link to="/admin" className="flex items-center gap-2">
            <span className="text-xl">🛍️</span>
            <span className="font-heading font-bold">ShopNest</span>
          </Link>
          <span className="text-xs text-white/50 mt-1 block">Admin Panel</span>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {links.map((link) => {
            const active = pathname === link.to || (link.to !== '/admin' && pathname.startsWith(link.to));
            return (
              <Link key={link.to} to={link.to} className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${active ? 'bg-white/10 text-white' : 'text-white/60 hover:text-white hover:bg-white/5'}`}>
                <link.icon size={18} /> {link.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-secondary/30 flex items-center justify-center text-sm font-semibold">{user?.name?.[0] || 'A'}</div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.name}</p>
              <p className="text-xs text-white/50">Admin</p>
            </div>
          </div>
          <button onClick={() => { logout(); navigate('/'); }} className="flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors w-full">
            <FiLogOut size={16} /> Logout
          </button>
        </div>
      </aside>

      <div className="lg:pl-60 flex-1 min-h-screen">
        <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-border flex items-center justify-between px-4 md:px-8 h-16">
          <Link to="/" className="flex items-center gap-1 text-sm text-textMuted hover:text-primary transition-colors">
            <FiChevronLeft size={16} /> Back to Store
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-sm text-textMuted hidden sm:inline">{user?.name}</span>
            <button onClick={() => { logout(); navigate('/'); }} className="lg:hidden p-2 hover:bg-gray-100 rounded-lg text-textMuted"><FiLogOut size={18} /></button>
          </div>
        </header>
        <main className="p-4 md:p-8"><Outlet /></main>
      </div>
    </div>
  );
}
