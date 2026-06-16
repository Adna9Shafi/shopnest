import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { shippingSchema } from '../utils/validators';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import { orderService } from '../services/orderService';
import { formatPrice } from '../utils/formatPrice';
import Button from '../components/ui/Button';
import toast from 'react-hot-toast';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { FiCheck, FiChevronLeft, FiChevronRight, FiTruck, FiCreditCard, FiFileText, FiLock } from 'react-icons/fi';

const US_STATES = ['Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut','Delaware','Florida','Georgia','Hawaii','Idaho','Illinois','Indiana','Iowa','Kansas','Kentucky','Louisiana','Maine','Maryland','Massachusetts','Michigan','Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire','New Jersey','New Mexico','New York','North Carolina','North Dakota','Ohio','Oklahoma','Oregon','Pennsylvania','Rhode Island','South Carolina','South Dakota','Tennessee','Texas','Utah','Vermont','Virginia','Washington','West Virginia','Wisconsin','Wyoming'];

const steps = [
  { num: 1, label: 'Shipping', icon: FiTruck },
  { num: 2, label: 'Payment', icon: FiCreditCard },
  { num: 3, label: 'Review', icon: FiFileText },
];

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, total, clear } = useCart();
  const { user, isAuthenticated } = useAuth();
  const [step, setStep] = useState(1);
  const [paypalClientId, setPaypalClientId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('PayPal');
  const [createdOrder, setCreatedOrder] = useState(null);
  const [shippingData, setShippingData] = useState(null);

  const {
    register, handleSubmit, formState: { errors }, trigger,
  } = useForm({
    resolver: yupResolver(shippingSchema),
    defaultValues: {
      fullName: user?.name || '',
      email: user?.email || '',
      phone: '',
      address: '',
      addressLine2: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'United States',
    },
  });

  useEffect(() => {
    if (!isAuthenticated) navigate('/login?redirect=/checkout');
    orderService.getPaypalConfig().then((res) => setPaypalClientId(res.data.clientId)).catch(() => {});
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (items.length === 0 && !createdOrder) navigate('/cart');
  }, [items, createdOrder, navigate]);

  const shippingPrice = total >= 50 ? 0 : 9.99;
  const taxPrice = total * 0.085;

  const handleShippingSubmit = async (data) => {
    const valid = await trigger();
    if (!valid) return;
    setShippingData(data);
    setStep(2);
    window.scrollTo(0, 0);
  };

  const createOrderOnServer = async () => {
    setSubmitting(true);
    try {
      const orderData = {
        orderItems: items.map((i) => ({ name: i.name, qty: i.qty, image: i.images?.[0] || '', price: i.price, product: i._id })),
        shippingAddress: shippingData,
        paymentMethod,
        itemsPrice: total,
        shippingPrice,
        taxPrice: Math.round(taxPrice * 100) / 100,
        totalPrice: Math.round((total + shippingPrice + taxPrice) * 100) / 100,
      };
      const res = await orderService.create(orderData);
      setCreatedOrder(res.data);
      return res.data;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Order creation failed');
      throw err;
    } finally {
      setSubmitting(false);
    }
  };

  const handlePaypalSuccess = async (details) => {
    try {
      await orderService.pay(createdOrder._id, {
        id: details.id,
        status: details.status,
        update_time: details.update_time,
        email_address: details.payer.email_address,
      });
      clear();
      toast.success('Payment successful!');
      navigate(`/order/${createdOrder._id}/success`);
    } catch {
      toast.error('Payment confirmation failed');
    }
  };

  const handlePlaceOrder = async () => {
    try {
      const order = await createOrderOnServer();
      setStep(3);
      window.scrollTo(0, 0);
      if (paymentMethod !== 'PayPal') {
        clear();
        navigate(`/order/${order._id}/success`);
      }
    } catch {
      // error handled in createOrderOnServer
    }
  };

  return (
    <>
      <Helmet><title>Checkout — ShopNest</title></Helmet>
      <div className="container-custom py-8">
        <h1 className="text-2xl font-heading font-bold mb-6">Checkout</h1>

        <div className="flex items-center justify-center gap-0 mb-10">
          {steps.map((s, i) => (
            <div key={s.num} className="flex items-center">
              <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${step >= s.num ? 'bg-primary text-white' : 'bg-gray-100 text-textMuted'}`}>
                <s.icon size={16} /> {s.label}
              </div>
              {i < steps.length - 1 && <div className={`w-12 h-0.5 ${step > s.num ? 'bg-primary' : 'bg-border'}`} />}
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {step === 1 && (
              <div className="card p-6">
                <h3 className="font-heading font-semibold mb-5 flex items-center gap-2"><FiTruck size={18} /> Shipping Address</h3>
                <form id="shipping-form" onSubmit={handleSubmit(handleShippingSubmit)} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-textMuted mb-1">Full Name *</label>
                      <input {...register('fullName')} className="w-full px-4 py-2.5 border border-border rounded-lg text-sm focus:ring-2 focus:ring-secondary/20" placeholder="John Doe" />
                      {errors.fullName && <p className="text-xs text-danger mt-1">{errors.fullName.message}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-textMuted mb-1">Email *</label>
                      <input {...register('email')} className="w-full px-4 py-2.5 border border-border rounded-lg text-sm focus:ring-2 focus:ring-secondary/20" placeholder="john@example.com" />
                      {errors.email && <p className="text-xs text-danger mt-1">{errors.email.message}</p>}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-textMuted mb-1">Address Line 1 *</label>
                    <input {...register('address')} className="w-full px-4 py-2.5 border border-border rounded-lg text-sm focus:ring-2 focus:ring-secondary/20" placeholder="123 Main Street" />
                    {errors.address && <p className="text-xs text-danger mt-1">{errors.address.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-textMuted mb-1">Address Line 2</label>
                    <input {...register('addressLine2')} className="w-full px-4 py-2.5 border border-border rounded-lg text-sm focus:ring-2 focus:ring-secondary/20" placeholder="Apt, Suite, etc." />
                  </div>
                  <div className="grid sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-textMuted mb-1">City *</label>
                      <input {...register('city')} className="w-full px-4 py-2.5 border border-border rounded-lg text-sm focus:ring-2 focus:ring-secondary/20" placeholder="New York" />
                      {errors.city && <p className="text-xs text-danger mt-1">{errors.city.message}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-textMuted mb-1">State *</label>
                      <select {...register('state')} className="w-full px-4 py-2.5 border border-border rounded-lg text-sm focus:ring-2 focus:ring-secondary/20 bg-white">
                        <option value="">Select state</option>
                        {US_STATES.map((st) => <option key={st} value={st}>{st}</option>)}
                      </select>
                      {errors.state && <p className="text-xs text-danger mt-1">{errors.state.message}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-textMuted mb-1">ZIP Code *</label>
                      <input {...register('postalCode')} className="w-full px-4 py-2.5 border border-border rounded-lg text-sm focus:ring-2 focus:ring-secondary/20" placeholder="10001" />
                      {errors.postalCode && <p className="text-xs text-danger mt-1">{errors.postalCode.message}</p>}
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-textMuted mb-1">Country *</label>
                      <input {...register('country')} className="w-full px-4 py-2.5 border border-border rounded-lg text-sm focus:ring-2 focus:ring-secondary/20" />
                      {errors.country && <p className="text-xs text-danger mt-1">{errors.country.message}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-textMuted mb-1">Phone *</label>
                      <input {...register('phone')} type="tel" className="w-full px-4 py-2.5 border border-border rounded-lg text-sm focus:ring-2 focus:ring-secondary/20" placeholder="+1 (555) 123-4567" />
                      {errors.phone && <p className="text-xs text-danger mt-1">{errors.phone.message}</p>}
                    </div>
                  </div>
                  <div className="pt-4 flex justify-end">
                    <Button type="submit" size="lg">Continue to Payment <FiChevronRight size={16} /></Button>
                  </div>
                </form>
              </div>
            )}

            {step === 2 && (
              <div className="card p-6">
                <h3 className="font-heading font-semibold mb-5 flex items-center gap-2"><FiCreditCard size={18} /> Payment Method</h3>
                <div className="space-y-3 mb-6">
                  {[
                    { value: 'PayPal', label: 'PayPal', desc: 'Pay with your PayPal account', badge: 'Most Popular' },
                    { value: 'Stripe', label: 'Credit/Debit Card', desc: 'Pay with Visa, Mastercard, etc.', badge: 'Coming Soon' },
                    { value: 'COD', label: 'Cash on Delivery', desc: 'Pay when you receive' },
                  ].map((opt) => (
                    <label key={opt.value} className={`flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition-colors ${paymentMethod === opt.value ? 'border-secondary bg-secondary/5' : 'border-border hover:border-gray-300'}`}>
                      <input type="radio" name="payment" value={opt.value} checked={paymentMethod === opt.value} onChange={(e) => setPaymentMethod(e.target.value)} className="mt-0.5 accent-secondary" disabled={opt.value === 'Stripe'} />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{opt.label}</span>
                          {opt.badge && <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${opt.badge === 'Most Popular' ? 'bg-success/10 text-success' : 'bg-accent/10 text-accent'}`}>{opt.badge}</span>}
                        </div>
                        <p className="text-xs text-textMuted mt-0.5">{opt.desc}</p>
                      </div>
                      {paymentMethod === opt.value && <FiCheck size={18} className="text-secondary shrink-0" />}
                    </label>
                  ))}
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <button onClick={() => setStep(1)} className="flex items-center gap-1 text-sm text-textMuted hover:text-primary transition-colors"><FiChevronLeft size={16} /> Back to Shipping</button>
                  <Button onClick={() => { if (paymentMethod === 'Stripe') { toast.error('Stripe coming soon! Please use PayPal.'); return; } setStep(3); window.scrollTo(0, 0); }} size="lg">
                    Continue to Review <FiChevronRight size={16} />
                  </Button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="card p-6">
                <h3 className="font-heading font-semibold mb-5 flex items-center gap-2"><FiFileText size={18} /> Order Review</h3>
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-medium">Shipping Address</h4>
                      <button onClick={() => setStep(1)} className="text-xs text-secondary hover:underline">Edit</button>
                    </div>
                    <p className="text-sm text-textMuted">{shippingData?.fullName}<br />{shippingData?.address}{shippingData?.addressLine2 ? `, ${shippingData.addressLine2}` : ''}<br />{shippingData?.city}, {shippingData?.state} {shippingData?.postalCode}<br />{shippingData?.phone}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-medium">Payment Method</h4>
                      <button onClick={() => setStep(2)} className="text-xs text-secondary hover:underline">Edit</button>
                    </div>
                    <p className="text-sm text-textMuted">{paymentMethod}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h4 className="text-sm font-medium mb-3">Order Items</h4>
                    <div className="space-y-2">
                      {items.map((item) => (
                        <div key={item._id} className="flex items-center gap-3 text-sm">
                          <img src={item.images?.[0] || ''} alt={item.name} className="w-10 h-10 object-cover rounded" />
                          <span className="flex-1 truncate">{item.name}</span>
                          <span className="text-textMuted">x{item.qty}</span>
                          <span className="font-medium">{formatPrice(item.price * item.qty)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-border mt-4">
                  <button onClick={() => setStep(2)} className="flex items-center gap-1 text-sm text-textMuted hover:text-primary transition-colors"><FiChevronLeft size={16} /> Back to Payment</button>
                  <Button size="lg" onClick={handlePlaceOrder} disabled={submitting}>
                    {submitting ? 'Processing...' : `Place Order — ${formatPrice(Math.round((total + shippingPrice + taxPrice) * 100) / 100)}`}
                  </Button>
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-24">
              <h3 className="font-heading font-semibold mb-4">Order Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-textMuted">Item{items.length !== 1 ? 's' : ''} ({items.length})</span><span>{formatPrice(total)}</span></div>
                <div className="flex justify-between"><span className="text-textMuted">Shipping</span><span>{shippingPrice === 0 ? 'FREE' : formatPrice(shippingPrice)}</span></div>
                {total < 50 && <p className="text-xs text-accent">Add {formatPrice(50 - total)} more for free shipping</p>}
                <div className="flex justify-between"><span className="text-textMuted">Tax (8.5%)</span><span>{formatPrice(taxPrice)}</span></div>
                <hr className="border-border" />
                <div className="flex justify-between font-semibold text-primary text-base"><span>Total</span><span>{formatPrice(Math.round((total + shippingPrice + taxPrice) * 100) / 100)}</span></div>
              </div>
              <div className="mt-4 space-y-2 max-h-48 overflow-y-auto">
                {items.map((item) => (
                  <div key={item._id} className="flex items-center gap-2 text-sm">
                    <img src={item.images?.[0] || ''} alt={item.name} className="w-10 h-10 object-cover rounded" />
                    <span className="flex-1 truncate">{item.name}</span>
                    <span className="font-medium">{item.qty}x</span>
                  </div>
                ))}
              </div>
              {step === 3 && paymentMethod === 'PayPal' && paypalClientId && createdOrder && (
                <div className="mt-5 pt-4 border-t border-border">
                  <p className="text-xs font-medium text-textMuted mb-3 flex items-center gap-1"><FiLock size={12} /> Pay with PayPal</p>
                  <PayPalScriptProvider options={{ 'client-id': paypalClientId, currency: 'USD' }}>
                    <PayPalButtons
                      createOrder={(data, actions) => actions.order.create({
                        purchase_units: [{ amount: { value: Math.round((total + shippingPrice + taxPrice) * 100) / 100 } }],
                      })}
                      onApprove={async (data, actions) => {
                        const details = await actions.order.capture();
                        await handlePaypalSuccess(details);
                      }}
                    />
                  </PayPalScriptProvider>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
