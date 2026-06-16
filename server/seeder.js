const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Product = require('./models/Product');
const Order = require('./models/Order');
const Review = require('./models/Review');

dotenv.config();

mongoose.connect(process.env.MONGO_URI);

const img = (id) => `https://images.unsplash.com/photo-${id}?w=800&q=80`;

const ELECTRONICS_IMG = ['1498049794561', '1505740420928', '1526170375885'];
const CLOTHING_IMG = ['1523381210434', '1596755094514', '1542291026-cfec150d5d0'];
const HOME_IMG = ['1555041469-a586964267-f3e', '1484101403633'];
const SPORTS_IMG = ['1571019614', '1517836357463'];
const BEAUTY_IMG = ['1596462502278', '1522335789203'];

const products = [
  {
    name: 'Wireless Noise-Cancelling Headphones',
    description: 'Premium over-ear headphones with active noise cancellation, 30-hour battery life, and ultra-comfortable memory foam ear cushions.',
    richDescription: 'Experience crystal-clear audio with our flagship wireless headphones. Featuring adaptive noise cancellation, transparency mode, and support for high-resolution audio codecs.',
    images: [img(ELECTRONICS_IMG[0]), img(ELECTRONICS_IMG[1])],
    brand: 'SoundMax',
    price: 249.99,
    comparePrice: 349.99,
    category: 'Electronics',
    tags: ['headphones', 'wireless', 'audio', 'noise-cancelling'],
    countInStock: 45,
    rating: 4.7,
    numReviews: 128,
    isFeatured: true,
    isNew: false,
    discount: 29,
  },
  {
    name: 'Smart Watch Pro',
    description: 'Advanced smartwatch with health monitoring, GPS tracking, and 7-day battery life.',
    richDescription: 'Track your fitness goals, monitor your heart rate, and stay connected with notifications right on your wrist. Water-resistant to 50 meters.',
    images: [img(ELECTRONICS_IMG[1]), img(ELECTRONICS_IMG[2])],
    brand: 'TechWear',
    price: 399.99,
    comparePrice: 499.99,
    category: 'Electronics',
    tags: ['smartwatch', 'fitness', 'gps', 'health'],
    countInStock: 30,
    rating: 4.5,
    numReviews: 95,
    isFeatured: true,
    isNew: true,
    discount: 20,
  },
  {
    name: 'Portable Bluetooth Speaker',
    description: 'Waterproof portable speaker with 360° sound, 20-hour battery, and built-in microphone.',
    richDescription: 'Take your music anywhere with this rugged, waterproof speaker. Features deep bass, speakerphone functionality, and multi-device pairing.',
    images: [img(ELECTRONICS_IMG[0]), img(ELECTRONICS_IMG[2])],
    brand: 'SoundMax',
    price: 79.99,
    category: 'Electronics',
    tags: ['speaker', 'bluetooth', 'portable', 'waterproof'],
    countInStock: 100,
    rating: 4.3,
    numReviews: 210,
    isFeatured: false,
    isNew: false,
    discount: 0,
  },
  {
    name: '4K Action Camera',
    description: 'Compact action camera with 4K video, electronic stabilization, and waterproof case.',
    richDescription: 'Capture every adventure in stunning 4K resolution. Includes image stabilization, time-lapse, slow-motion, and a waterproof case rated to 40 meters.',
    images: [img(ELECTRONICS_IMG[2]), img(ELECTRONICS_IMG[0])],
    brand: 'AdventureCam',
    price: 299.99,
    comparePrice: 379.99,
    category: 'Electronics',
    tags: ['camera', '4k', 'action', 'waterproof'],
    countInStock: 25,
    rating: 4.6,
    numReviews: 67,
    isFeatured: true,
    isNew: true,
    discount: 21,
  },
  {
    name: 'Premium Cotton T-Shirt',
    description: 'Ultra-soft 100% organic cotton t-shirt with a modern fit and reinforced seams.',
    richDescription: 'Crafted from ethically sourced organic cotton. This wardrobe essential features a comfortable regular fit, ribbed collar, and durable double-stitched hems.',
    images: [img(CLOTHING_IMG[0]), img(CLOTHING_IMG[1])],
    brand: 'EcoWear',
    price: 29.99,
    comparePrice: 39.99,
    category: 'Clothing',
    tags: ['t-shirt', 'cotton', 'organic', 'casual'],
    countInStock: 200,
    rating: 4.4,
    numReviews: 340,
    isFeatured: false,
    isNew: false,
    discount: 25,
  },
  {
    name: 'Classic Denim Jacket',
    description: 'Timeless denim jacket made from premium selvedge denim with a tailored fit.',
    richDescription: 'A wardrobe staple crafted from heavyweight selvedge denim. Features brass buttons, chest pockets, and adjustable waist tabs for the perfect fit.',
    images: [img(CLOTHING_IMG[1]), img(CLOTHING_IMG[2])],
    brand: 'Heritage',
    price: 89.99,
    comparePrice: 119.99,
    category: 'Clothing',
    tags: ['jacket', 'denim', 'classic', 'outerwear'],
    countInStock: 50,
    rating: 4.6,
    numReviews: 88,
    isFeatured: true,
    isNew: false,
    discount: 25,
  },
  {
    name: 'Pro Running Sneakers',
    description: 'Lightweight performance running shoes with responsive cushioning and breathable mesh.',
    richDescription: 'Engineered for runners who demand the best. Features a carbon-infused midsole, engineered mesh upper, and anti-slip outsole for maximum performance.',
    images: [img(CLOTHING_IMG[2]), img(CLOTHING_IMG[0])],
    brand: 'Stride',
    price: 129.99,
    comparePrice: 159.99,
    category: 'Clothing',
    tags: ['sneakers', 'running', 'athletic', 'shoes'],
    countInStock: 75,
    rating: 4.8,
    numReviews: 156,
    isFeatured: true,
    isNew: true,
    discount: 19,
  },
  {
    name: 'Wool Blend Sweater',
    description: 'Luxuriously soft merino wool blend sweater with a classic crew neck design.',
    richDescription: 'Stay warm in style with this premium merino wool blend sweater. Features ribbed cuffs and hem, and a comfortable regular fit perfect for layering.',
    images: [img(CLOTHING_IMG[0]), img(CLOTHING_IMG[1])],
    brand: 'Heritage',
    price: 69.99,
    category: 'Clothing',
    tags: ['sweater', 'wool', 'winter', 'crew-neck'],
    countInStock: 60,
    rating: 4.3,
    numReviews: 72,
    isFeatured: false,
    isNew: true,
    discount: 0,
  },
  {
    name: 'Modern Table Lamp',
    description: 'Sleek LED table lamp with adjustable brightness, color temperature, and wireless charging base.',
    richDescription: 'Illuminate your space with this elegant table lamp. Features touch control, 3 color temperatures, stepless dimming, and a built-in Qi wireless charger.',
    images: [img(HOME_IMG[0]), img(HOME_IMG[1])],
    brand: 'LumiHome',
    price: 49.99,
    comparePrice: 69.99,
    category: 'Home & Garden',
    tags: ['lamp', 'led', 'wireless-charging', 'modern'],
    countInStock: 80,
    rating: 4.5,
    numReviews: 113,
    isFeatured: false,
    isNew: false,
    discount: 29,
  },
  {
    name: 'Indoor Plant Collection',
    description: 'Set of 3 low-maintenance indoor plants in stylish ceramic pots with bamboo trays.',
    richDescription: 'Transform your living space with our curated indoor plant collection. Includes a Snake Plant, Pothos, and ZZ Plant in minimalist ceramic planters.',
    images: [img(HOME_IMG[0]), img(HOME_IMG[1])],
    brand: 'GreenLeaf',
    price: 39.99,
    category: 'Home & Garden',
    tags: ['plants', 'indoor', 'decor', 'ceramic'],
    countInStock: 40,
    rating: 4.7,
    numReviews: 89,
    isFeatured: true,
    isNew: false,
    discount: 0,
  },
  {
    name: 'Decorative Throw Pillows',
    description: 'Set of 2 premium lumbar and square throw pillows with removable covers.',
    richDescription: 'Add a pop of color and comfort to any room. Each set includes one 12x20 lumbar and one 18x18 square pillow with hidden zipper covers.',
    images: [img(HOME_IMG[1]), img(HOME_IMG[0])],
    brand: 'ComfortHome',
    price: 24.99,
    category: 'Home & Garden',
    tags: ['pillows', 'decor', 'living-room', 'cushions'],
    countInStock: 120,
    rating: 4.2,
    numReviews: 45,
    isFeatured: false,
    isNew: false,
    discount: 0,
  },
  {
    name: 'Premium Garden Tool Set',
    description: '8-piece stainless steel garden tool set with ergonomic handles and storage bag.',
    richDescription: 'Everything you need for the perfect garden. Includes trowel, pruner, cultivator, weeder, gloves, and more, all in a durable canvas tote.',
    images: [img(HOME_IMG[0]), img(HOME_IMG[1])],
    brand: 'GardenPro',
    price: 59.99,
    comparePrice: 79.99,
    category: 'Home & Garden',
    tags: ['garden', 'tools', 'set', 'outdoor'],
    countInStock: 35,
    rating: 4.6,
    numReviews: 61,
    isFeatured: false,
    isNew: true,
    discount: 25,
  },
  {
    name: 'Premium Yoga Mat',
    description: 'Extra-thick non-slip yoga mat with alignment lines and carrying strap.',
    richDescription: 'Practice in comfort with our 6mm thick yoga mat. Features eco-friendly TPE material, dual-sided non-slip texture, and precision alignment markings.',
    images: [img(SPORTS_IMG[0]), img(SPORTS_IMG[1])],
    brand: 'ZenFit',
    price: 34.99,
    comparePrice: 49.99,
    category: 'Sports',
    tags: ['yoga', 'mat', 'fitness', 'exercise'],
    countInStock: 90,
    rating: 4.5,
    numReviews: 178,
    isFeatured: false,
    isNew: false,
    discount: 30,
  },
  {
    name: 'Resistance Bands Set',
    description: 'Set of 5 resistance bands with different levels, door anchor, and carry bag.',
    richDescription: 'Transform any space into a gym. Includes light to extra-heavy bands, comfortable handles, ankle straps, and a sturdy door anchor for versatile workouts.',
    images: [img(SPORTS_IMG[1]), img(SPORTS_IMG[0])],
    brand: 'FlexFit',
    price: 19.99,
    category: 'Sports',
    tags: ['bands', 'resistance', 'workout', 'home-gym'],
    countInStock: 150,
    rating: 4.4,
    numReviews: 230,
    isFeatured: false,
    isNew: false,
    discount: 0,
  },
  {
    name: 'Insulated Water Bottle',
    description: 'Double-wall vacuum insulated stainless steel bottle. Keeps drinks cold 24h or hot 12h.',
    richDescription: 'Stay hydrated with our premium insulated bottle. Features a leak-proof lid, wide mouth for ice, powder-coated finish, and a carabiner for easy carrying.',
    images: [img(SPORTS_IMG[0]), img(SPORTS_IMG[1])],
    brand: 'HydroElite',
    price: 24.99,
    category: 'Sports',
    tags: ['bottle', 'insulated', 'stainless', 'hydration'],
    countInStock: 200,
    rating: 4.8,
    numReviews: 420,
    isFeatured: true,
    isNew: false,
    discount: 0,
  },
  {
    name: 'Fitness Tracker Band',
    description: 'Slim fitness tracker with heart rate monitor, sleep tracking, and smartphone notifications.',
    richDescription: 'Monitor your activity 24/7 with this sleek fitness band. Tracks steps, calories, heart rate, sleep quality, and pairs with your smartphone for calls and messages.',
    images: [img(SPORTS_IMG[1]), img(SPORTS_IMG[0])],
    brand: 'TechWear',
    price: 49.99,
    comparePrice: 69.99,
    category: 'Sports',
    tags: ['fitness', 'tracker', 'heart-rate', 'sleep'],
    countInStock: 65,
    rating: 4.1,
    numReviews: 55,
    isFeatured: false,
    isNew: true,
    discount: 29,
  },
  {
    name: 'Organic Face Serum',
    description: 'Vitamin C brightening serum with hyaluronic acid and organic botanical extracts.',
    richDescription: 'Rejuvenate your skin with our award-winning formula. Packed with antioxidants, vitamin C, and hyaluronic acid to brighten, hydrate, and reduce fine lines.',
    images: [img(BEAUTY_IMG[0]), img(BEAUTY_IMG[1])],
    brand: 'PureGlow',
    price: 44.99,
    comparePrice: 59.99,
    category: 'Beauty',
    tags: ['serum', 'vitamin-c', 'organic', 'skincare'],
    countInStock: 55,
    rating: 4.7,
    numReviews: 198,
    isFeatured: true,
    isNew: false,
    discount: 25,
  },
  {
    name: 'Luxury Day Moisturizer',
    description: 'Rich hydrating moisturizer with SPF 30, peptides, and ceramides for all-day nourishment.',
    richDescription: 'Wake up to glowing skin. This lightweight yet deeply hydrating formula provides broad-spectrum SPF 30 protection, peptides for firmness, and ceramides for barrier repair.',
    images: [img(BEAUTY_IMG[1]), img(BEAUTY_IMG[0])],
    brand: 'PureGlow',
    price: 54.99,
    category: 'Beauty',
    tags: ['moisturizer', 'spf', 'anti-aging', 'hydrating'],
    countInStock: 40,
    rating: 4.5,
    numReviews: 143,
    isFeatured: false,
    isNew: true,
    discount: 0,
  },
  {
    name: 'Natural Lipstick Collection',
    description: 'Set of 6 long-lasting natural lipsticks in everyday shades with moisturizing formula.',
    richDescription: 'Find your perfect shade with this versatile collection. Made from natural ingredients with added shea butter and vitamin E for smooth, hydrated lips.',
    images: [img(BEAUTY_IMG[0]), img(BEAUTY_IMG[1])],
    brand: 'ColorBloom',
    price: 29.99,
    comparePrice: 44.99,
    category: 'Beauty',
    tags: ['lipstick', 'natural', 'makeup', 'set'],
    countInStock: 85,
    rating: 4.3,
    numReviews: 77,
    isFeatured: false,
    isNew: false,
    discount: 33,
  },
  {
    name: 'Hair Repair Intensive Kit',
    description: 'Complete hair repair system with shampoo, conditioner, and weekly treatment mask.',
    richDescription: 'Restore damaged hair with our professional-grade repair system. Enriched with keratin, argan oil, and biotin to strengthen, smooth, and add shine.',
    images: [img(BEAUTY_IMG[1]), img(BEAUTY_IMG[0])],
    brand: 'SilkStrand',
    price: 39.99,
    comparePrice: 54.99,
    category: 'Beauty',
    tags: ['hair', 'repair', 'keratin', 'treatment'],
    countInStock: 70,
    rating: 4.4,
    numReviews: 112,
    isFeatured: false,
    isNew: true,
    discount: 27,
  },
];

const users = [
  {
    name: 'Admin User',
    email: 'admin@store.com',
    password: 'admin123',
    isAdmin: true,
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80',
  },
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'user123',
    isAdmin: false,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80',
  },
  {
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: 'user123',
    isAdmin: false,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80',
  },
  {
    name: 'Bob Johnson',
    email: 'bob@example.com',
    password: 'user123',
    isAdmin: false,
    avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=200&q=80',
  },
];

const seeder = async () => {
  try {
    const destroy = process.argv.includes('--destroy');

    if (destroy) {
      await Order.deleteMany();
      await Review.deleteMany();
      await Product.deleteMany();
      await User.deleteMany();
      console.log('Data destroyed successfully!');
      process.exit(0);
    }

    await Order.deleteMany();
    await Review.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    const createdUsers = await User.insertMany(users);
    const adminUser = createdUsers[0]._id;

    const sampleProducts = products.map((p) => ({ ...p }));
    const createdProducts = await Product.insertMany(sampleProducts);

    console.log(`Seeded ${createdUsers.length} users`);
    console.log(`Seeded ${createdProducts.length} products`);
    console.log('Admin login: admin@store.com / admin123');
    console.log('Data imported successfully!');
    process.exit(0);
  } catch (error) {
    console.error(`Seeder error: ${error.message}`);
    process.exit(1);
  }
};

seeder();
