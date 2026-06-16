import { useState, useEffect } from 'react';
import ProductCarousel from '../product/ProductCarousel';
import { productService } from '../../services/productService';

export default function FeaturedProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    productService.getFeatured().then((res) => { setProducts(res.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading || products.length === 0) return null;

  return <section className="container-custom py-12"><ProductCarousel title="Featured Products" products={products} /></section>;
}
