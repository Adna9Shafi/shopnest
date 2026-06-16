import { formatPrice } from '../../utils/formatPrice';

export default function CartSummary({ total, showDetails = false }) {
  const shipping = total >= 50 ? 0 : 9.99;
  const tax = total * 0.08;
  const grandTotal = total + shipping + tax;

  return (
    <div className="space-y-2 text-sm">
      <div className="flex justify-between text-textMuted"><span>Subtotal</span><span>{formatPrice(total)}</span></div>
      {showDetails && (
        <>
          <div className="flex justify-between text-textMuted"><span>Shipping</span><span>{shipping === 0 ? 'FREE' : formatPrice(shipping)}</span></div>
          <div className="flex justify-between text-textMuted"><span>Tax (8%)</span><span>{formatPrice(tax)}</span></div>
        </>
      )}
      <div className="flex justify-between font-semibold text-primary pt-2 border-t border-border">
        <span>{showDetails ? 'Total' : 'Estimated Total'}</span>
        <span>{formatPrice(showDetails ? grandTotal : total + (total >= 50 ? 0 : 9.99))}</span>
      </div>
      {total < 50 && <p className="text-xs text-accent">Add {formatPrice(50 - total)} more for free shipping</p>}
    </div>
  );
}
