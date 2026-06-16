import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';
import { FiSave, FiGlobe, FiBell, FiEye, FiDollarSign } from 'react-icons/fi';

export default function AdminSettings() {
  const [general, setGeneral] = useState({ storeName: 'ShopNest', tagline: 'Your One-Stop Shop', email: 'hello@shopnest.com', phone: '+1 (555) 123-4567', currency: 'USD' });
  const [appearance, setAppearance] = useState({ theme: 'light', itemsPerPage: '12' });
  const [notifications, setNotifications] = useState({ orderPlaced: true, orderShipped: true, newUser: false, lowStock: true });
  const [saving, setSaving] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      toast.success('Settings saved successfully');
    }, 800);
  };

  return (
    <>
      <Helmet><title>Settings — ShopNest Admin</title></Helmet>
      <div className="space-y-6 max-w-3xl">
        <h1 className="text-2xl font-heading font-bold">Settings</h1>

        <form onSubmit={handleSave} className="space-y-6">
          <div className="card p-6 space-y-4">
            <div className="flex items-center gap-2 text-lg font-heading font-semibold"><FiGlobe size={18} /> General</div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-textMuted mb-1">Store Name</label>
                <input type="text" value={general.storeName} onChange={(e) => setGeneral({ ...general, storeName: e.target.value })} className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-secondary/40" />
              </div>
              <div>
                <label className="block text-sm font-medium text-textMuted mb-1">Tagline</label>
                <input type="text" value={general.tagline} onChange={(e) => setGeneral({ ...general, tagline: e.target.value })} className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-secondary/40" />
              </div>
              <div>
                <label className="block text-sm font-medium text-textMuted mb-1">Store Email</label>
                <input type="email" value={general.email} onChange={(e) => setGeneral({ ...general, email: e.target.value })} className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-secondary/40" />
              </div>
              <div>
                <label className="block text-sm font-medium text-textMuted mb-1">Phone</label>
                <input type="text" value={general.phone} onChange={(e) => setGeneral({ ...general, phone: e.target.value })} className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-secondary/40" />
              </div>
              <div>
                <label className="block text-sm font-medium text-textMuted mb-1">Currency</label>
                <select value={general.currency} onChange={(e) => setGeneral({ ...general, currency: e.target.value })} className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-secondary/40">
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="INR">INR (₹)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="card p-6 space-y-4">
            <div className="flex items-center gap-2 text-lg font-heading font-semibold"><FiEye size={18} /> Appearance</div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-textMuted mb-1">Theme</label>
                <select value={appearance.theme} onChange={(e) => setAppearance({ ...appearance, theme: e.target.value })} className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-secondary/40">
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-textMuted mb-1">Items Per Page</label>
                <select value={appearance.itemsPerPage} onChange={(e) => setAppearance({ ...appearance, itemsPerPage: e.target.value })} className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-secondary/40">
                  <option value="8">8</option>
                  <option value="12">12</option>
                  <option value="24">24</option>
                  <option value="48">48</option>
                </select>
              </div>
            </div>
          </div>

          <div className="card p-6 space-y-4">
            <div className="flex items-center gap-2 text-lg font-heading font-semibold"><FiBell size={18} /> Notifications</div>
            <div className="space-y-3">
              {[
                { key: 'orderPlaced', label: 'New Order Placed' },
                { key: 'orderShipped', label: 'Order Shipped' },
                { key: 'newUser', label: 'New User Registration' },
                { key: 'lowStock', label: 'Low Stock Alert' },
              ].map(({ key, label }) => (
                <label key={key} className="flex items-center justify-between py-1">
                  <span className="text-sm">{label}</span>
                  <input type="checkbox" checked={notifications[key]} onChange={(e) => setNotifications({ ...notifications, [key]: e.target.checked })} className="w-4 h-4 rounded border-border text-secondary focus:ring-secondary/40" />
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-end">
            <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2">
              <FiSave size={16} /> {saving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
