import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../hooks/useAuth';
import { useWishlist } from '../hooks/useWishlist';
import { orderService } from '../services/orderService';
import { formatPrice } from '../utils/formatPrice';
import { formatDate } from '../utils/formatDate';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';
import EmptyState from '../components/ui/EmptyState';
import { FiUser, FiPackage, FiHeart, FiSettings, FiPackage as FiOrders } from 'react-icons/fi';
import Alert from '../components/ui/Alert';

const tabs = [
  { id: 'profile', label: 'Profile Info', icon: FiUser },
  { id: 'orders', label: 'Order History', icon: FiOrders },
  { id: 'wishlist', label: 'Wishlist', icon: FiHeart },
  { id: 'settings', label: 'Settings', icon: FiSettings },
];

const statusColors = { pending: 'text-yellow-600 bg-yellow-50', processing: 'text-blue-600 bg-blue-50', shipped: 'text-purple-600 bg-purple-50', delivered: 'text-green-600 bg-green-50', cancelled: 'text-red-600 bg-red-50' };

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, isAuthenticated, fetchProfile, updateProfile, loading } = useAuth();
  const { items: wishlistItems } = useWishlist();
  const [activeTab, setActiveTab] = useState('profile');
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [avatar, setAvatar] = useState('');
  const [saving, setSaving] = useState(false);
  const [notifications, setNotifications] = useState({ email: true, sms: false, promo: true });

  useEffect(() => {
    if (!isAuthenticated) { navigate('/login'); return; }
    fetchProfile().then((u) => {
      if (u) { setName(u.name || ''); setEmail(u.email || ''); setAvatar(u.avatar || ''); }
    });
  }, [isAuthenticated, navigate, fetchProfile]);

  useEffect(() => {
    if (activeTab === 'orders') {
      setOrdersLoading(true);
      orderService.getMyOrders().then((res) => { setOrders(res.data); setOrdersLoading(false); }).catch(() => setOrdersLoading(false));
    }
  }, [activeTab]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const data = { name, email, avatar };
      if (password.trim()) data.password = password;
      await updateProfile(data);
      setPassword('');
    } catch { /* handled */ }
    setSaving(false);
  };

  return (
    <>
      <Helmet><title>My Profile — ShopNest</title></Helmet>
      <div className="container-custom py-8">
        <h1 className="text-2xl font-heading font-bold mb-6">My Profile</h1>
        <div className="grid md:grid-cols-4 gap-6">
          <div className="md:col-span-1">
            <div className="card p-4 space-y-1">
              {tabs.map((tab) => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === tab.id ? 'bg-secondary/10 text-secondary' : 'text-textMuted hover:bg-gray-50'}`}>
                  <tab.icon size={18} /> {tab.label}
                </button>
              ))}
            </div>
          </div>
          <div className="md:col-span-3">
            {activeTab === 'profile' && (
              <div className="card p-6">
                <h3 className="font-heading font-semibold mb-4">Profile Information</h3>
                <form onSubmit={handleUpdateProfile} className="space-y-4 max-w-md">
                  <div>
                    <label className="block text-sm font-medium mb-1">Avatar URL</label>
                    <div className="flex items-center gap-3">
                      {avatar && <img src={avatar} alt="" className="w-10 h-10 rounded-full object-cover" />}
                      <input value={avatar} onChange={(e) => setAvatar(e.target.value)} type="url" className="flex-1 px-4 py-2.5 border border-border rounded-lg text-sm" placeholder="https://example.com/avatar.jpg" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Name</label>
                    <input value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-2.5 border border-border rounded-lg text-sm" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" className="w-full px-4 py-2.5 border border-border rounded-lg text-sm" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">New Password <span className="text-textMuted font-normal">(leave blank to keep current)</span></label>
                    <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" className="w-full px-4 py-2.5 border border-border rounded-lg text-sm" placeholder="••••••••" />
                  </div>
                  <Button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</Button>
                </form>
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="card p-6">
                <h3 className="font-heading font-semibold mb-4">Order History</h3>
                {ordersLoading ? <Spinner /> : orders.length === 0 ? (
                  <EmptyState icon={FiPackage} title="No orders yet" description="Place your first order to see it here" actionLabel="Start Shopping" onAction={() => navigate('/shop')} />
                ) : (
                  <div className="space-y-2">
                    {orders.map((order) => (
                      <Link key={order._id} to={`/orders/${order._id}`} className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 border border-border/50 transition-colors">
                        <div>
                          <p className="text-sm font-medium">Order #{order._id.slice(-8).toUpperCase()}</p>
                          <p className="text-xs text-textMuted">{formatDate(order.createdAt)} — {order.orderItems.length} item(s)</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold">{formatPrice(order.totalPrice)}</p>
                          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusColors[order.status] || 'text-gray-500 bg-gray-50'}`}>{order.status}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'wishlist' && (
              <div className="card p-6">
                <h3 className="font-heading font-semibold mb-4">My Wishlist</h3>
                {wishlistItems.length === 0 ? (
                  <EmptyState icon={FiHeart} title="Wishlist is empty" description="Save items you love" actionLabel="Browse Products" onAction={() => navigate('/shop')} />
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {wishlistItems.map((item) => {
                      const id = item._id || item;
                      const name = item.name || `Product`;
                      const price = item.price || 0;
                      const img = item.images?.[0] || '';
                      return (
                        <Link key={id} to={`/product/${id}`} className="flex items-center gap-3 p-3 rounded-lg border border-border/50 hover:bg-gray-50 transition-colors">
                          <img src={img || '/placeholder.jpg'} alt={name} className="w-16 h-16 object-cover rounded-lg" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{name}</p>
                            {price > 0 && <p className="text-sm font-semibold text-primary">{formatPrice(price)}</p>}
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="card p-6 space-y-6">
                <h3 className="font-heading font-semibold mb-4">Notification Preferences</h3>
                {[
                  { key: 'email', label: 'Email Notifications', desc: 'Order updates and receipts via email' },
                  { key: 'sms', label: 'SMS Notifications', desc: 'Shipping and delivery updates via text' },
                  { key: 'promo', label: 'Promotional Emails', desc: 'Sales, new arrivals, and exclusive offers' },
                ].map(({ key, label, desc }) => (
                  <label key={key} className="flex items-center justify-between py-3 border-b border-border/50 last:border-0">
                    <div><p className="text-sm font-medium">{label}</p><p className="text-xs text-textMuted">{desc}</p></div>
                    <button onClick={() => setNotifications((p) => ({ ...p, [key]: !p[key] }))} className={`relative w-11 h-6 rounded-full transition-colors ${notifications[key] ? 'bg-secondary' : 'bg-gray-300'}`}>
                      <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${notifications[key] ? 'translate-x-5' : ''}`} />
                    </button>
                  </label>
                ))}
                <Alert type="info" message="Settings are saved locally for now. Full sync coming soon." />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
