import { motion } from 'framer-motion';

const testimonials = [
  { name: 'Sarah M.', role: 'Verified Buyer', text: 'Amazing quality! The products exceeded my expectations. Fast shipping too!', avatar: 'SM', rating: 5 },
  { name: 'James K.', role: 'Verified Buyer', text: 'Great customer service and premium products. Will definitely shop again.', avatar: 'JK', rating: 5 },
  { name: 'Emily R.', role: 'Verified Buyer', text: 'The best online shopping experience I\'ve had. Highly recommended!', avatar: 'ER', rating: 5 },
];

export default function Testimonials() {
  return (
    <section className="container-custom py-12">
      <h2 className="section-title text-center mb-8">What Our Customers Say</h2>
      <div className="grid md:grid-cols-3 gap-6">
        {testimonials.map((t, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="card p-6 text-center">
            <div className="w-12 h-12 bg-secondary/10 text-secondary rounded-full flex items-center justify-center mx-auto mb-3 font-semibold text-sm">{t.avatar}</div>
            <p className="text-sm text-textMuted mb-3 leading-relaxed">"{t.text}"</p>
            <p className="text-sm font-medium">{t.name}</p>
            <p className="text-xs text-textMuted">{t.role}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
