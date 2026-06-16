import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { orderService } from '../services/orderService';
import { formatPrice } from '../utils/formatPrice';
import { formatDate } from '../utils/formatDate';
import Spinner from '../components/ui/Spinner';
import EmptyState from '../components/ui/EmptyState';
import { FiPackage } from 'react-icons/fi';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderService.getMyOrders().then((res) => { setOrders(res.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="container-custom py-20"><Spinner /></div>;

  const statusColors = { pending: 'text-yellow-600', processing: 'text-blue-600', shipped: 'text-purple-600', delivered: 'text-green-600', cancelled: 'text-red-600' };

  return (
    <>
      <Helmet><title>My Orders — ShopNest</title></Helmet>
      <div className="container-custom py-8">
        <h1 className="text-2xl font-heading font-bold mb-6">My Orders</h1>
        {orders.length === 0 ? (
          <EmptyState icon={FiPackage} title="No orders yet" description="Place your first order to see it here" actionLabel="Start Shopping" onAction={() => window.location.href = '/shop'} />
        ) : (
          <div className="space-y-3">
            {orders.map((order) => (
              <Link key={order._id} to={`/orders/${order._id}`} className="card p-4 flex items-center justify-between hover:shadow-md transition-shadow">
                <div>
                  <p className="text-sm font-medium">Order #{order._id.slice(-8).toUpperCase()}</p>
                  <p className="text-xs text-textMuted">{formatDate(order.createdAt)} — {order.orderItems.length} item(s)</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold">{formatPrice(order.totalPrice)}</p>
                  <p className={`text-xs font-medium ${statusColors[order.status] || 'text-gray-500'}`}>{order.status}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
