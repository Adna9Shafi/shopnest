import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const categories = [
  { name: 'Electronics', icon: '🔌', color: 'bg-blue-50', count: '42 products' },
  { name: 'Clothing', icon: '👕', color: 'bg-green-50', count: '56 products' },
  { name: 'Home & Garden', icon: '🏡', color: 'bg-yellow-50', count: '28 products' },
  { name: 'Sports', icon: '⚽', color: 'bg-orange-50', count: '35 products' },
  { name: 'Beauty', icon: '💄', color: 'bg-pink-50', count: '20 products' },
];

export default function CategoryGrid() {
  return (
    <section className="container-custom py-12">
      <h2 className="section-title mb-6">Shop by Category</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {categories.map((cat, i) => (
          <motion.div key={cat.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
            <Link to={`/shop?category=${encodeURIComponent(cat.name)}`} className={`${cat.color} rounded-xl p-6 text-center block hover:shadow-md transition-all duration-200 hover:scale-[1.02]`}>
              <span className="text-4xl block mb-2">{cat.icon}</span>
              <h3 className="font-medium text-sm text-primary">{cat.name}</h3>
              <p className="text-xs text-textMuted mt-0.5">{cat.count}</p>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
