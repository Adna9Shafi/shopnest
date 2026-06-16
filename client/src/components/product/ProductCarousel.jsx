import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import ProductCard from './ProductCard';

export default function ProductCarousel({ title, products }) {
  if (!products || products.length === 0) return null;

  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <h2 className="section-title">{title}</h2>
      </div>
      <Swiper modules={[Navigation, Autoplay]} spaceBetween={20} slidesPerView={1} navigation autoplay={{ delay: 5000, disableOnInteraction: false }} breakpoints={{ 640: { slidesPerView: 2 }, 768: { slidesPerView: 3 }, 1024: { slidesPerView: 4 } }}>
        {products.map((product) => (
          <SwiperSlide key={product._id}>
            <ProductCard product={product} />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
