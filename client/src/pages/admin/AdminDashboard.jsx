import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { orderService } from '../../services/orderService';
import { productService } from '../../services/productService';
import API from '../../services/api';
import { formatPrice } from '../../utils/formatPrice';
import { formatDate } from '../../utils/formatDate';
import Spinner from '../../components/ui/Spinner';
import { FiDollarSign, FiShoppingBag, FiUsers, FiPackage, FiTrendingUp, FiTrendingDown } from 'react-icons/fi';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const statusColors = { pending: 'bg-yellow-100 text-yellow-800', processing: 'bg-blue-100 text-blue-800', shipped: 'bg-purple-100 text-purple-800', delivered: 'bg-green-100 text-green-800', cancelled: 'bg-red-100 text-red-800' };
const PIE_COLORS = ['#6366F1', '#F59E0B', '#10B981', '#EF4444', '#8B5CF6'];

export default function AdminDashboard() {
  const [stats, setStats] = useState({ revenue: 0, orders: 0, users: 0, products: 0, prevOrders: 0 });
  const [recentOrders, setRecentOrders] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [orderStatusData, setOrderStatusData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ordersRes, usersRes, productsRes, featuredRes] = await Promise.all([
          orderService.getAll(),
          API.get('/users'),
          productService.getAll({ limit: 100 }),
          productService.getFeatured(),
        ]);

        const orders = ordersRes.data || [];
        const users = usersRes.data || [];
        const products = productsRes.data?.products || [];
        const totalProducts = productsRes.data?.total || products.length;

        const paidOrders = orders.filter((o) => o.isPaid);
        const revenue = paidOrders.reduce((sum, o) => sum + o.totalPrice, 0);

        const lastMonthOrders = orders.filter((o) => new Date(o.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));
        const prevMonthOrders = orders.filter((o) => {
          const d = new Date(o.createdAt);
          const now = new Date();
          return d > new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000) && d < new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        });

        setStats({ revenue, orders: orders.length, users: users.length, products: totalProducts, prevOrders: prevMonthOrders.length });

        setRecentOrders(orders.slice(0, 10));

        const last7 = [];
        for (let i = 6; i >= 0; i--) {
          const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
          const dayStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          const dayTotal = paidOrders.filter((o) => new Date(o.paidAt).toDateString() === d.toDateString()).reduce((s, o) => s + o.totalPrice, 0);
          last7.push({ day: dayStr, revenue: dayTotal });
        }
        setRevenueData(last7);

        const statusCounts = {};
        orders.forEach((o) => { statusCounts[o.status] = (statusCounts[o.status] || 0) + 1; });
        setOrderStatusData(Object.entries(statusCounts).map(([name, value]) => ({ name: name.charAt(0).toUpperCase() + name.slice(1), value })));

        const catCounts = {};
        products.forEach((p) => { catCounts[p.category] = (catCounts[p.category] || 0) + 1; });
        setCategoryData(Object.entries(catCounts).map(([name, value]) => ({ name, value })));

        const top = [...products].sort((a, b) => (b.numReviews * b.rating) - (a.numReviews * a.rating)).slice(0, 5);
        setTopProducts(top);
      } catch (err) { console.error('Dashboard fetch error:', err); }
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) return <div className="flex items-center justify-center py-20"><Spinner size="lg" /></div>;

  const statCards = [
    { label: 'Total Revenue', value: formatPrice(stats.revenue), icon: FiDollarSign, color: 'bg-green-50 text-green-600', trend: '+12.5%', trendUp: true },
    { label: 'Total Orders', value: stats.orders, icon: FiShoppingBag, color: 'bg-blue-50 text-blue-600', trend: `${stats.prevOrders > 0 ? '+' : ''}${Math.round((stats.orders - stats.prevOrders) / Math.max(stats.prevOrders, 1) * 100)}%`, trendUp: stats.orders >= stats.prevOrders },
    { label: 'Total Users', value: stats.users, icon: FiUsers, color: 'bg-purple-50 text-purple-600', trend: '+5.2%', trendUp: true },
    { label: 'Total Products', value: stats.products, icon: FiPackage, color: 'bg-orange-50 text-orange-600', trend: '+8.3%', trendUp: true },
  ];

  return (
    <>
      <Helmet><title>Admin Dashboard — ShopNest</title></Helmet>
      <div className="space-y-6">
        <h1 className="text-2xl font-heading font-bold">Dashboard</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((card) => (
            <div key={card.label} className="card p-5">
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2.5 rounded-lg ${card.color}`}><card.icon size={20} /></div>
                <span className={`flex items-center gap-1 text-xs font-medium ${card.trendUp ? 'text-green-600' : 'text-red-600'}`}>
                  {card.trendUp ? <FiTrendingUp size={14} /> : <FiTrendingDown size={14} />} {card.trend}
                </span>
              </div>
              <p className="text-2xl font-bold font-heading">{card.value}</p>
              <p className="text-sm text-textMuted">{card.label}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="card p-6">
            <h3 className="font-heading font-semibold mb-4">Revenue (Last 7 Days)</h3>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="#64748B" />
                <YAxis tick={{ fontSize: 12 }} stroke="#64748B" tickFormatter={(v) => `$${v}`} />
                <Tooltip formatter={(v) => formatPrice(v)} />
                <Line type="monotone" dataKey="revenue" stroke="#6366F1" strokeWidth={2} dot={{ fill: '#6366F1', r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="card p-6">
            <h3 className="font-heading font-semibold mb-4">Orders by Status</h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={orderStatusData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="#64748B" />
                <YAxis tick={{ fontSize: 12 }} stroke="#64748B" />
                <Tooltip />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {orderStatusData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="card p-6">
            <h3 className="font-heading font-semibold mb-4">Products by Category</h3>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={categoryData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {categoryData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="card p-6">
            <h3 className="font-heading font-semibold mb-4">Top Products</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-textMuted text-xs uppercase tracking-wider">
                    <th className="pb-3 font-medium">Product</th>
                    <th className="pb-3 font-medium">Price</th>
                    <th className="pb-3 font-medium">Rating</th>
                    <th className="pb-3 font-medium">Reviews</th>
                  </tr>
                </thead>
                <tbody>
                  {topProducts.map((p) => (
                    <tr key={p._id} className="border-t border-border/50">
                      <td className="py-3">
                        <Link to={`/product/${p._id}`} className="flex items-center gap-2 hover:text-secondary transition-colors">
                          <img src={p.images?.[0] || ''} alt={p.name} className="w-8 h-8 object-cover rounded" />
                          <span className="truncate max-w-[150px]">{p.name}</span>
                        </Link>
                      </td>
                      <td className="py-3 font-medium">{formatPrice(p.price)}</td>
                      <td className="py-3">{p.rating?.toFixed(1)}</td>
                      <td className="py-3">{p.numReviews}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-heading font-semibold">Recent Orders</h3>
            <Link to="/admin/orders" className="text-sm text-secondary hover:underline">View All</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-textMuted text-xs uppercase tracking-wider border-b border-border">
                  <th className="pb-3 font-medium">Order ID</th>
                  <th className="pb-3 font-medium">Customer</th>
                  <th className="pb-3 font-medium">Date</th>
                  <th className="pb-3 font-medium">Amount</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order._id} className="border-b border-border/50 hover:bg-gray-50/50">
                    <td className="py-3 font-mono text-xs">#{order._id.slice(-8).toUpperCase()}</td>
                    <td className="py-3">{order.user?.name || order.user?.email || 'N/A'}</td>
                    <td className="py-3 text-textMuted">{formatDate(order.createdAt)}</td>
                    <td className="py-3 font-medium">{formatPrice(order.totalPrice)}</td>
                    <td className="py-3"><span className={`text-xs font-semibold px-2 py-1 rounded-full ${statusColors[order.status] || 'bg-gray-100'}`}>{order.status}</span></td>
                    <td className="py-3"><Link to={`/admin/orders`} className="text-secondary hover:underline text-xs">View</Link></td>
                  </tr>
                ))}
                {recentOrders.length === 0 && <tr><td colSpan="6" className="py-8 text-center text-textMuted">No orders yet</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
