import { FiTruck, FiShield, FiRefreshCw, FiHeadphones } from 'react-icons/fi';

const promos = [
  { icon: FiTruck, title: 'Free Shipping', desc: 'On orders over $50' },
  { icon: FiShield, title: 'Secure Payment', desc: '100% secure checkout' },
  { icon: FiRefreshCw, title: '30-Day Returns', desc: 'No questions asked' },
  { icon: FiHeadphones, title: '24/7 Support', desc: 'Dedicated support team' },
];

export default function PromoSection() {
  return (
    <section className="bg-primary py-10 mt-12">
      <div className="container-custom">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {promos.map((promo, i) => (
            <div key={i} className="flex items-center gap-3 text-white">
              <promo.icon size={28} className="text-secondary shrink-0" />
              <div>
                <h4 className="font-medium text-sm">{promo.title}</h4>
                <p className="text-xs text-gray-400">{promo.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
