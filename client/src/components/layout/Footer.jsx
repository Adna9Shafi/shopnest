import { Link } from 'react-router-dom';
import { FiMail, FiPhone, FiMapPin } from 'react-icons/fi';

export default function Footer() {
  return (
    <footer className="bg-primary text-white mt-16">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🛍️</span>
              <span className="font-heading font-bold text-xl">ShopNest</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">Your premium destination for quality products. Shop with confidence.</p>
          </div>
          <div>
            <h4 className="font-heading font-semibold mb-4">Quick Links</h4>
            <div className="space-y-2 text-sm text-gray-400">
              <Link to="/shop" className="block hover:text-white transition-colors">All Products</Link>
              <Link to="/shop?category=Electronics" className="block hover:text-white transition-colors">Electronics</Link>
              <Link to="/shop?category=Clothing" className="block hover:text-white transition-colors">Clothing</Link>
              <Link to="/shop?category=Home+%26+Garden" className="block hover:text-white transition-colors">Home & Garden</Link>
            </div>
          </div>
          <div>
            <h4 className="font-heading font-semibold mb-4">Customer Service</h4>
            <div className="space-y-2 text-sm text-gray-400">
              <Link to="/" className="block hover:text-white transition-colors">Help Center</Link>
              <Link to="/" className="block hover:text-white transition-colors">Shipping Info</Link>
              <Link to="/" className="block hover:text-white transition-colors">Returns</Link>
              <Link to="/" className="block hover:text-white transition-colors">FAQ</Link>
            </div>
          </div>
          <div>
            <h4 className="font-heading font-semibold mb-4">Contact</h4>
            <div className="space-y-3 text-sm text-gray-400">
              <div className="flex items-center gap-2"><FiMail size={14} /> support@shopnest.com</div>
              <div className="flex items-center gap-2"><FiPhone size={14} /> +1 (555) 123-4567</div>
              <div className="flex items-center gap-2"><FiMapPin size={14} /> 123 Commerce St, NY 10001</div>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} ShopNest. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
