import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight } from 'react-icons/fi';

export default function HeroBanner() {
  return (
    <section className="relative bg-primary overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/95 to-primary/80" />
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1400&q=80")', backgroundSize: 'cover', backgroundPosition: 'center' }} />
      <div className="container-custom relative py-20 md:py-32">
        <div className="max-w-xl">
          <motion.span initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="inline-block bg-secondary/20 text-secondary text-sm font-medium px-4 py-1.5 rounded-full mb-4">
            New Season Collection
          </motion.span>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-4xl md:text-6xl font-heading font-bold text-white mb-4 leading-tight">
            Premium Products, <br />Unbeatable Prices
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="text-gray-300 text-lg mb-8 max-w-lg">
            Discover curated collections from top brands. Free shipping on orders over $50.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="flex flex-wrap gap-3">
            <Link to="/shop" className="bg-accent text-white px-8 py-3.5 rounded-lg font-semibold hover:bg-accent/90 transition-colors flex items-center gap-2">
              Shop Now <FiArrowRight />
            </Link>
            <Link to="/shop?category=Electronics" className="bg-white/10 text-white px-8 py-3.5 rounded-lg font-medium hover:bg-white/20 transition-colors backdrop-blur-sm">
              Electronics
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
