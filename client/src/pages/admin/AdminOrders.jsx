import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { orderService } from '../../services/orderService';
import { formatPrice } from '../../utils/formatPrice';
import { formatDate } from '../../utils/formatDate';
import Button from '../../components/ui/Button';
import Spinner from '../../components/ui/Spinner';
import toast from 'react-hot-toast';
import { FiSearch, FiChevronDown, FiChevronUp } from 'react-icons/fi';

const statusColors = { pending: 'bg-yellow-100 text-yellow-800', processing: 'bg-blue-100 text-blue-800', shipped: 'bg-purple-100 text-purple-800', delivered: 'bg-green-100 text-green-800', cancelled: 'bg-red-100 text-red-800' };
const STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [expanded, setExpanded] = useState(null);
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    orderService.getAll().then((res) => {
      setOrders(res.data);
      setFiltered(res.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    let result = orders;
    if (search) result = result.filter((o) => o.user?.name?.toLowerCase().includes(search.toLowerCase()) || o._id.toLowerCase().includes(search.toLowerCase()));
    if (statusFilter) result = result.filter((o) => o.status === statusFilter);
    setFiltered(result);
  }, [search, statusFilter, orders]);

  const handleStatusUpdate = async (id, status) => {
    setUpdating(id);
    try {
      await orderService.updateStatus(id, { status });
      setOrders((prev) => prev.map((o) => (o._id === id ? { ...o, status, isDelivered: status === 'delivered' ? true : o.isDelivered, deliveredAt: status === 'delivered' ? new Date().toISOString() : o.deliveredAt } : o)));
      toast.success(`Order status updated to ${status}`);
    } catch (err) { toast.error(err.response?.data?.message || 'Update failed'); }
    setUpdating(null);
  };

  const handleMarkPaid = async (id) => {
    setUpdating(id);
    try {
      await orderService.pay(id, { id: 'manual', status: 'completed', update_time: new Date().toISOString(), email_address: 'admin@shopnest.com' });
      setOrders((prev) => prev.map((o) => (o._id === id ? { ...o, isPaid: true, paidAt: new Date().toISOString(), status: 'processing' } : o)));
      toast.success('Order marked as paid');
    } catch (err) { toast.error(err.response?.data?.message || 'Update failed'); }
    setUpdating(null);
  };

  return (
    <>
      <Helmet><title>Manage Orders — ShopNest Admin</title></Helmet>
      <div className="space-y-6">
        <h1 className="text-2xl font-heading font-bold">Orders</h1>

        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 max-w-xs">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-textMuted" size={16} />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by order ID or name..." className="w-full pl-9 pr-4 py-2 border border-border rounded-lg text-sm" />
          </div>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-3 py-2 border border-border rounded-lg text-sm">
            <option value="">All Statuses</option>
            {STATUSES.map((s) => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
          </select>
        </div>

        {loading ? <Spinner className="py-12" /> : (
          <div className="space-y-3">
            {filtered.map((order) => (
              <div key={order._id} className="card overflow-hidden">
                <button onClick={() => setExpanded(expanded === order._id ? null : order._id)} className="w-full flex items-center justify-between p-4 hover:bg-gray-50/50 transition-colors">
                  <div className="flex items-center gap-6 text-sm">
                    <span className="font-mono font-medium">#{order._id.slice(-8).toUpperCase()}</span>
                    <span>{order.user?.name || order.user?.email || 'N/A'}</span>
                    <span className="text-textMuted hidden md:inline">{formatDate(order.createdAt)}</span>
                    <span className="font-medium">{formatPrice(order.totalPrice)}</span>
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${statusColors[order.status] || 'bg-gray-100'}`}>{order.status}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-textMuted">{order.orderItems?.length || 0} items</span>
                    {expanded === order._id ? <FiChevronUp size={18} className="text-textMuted" /> : <FiChevronDown size={18} className="text-textMuted" />}
                  </div>
                </button>

                {expanded === order._id && (
                  <div className="border-t border-border p-4 bg-gray-50/30 space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-xs font-semibold text-textMuted uppercase tracking-wider mb-2">Shipping Address</h4>
                        <p className="text-sm">{order.shippingAddress?.address}</p>
                        <p className="text-sm">{order.shippingAddress?.city}, {order.shippingAddress?.postalCode}</p>
                        <p className="text-sm">{order.shippingAddress?.country}</p>
                      </div>
                      <div>
                        <h4 className="text-xs font-semibold text-textMuted uppercase tracking-wider mb-2">Payment</h4>
                        <p className="text-sm">{order.paymentMethod}</p>
                        <p className="text-sm">Paid: {order.isPaid ? <span className="text-success font-medium">Yes {order.paidAt ? `(${formatDate(order.paidAt)})` : ''}</span> : <span className="text-danger font-medium">No</span>}</p>
                        <p className="text-sm">Delivered: {order.isDelivered ? <span className="text-success font-medium">Yes</span> : <span className="text-textMuted">No</span>}</p>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-xs font-semibold text-textMuted uppercase tracking-wider mb-2">Items</h4>
                      {order.orderItems?.map((item, i) => (
                        <div key={i} className="flex items-center gap-3 py-2 border-b border-border/50 last:border-0">
                          <img src={item.image || ''} alt={item.name} className="w-10 h-10 object-cover rounded" />
                          <span className="flex-1 text-sm">{item.name}</span>
                          <span className="text-sm text-textMuted">{item.qty} x {formatPrice(item.price)}</span>
                          <span className="text-sm font-medium">{formatPrice(item.qty * item.price)}</span>
                        </div>
                      ))}
                    </div>

                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <h4 className="text-xs font-semibold text-textMuted uppercase tracking-wider mb-2">Update Status</h4>
                        <div className="flex flex-wrap gap-2">
                          {STATUSES.map((s) => (
                            <button key={s} disabled={updating === order._id || order.status === s} onClick={() => handleStatusUpdate(order._id, s)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${order.status === s ? 'bg-primary text-white' : 'bg-gray-100 hover:bg-gray-200 text-textMuted'}`}>
                              {s}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-xs font-semibold text-textMuted uppercase tracking-wider mb-2">Mark Payment</h4>
                        {order.isPaid ? (
                          <span className="text-xs text-success font-medium">Already paid</span>
                        ) : (
                          <Button size="sm" onClick={() => handleMarkPaid(order._id)} disabled={updating === order._id}>Mark as Paid</Button>
                        )}
                      </div>
                      <div>
                        <h4 className="text-xs font-semibold text-textMuted uppercase tracking-wider mb-2">Price Breakdown</h4>
                        <div className="text-xs space-y-1">
                          <div className="flex justify-between"><span>Items</span><span>{formatPrice(order.itemsPrice)}</span></div>
                          <div className="flex justify-between"><span>Shipping</span><span>{order.shippingPrice === 0 ? 'FREE' : formatPrice(order.shippingPrice)}</span></div>
                          <div className="flex justify-between"><span>Tax</span><span>{formatPrice(order.taxPrice)}</span></div>
                          <div className="flex justify-between font-semibold"><span>Total</span><span>{formatPrice(order.totalPrice)}</span></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
            {filtered.length === 0 && <div className="text-center py-12 text-textMuted">No orders found</div>}
          </div>
        )}
      </div>
    </>
  );
}
