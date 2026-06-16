import { useState, useEffect } from 'react';
import ProductCarousel from '../product/ProductCarousel';
import { productService } from '../../services/productService';

export default function NewArrivals() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    productService.getAll({ sort: 'newest', limit: 8 }).then((res) => { setProducts(res.data.products); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading || products.length === 0) return null;

  return <section className="container-custom py-12"><ProductCarousel title="New Arrivals" products={products} /></section>;
}
