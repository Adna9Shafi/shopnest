import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { orderService } from '../services/orderService';
import { formatPrice } from '../utils/formatPrice';
import { formatDate } from '../utils/formatDate';
import Spinner from '../components/ui/Spinner';

export default function OrderDetailPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderService.getById(id).then((res) => { setOrder(res.data); setLoading(false); }).catch(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="container-custom py-20"><Spinner size="lg" /></div>;
  if (!order) return <div className="container-custom py-20 text-center text-textMuted">Order not found</div>;

  const statusColors = { pending: 'bg-yellow-100 text-yellow-800', processing: 'bg-blue-100 text-blue-800', shipped: 'bg-purple-100 text-purple-800', delivered: 'bg-green-100 text-green-800', cancelled: 'bg-red-100 text-red-800' };

  return (
    <>
      <Helmet><title>Order #{order._id.slice(-8)} — ShopNest</title></Helmet>
      <div className="container-custom py-8">
        <Link to="/orders" className="text-sm text-secondary hover:underline mb-4 inline-block">&larr; Back to Orders</Link>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-heading font-bold">Order #{order._id.slice(-8).toUpperCase()}</h1>
            <p className="text-sm text-textMuted">Placed on {formatDate(order.createdAt)}</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[order.status] || 'bg-gray-100'}`}>{order.status.toUpperCase()}</span>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <div className="card p-6">
              <h3 className="font-heading font-semibold mb-4">Items</h3>
              <div className="space-y-3">
                {order.orderItems.map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-lg" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{item.name}</p>
                      <p className="text-xs text-textMuted">Qty: {item.qty} x {formatPrice(item.price)}</p>
                    </div>
                    <span className="text-sm font-medium">{formatPrice(item.qty * item.price)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="card p-6">
              <h3 className="font-heading font-semibold mb-3">Shipping Address</h3>
              <div className="text-sm text-textMuted space-y-1">
                <p>{order.shippingAddress.address}</p>
                <p>{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
                <p>{order.shippingAddress.country}</p>
              </div>
            </div>
            <div className="card p-6">
              <h3 className="font-heading font-semibold mb-3">Payment</h3>
              <p className="text-sm">{order.paymentMethod}</p>
              <p className="text-sm text-textMuted">{order.isPaid ? `Paid on ${formatDate(order.paidAt)}` : 'Not paid'}</p>
            </div>
            <div className="card p-6">
              <h3 className="font-heading font-semibold mb-3">Order Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-textMuted">Items</span><span>{formatPrice(order.itemsPrice)}</span></div>
                <div className="flex justify-between"><span className="text-textMuted">Shipping</span><span>{order.shippingPrice === 0 ? 'FREE' : formatPrice(order.shippingPrice)}</span></div>
                <div className="flex justify-between"><span className="text-textMuted">Tax</span><span>{formatPrice(order.taxPrice)}</span></div>
                <div className="flex justify-between font-semibold text-primary pt-2 border-t border-border"><span>Total</span><span>{formatPrice(order.totalPrice)}</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
