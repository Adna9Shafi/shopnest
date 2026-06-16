import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useWishlist } from '../hooks/useWishlist';
import ProductGrid from '../components/product/ProductGrid';
import EmptyState from '../components/ui/EmptyState';
import { FiHeart } from 'react-icons/fi';

export default function WishlistPage() {
  const { items } = useWishlist();

  return (
    <>
      <Helmet><title>My Wishlist — ShopNest</title></Helmet>
      <div className="container-custom py-8">
        <h1 className="text-2xl font-heading font-bold mb-6">My Wishlist</h1>
        {items.length === 0 ? (
          <EmptyState icon={FiHeart} title="Your wishlist is empty" description="Save items you love to your wishlist" actionLabel="Browse Products" onAction={() => window.location.href = '/shop'} />
        ) : (
          <ProductGrid products={items} />
        )}
      </div>
    </>
  );
}
