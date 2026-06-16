import { Helmet } from 'react-helmet-async';
import HeroBanner from '../components/home/HeroBanner';
import CategoryGrid from '../components/home/CategoryGrid';
import FeaturedProducts from '../components/home/FeaturedProducts';
import NewArrivals from '../components/home/NewArrivals';
import PromoSection from '../components/home/PromoSection';
import Testimonials from '../components/home/Testimonials';

export default function HomePage() {
  return (
    <>
      <Helmet><title>ShopNest — Premium E-Commerce Store</title></Helmet>
      <HeroBanner />
      <CategoryGrid />
      <FeaturedProducts />
      <NewArrivals />
      <PromoSection />
      <Testimonials />
    </>
  );
}
