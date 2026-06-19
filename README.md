# 🛍️ ShopNest — Full-Stack E-Commerce Platform

![ShopNest Banner](https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&q=80)

> A production-ready, full-stack E-Commerce web application built with the MERN stack. Features a complete shopping flow, PayPal sandbox payment integration, an admin dashboard with real-time analytics, JWT authentication, and a pixel-perfect responsive UI powered by Tailwind CSS.

---

## 📋 Table of Contents

- [✨ Features](#-features)
  - [🛒 Customer Features](#-customer-features)
  - [🔐 Authentication](#-authentication)
  - [⚙️ Admin Panel](#️-admin-panel)
  - [🚀 Technical Features](#-technical-features)
- [🖥️ Tech Stack](#️-tech-stack)
- [📸 Screenshots](#-screenshots)
- [🚀 Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
- [📁 Project Structure](#-project-structure)
- [🔌 API Documentation](#-api-documentation)
  - [Authentication API](#authentication-api)
  - [Products API](#products-api)
  - [Orders API](#orders-api)
  - [Users API (Admin)](#users-api-admin)
- [💳 Payment Integration](#-payment-integration)
  - [PayPal Setup](#paypal-setup)
- [🌐 Deployment](#-deployment)
  - [Backend — Render.com](#backend--rendercom)
  - [Frontend — Vercel](#frontend--vercel)
- [🧪 Demo Credentials](#-demo-credentials)
- [🗺️ Roadmap](#️-roadmap)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)
- [👨‍💻 Author](#-author)
- [🌟 Acknowledgments](#-acknowledgments)

---

## ✨ Features

### 🛒 Customer Features

- **Advanced Product Search** — Real-time debounced search with dropdown suggestions as you type, powered by MongoDB `$regex` queries
- **Multi-Criteria Filtering** — Filter products by category, price range (dual-handle slider), minimum rating, availability, sale status, and new arrivals
- **Flexible Sorting** — Sort by newest, price (low-to-high / high-to-low), most popular, or highest rated
- **Product Quick View** — Hover overlay on product cards to preview details without navigating away
- **Interactive Image Gallery** — Click-through thumbnails with CSS hover zoom (2x scale) on the product detail page
- **Customer Reviews & Ratings** — Star-rating picker, review submission for logged-in users, aggregate rating display with half-star support
- **Persistent Shopping Cart** — Cart state survives page refreshes via Redux + `localStorage` subscribe pattern (no Redux Persist dependency)
- **Live Cart Drawer** — Slide-in cart panel from the right with quantity controls, live subtotal, free-shipping progress indicator, and checkout CTA
- **Wishlist Management** — Heart-toggle on any product card or detail page, persisted across sessions
- **Promo Code Engine** — Built-in promo code system (`SAVE10` = 10% off, `NEWUSER` = 15% off, `FREESHIP` = free shipping) with success/error feedback
- **Full Checkout Flow** — Multi-step checkout: Shipping Address → Payment Method → Order Review with progress tracker
- **PayPal Sandbox Payments** — Fully integrated `@paypal/react-paypal-js` with `createOrder`/`onApprove` lifecycle
- **Order Management** — Order history page with status tracking, individual order detail pages with full breakdown
- **Product Recommendations** — "Related Products" carousel showing same-category items on every product detail page
- **Responsive Design** — Mobile-first, fully responsive across all breakpoints with hamburger menu, mobile filter drawer, and grid/list view toggles

### 🔐 Authentication

- **JWT-Based Auth** — JSON Web Tokens issued on login/register, verified on every protected request via middleware
- **Secure Password Hashing** — bcryptjs with salt rounds for all passwords, never stored in plaintext
- **Protected Routes** — React Router v6 route guards (`PrivateRoute` + `AdminRoute`) redirect unauthenticated users
- **Auto 401 Logout** — Axios response interceptor catches 401 errors, clears localStorage, and redirects to `/login`
- **Profile Management** — Authenticated users can view and update their name, email, avatar, and password
- **Role-Based Access Control** — `isAdmin` flag gates all admin routes on both client and server with middleware enforcement

### ⚙️ Admin Panel

- **Dashboard Analytics** — 4 stat cards (Total Revenue, Orders, Users, Products) with trend indicators, all fetched live on page load
- **Revenue Line Chart** — 7-day revenue trend visualized with Recharts `LineChart`
- **Orders by Status Bar Chart** — Visual breakdown of orders (pending, processing, shipped, delivered, cancelled)
- **Category Distribution Pie Chart** — Product count per category displayed as a `PieChart` with color-coded segments
- **Top Products Table** — Sorted by engagement (rating × review count), with inline product images
- **Recent Orders Table** — Latest 10 orders with status badges and quick links
- **Product CRUD** — Full table with paginated results, inline search, category and featured/new filters, sortable columns, add/edit modal with image URL management and toggle switches
- **Order Management** — Expandable rows with inline shipping address, payment info, order items, price breakdown; status update buttons and mark-as-paid toggle
- **User Management** — User table with search, promote/demote admin toggle, delete with guards (cannot delete self or other admins)

### 🚀 Technical Features

- **RESTful API** — Clean, resource-oriented API design following REST conventions with consistent JSON responses
- **Redux Toolkit State Management** — Centralized store with slices for auth, cart, and wishlist; selectors for derived state (total, count)
- **Axios HTTP Client** — Singleton instance with base URL, JSON content-type, Bearer token interceptor, and centralized error handling
- **React Hook Form + Yup** — Performant form handling with schema-based validation (login, register, shipping)
- **React Helmet Async** — Per-page SEO meta tags for title, description, and Open Graph social previews
- **Framer Motion Animations** — Smooth page transitions, card entrance animations, modal open/close, success page spring animation
- **Swiper.js Carousels** — Touch-enabled product carousels with autoplay, navigation arrows, and responsive breakpoints
- **Recharts Visualizations** — Lightweight, composable chart library for admin dashboard analytics
- **MongoDB Aggregation** — Product rating recalculation via aggregation pipeline after every review submission
- **Mongoose ODM** — Schema modeling with pre-save hooks (slug generation, password hashing), instance methods (`matchPassword`), and text indexes
- **Input Validation** — Server-side validation in controllers + client-side Yup schemas with error messages
- **Error Handling Middleware** — Express `notFound` and `errorHandler` middleware for consistent error responses
- **Toast Notifications** — Non-blocking success/error feedback via `react-hot-toast` for all user actions
- **React Icons** — Feather icon set (`Fi*`) for consistent, clean SVG icons throughout the UI

---

## 🖥️ Tech Stack

| Category | Technology | Version | Purpose |
|---|---|---|---|
| **Frontend** | React.js | 18.x | UI component library |
| | Vite | 5.x | Build tool and dev server |
| | React Router DOM | 6.x | Client-side routing |
| | Redux Toolkit | 2.x | State management |
| | React Redux | 9.x | React bindings for Redux |
| | Tailwind CSS | 3.x | Utility-first CSS framework |
| | Axios | 1.x | HTTP client |
| | React Hook Form | 7.x | Form state management |
| | Yup | 1.x | Schema validation |
| | Framer Motion | 12.x | Declarative animations |
| | Swiper.js | 12.x | Touch carousels |
| | Recharts | 3.x | Data visualization (charts) |
| | react-helmet-async | 3.x | SEO meta tag management |
| | React Hot Toast | 2.x | Toast notifications |
| | React Icons | 5.x | SVG icon library |
| | @paypal/react-paypal-js | 10.x | PayPal payment buttons |
| | canvas-confetti | 1.x | Confetti celebration effect |
| **Backend** | Node.js | 18.x / 20.x | JavaScript runtime |
| | Express.js | 4.x | HTTP server and routing |
| | Mongoose | 8.x | MongoDB ODM |
| | bcryptjs | 2.x | Password hashing |
| | jsonwebtoken | 9.x | JWT signing and verification |
| | dotenv | 16.x | Environment variable loading |
| | cors | 2.x | Cross-origin resource sharing |
| | multer | 1.x | File upload handling |
| **Database** | MongoDB | 7.x (Atlas) | NoSQL document database |
| | MongoDB Atlas | Free Tier | Managed cloud database |
| **Dev Tools** | nodemon | 3.x | Auto-restart on file changes |
| | Postman | — | API testing |
| | MongoDB Compass | — | GUI database browser |
| **Deployment** | Vercel | — | Frontend hosting |
| | Render.com | — | Backend hosting |

---

## 📸 Screenshots

### Homepage
![Homepage](./screenshots/homepage.png)
*Full homepage with hero banner gradient overlay, category grid with emoji icons, featured/recommended product carousels, promo feature cards (free shipping, secure payment, returns, support), and customer testimonial section.*

### Shop Page
![Shop Page](./screenshots/shop.png)
*Product listing page with collapsible filter sidebar (categories, price range, rating), sort dropdown, grid/list view toggle, and paginated results with skeleton loading states.*

### Product Detail
![Product Detail](./screenshots/product-detail.png)
*Two-column product detail layout with image gallery (thumbnails + CSS hover zoom), badges, star rating, price with savings badge, stock indicator, quantity selector, action buttons, share links, and clickable tags.*

### Reviews & Tabs
![Product Tabs](./screenshots/product-tabs.png)
*Tabbed product information panel showing description, specifications table, and customer reviews with star-rating write form for authenticated users.*

### Shopping Cart
![Shopping Cart](./screenshots/cart.png)
*Full cart page with item rows (image, name, quantity controls, line total, wishlist/remove buttons), order summary card with breakdown, promo code engine with feedback, and security badges.*

### Multi-Step Checkout
![Checkout](./screenshots/checkout.png)
*Three-step checkout flow with progress indicator: shipping address form (full name, email, address, city/state/ZIP, phone), payment method selection, and order review with place order button.*

### PayPal Payment
![PayPal Payment](./screenshots/paypal.png)
*PayPal button rendered within the checkout review step, creating an order via the PayPal API and capturing payment on approval.*

### Admin Dashboard
![Admin Dashboard](./screenshots/admin-dashboard.png)
*Admin panel with fixed sidebar navigation, 4 stat cards with trend arrows, revenue line chart (7 days), orders-by-status bar chart, category pie chart, top products table, and recent orders table.*

### Admin Products
![Admin Products](./screenshots/admin-products.png)
*Admin product management with paginated table, search bar, category/filter toggles, add/edit modal with all fields including image URLs and boolean toggles, and delete confirmation dialog.*

### Admin Orders
![Admin Orders](./screenshots/admin-orders.png)
*Admin order management with expandable rows showing full shipping/payment/item details, status update buttons, and mark-as-paid toggle.*

### Mobile View
![Mobile](./screenshots/mobile.png)
*Mobile-responsive layouts showing hamburger navigation, collapsible filter drawer, single-column product grid, and touch-optimized cart/checkout flow.*

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** v18.0.0 or later (recommended: v20.x LTS)
- **npm** v9.0.0 or later
- **MongoDB Atlas** account (free tier is sufficient)
- **PayPal Developer** account for sandbox testing
- **Git** for version control

### Installation

#### 1. Clone the Repository

```bash
git clone https://github.com/Adna9Shafi/shopnest.git
cd shopnest
```

#### 2. Install Server Dependencies

```bash
cd server
npm install
```

#### 3. Install Client Dependencies

```bash
cd ../client
npm install
```

#### 4. Configure Environment Variables

Create a `.env` file in the root `professional/` directory (see the [Environment Variables](#environment-variables) section below for the full template):

```bash
cp .env.example .env
```

Edit `.env` with your MongoDB connection string, a JWT secret, and your PayPal sandbox Client ID.

#### 5. Seed the Database

```bash
cd ../server
node seeder.js
```

This creates:
- **4 users** (1 admin + 3 test users) with pre-hashed passwords
- **20 products** across 5 categories (Electronics, Clothing, Home & Garden, Sports, Beauty) with real Unsplash image URLs
- Sample reviews and ratings

#### 6. Start Development Servers

**Terminal 1 — Backend:**

```bash
cd server
npm run dev
```

The API starts on `http://localhost:5000`.

**Terminal 2 — Frontend:**

```bash
cd client
npm run dev
```

The Vite dev server starts on `http://localhost:3000` with hot module replacement and API proxy to port 5000.

> **Note:** The Vite `proxy` configuration in `vite.config.js` forwards all `/api` requests to the Express backend, so both servers must be running simultaneously during development.

### Environment Variables

Create a `.env` file in the project root with the following variables:

| Variable | Description | Example |
|---|---|---|
| `NODE_ENV` | Application environment | `development` |
| `PORT` | Backend server port | `5000` |
| `MONGO_URI` | MongoDB Atlas connection string | `mongodb+srv://user:pass@cluster.mongodb.net/shopnest?retryWrites=true&w=majority` |
| `JWT_SECRET` | Secret key for signing JSON Web Tokens | `your_jwt_secret_key_change_in_production` |
| `JWT_EXPIRES_IN` | JWT expiration duration | `30d` |
| `PAYPAL_CLIENT_ID` | PayPal REST API Client ID (sandbox) | `Ae7C9...` |
| `CLIENT_URL` | Frontend URL for CORS (production) | `https://shopnest-demo.vercel.app` |

---

## 📁 Project Structure

```
professional/
├── .env                          # Environment variables (git-ignored)
├── .env.example                  # Environment variable template
├── .gitignore                    # Git ignore rules
├── package.json                  # Root package.json (server deps + scripts)
├── README.md                     # Project documentation (this file)
│
├── server/                       # Express.js backend
│   ├── package.json              # Server dependencies
│   ├── server.js                 # Entry point: Express app, middleware, routes
│   ├── seeder.js                 # Database seeder script (users + 20 products)
│   │
│   ├── config/
│   │   └── db.js                 # Mongoose connection with Atlas
│   │
│   ├── models/
│   │   ├── User.js               # User schema: bcrypt hashing, matchPassword
│   │   ├── Product.js            # Product schema: slug auto-gen, text index
│   │   ├── Order.js              # Order schema: items, shipping, payment, status
│   │   └── Review.js             # Review schema: user+product refs, rating
│   │
│   ├── controllers/
│   │   ├── authController.js     # Register, login, get/update profile
│   │   ├── productController.js  # CRUD, filters, sort, pagination, search
│   │   ├── orderController.js    # CRUD, PayPal pay, status updates
│   │   ├── reviewController.js   # Create review, get reviews by product
│   │   └── userController.js     # Admin: list, delete, promote users
│   │
│   ├── routes/
│   │   ├── authRoutes.js         # POST /api/auth/login, /register, etc.
│   │   ├── productRoutes.js      # GET/POST/PUT/DELETE /api/products
│   │   ├── orderRoutes.js        # GET/POST/PUT /api/orders
│   │   ├── userRoutes.js         # GET/DELETE/PUT /api/users (admin)
│   │   └── uploadRoutes.js       # POST /api/upload (multer)
│   │
│   ├── middleware/
│   │   ├── authMiddleware.js     # JWT protect + isAdmin verification
│   │   └── errorMiddleware.js    # 404 notFound + global errorHandler
│   │
│   └── utils/
│       └── generateToken.js      # JWT sign helper
│
└── client/                       # React.js frontend
    ├── package.json              # Client dependencies
    ├── index.html                # HTML entry point
    ├── vite.config.js            # Vite config (proxy, port)
    ├── tailwind.config.js        # Tailwind custom design system
    ├── postcss.config.js         # PostCSS config (autoprefixer)
    │
    └── src/
        ├── main.jsx              # React DOM root: Provider + Router + Toaster
        ├── App.jsx               # Route definitions (public + admin)
        ├── index.css             # Tailwind directives + Google Fonts + utilities
        │
        ├── store/
        │   ├── index.js          # Redux configureStore + localStorage persist
        │   └── slices/
        │       ├── authSlice.js  # createAsyncThunk: login, register, profile
        │       ├── cartSlice.js  # add/remove/updateQty/clear + selectors
        │       └── wishlistSlice.js # toggle/clear wishlist items
        │
        ├── services/
        │   ├── api.js            # Axios instance: baseURL, Bearer interceptor, 401 handler
        │   ├── authService.js    # Auth API calls
        │   ├── productService.js # Product API calls (+ review methods)
        │   └── orderService.js   # Order API calls (+ PayPal config)
        │
        ├── hooks/
        │   ├── useAuth.js        # Login/register/logout/profile with toast
        │   ├── useCart.js        # Cart state, actions, selectors + drawer
        │   └── useWishlist.js    # Toggle + isInWishlist check
        │
        ├── utils/
        │   ├── formatPrice.js    # Currency formatting ($1,299.00)
        │   ├── formatDate.js     # Locale date formatting
        │   └── validators.js     # Yup schemas: login, register, shipping
        │
        ├── components/
        │   ├── auth/
        │   │   ├── PrivateRoute.jsx   # Redirect to /login if unauthenticated
        │   │   └── AdminRoute.jsx     # Redirect to / if not admin
        │   │
        │   ├── ui/
        │   │   ├── Button.jsx         # 5 variants: primary, accent, outline, ghost, danger
        │   │   ├── Badge.jsx          # new/sale/hot badge variants
        │   │   ├── Spinner.jsx        # 3 sizes with Tailwind spin animation
        │   │   ├── Rating.jsx         # Star display with half-star support
        │   │   ├── Modal.jsx          # Animated modal with framer-motion
        │   │   ├── Pagination.jsx     # Page numbers with ellipsis
        │   │   └── EmptyState.jsx     # Icon + message + CTA
        │   │
        │   ├── layout/
        │   │   ├── Navbar.jsx         # Sticky nav: logo, search, badges, user menu, megamenu
        │   │   ├── Sidebar.jsx        # Mobile slide-in navigation
        │   │   ├── Footer.jsx         # 4-column footer with links, contact, social
        │   │   └── Layout.jsx         # Navbar + main + Footer + CartDrawer
        │   │
        │   ├── home/
        │   │   ├── HeroBanner.jsx     # Dark gradient overlay, animated text, CTAs
        │   │   ├── CategoryGrid.jsx   # 5 categories with emoji icons + hover effects
        │   │   ├── FeaturedProducts.jsx # Carousel of featured products
        │   │   ├── NewArrivals.jsx    # Carousel of newest products
        │   │   ├── PromoSection.jsx   # 4 feature cards (shipping, payment, returns, support)
        │   │   └── Testimonials.jsx   # Customer review cards with avatars
        │   │
        │   ├── product/
        │   │   ├── ProductCard.jsx    # Image with overlay, badges, rating, price, cart btn
        │   │   ├── ProductGrid.jsx    # Responsive grid with skeleton loading
        │   │   ├── ProductCarousel.jsx # Swiper carousel for featured/related products
        │   │   ├── ProductFilters.jsx # Category list, price inputs, rating buttons
        │   │   ├── ProductSort.jsx    # Sort dropdown (newest, price, popular)
        │   │   ├── QuickView.jsx      # Modal with quick product preview
        │   │   └── ReviewCard.jsx     # Avatar, name, date, rating, comment
        │   │
        │   └── cart/
        │       ├── CartDrawer.jsx     # Slide-in drawer with framer-motion
        │       ├── CartItem.jsx       # Image, name, qty controls, remove
        │       └── CartSummary.jsx    # Subtotal/shipping/tax/total breakdown
        │
        └── pages/
            ├── HomePage.jsx           # Assembles all home components
            ├── ShopPage.jsx           # Filters sidebar + grid/list + pagination
            ├── ProductDetailPage.jsx  # Gallery, info, tabs, reviews, related
            ├── CartPage.jsx           # Item rows, summary, promo codes, badges
            ├── CheckoutPage.jsx       # Multi-step: shipping → payment → review
            ├── OrderSuccessPage.jsx   # Confetti, order ID, delivery estimate
            ├── LoginPage.jsx          # Login form with social buttons
            ├── RegisterPage.jsx       # Registration form
            ├── ProfilePage.jsx        # Tabs: info, orders, wishlist, settings
            ├── OrdersPage.jsx         # Order history list
            ├── OrderDetailPage.jsx    # Single order detail
            ├── WishlistPage.jsx       # Wishlist grid
            ├── NotFoundPage.jsx       # 404 page
            │
            └── admin/
                ├── AdminLayout.jsx    # Fixed sidebar + top header
                ├── AdminDashboard.jsx # Stats, 4 charts, recent orders table
                ├── AdminProducts.jsx  # CRUD table + add/edit modal
                ├── AdminOrders.jsx    # Expandable rows + status updates
                ├── AdminUsers.jsx     # Table + promote/delete with guards
                └── AdminSettings.jsx  # General, appearance, notifications
```

---

## 🔌 API Documentation

All API endpoints are prefixed with `/api`. The server runs on `http://localhost:5000` in development.

### Authentication API

| Method | Endpoint | Access | Description | Request Body |
|---|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Create a new user account | `{ name, email, password }` |
| `POST` | `/api/auth/login` | Public | Authenticate and receive JWT | `{ email, password }` |
| `GET` | `/api/auth/profile` | Private | Get authenticated user's profile | — |
| `PUT` | `/api/auth/profile` | Private | Update profile (name, email, password, avatar) | `{ name?, email?, password?, avatar? }` |

**Response format (login/register):**

```json
{
  "_id": "664a1b2c3d4e5f6a7b8c9d0e",
  "name": "John Doe",
  "email": "john@example.com",
  "isAdmin": false,
  "avatar": null,
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

### Products API

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/products` | Public | Get all products with filters, sort, pagination |
| `GET` | `/api/products/featured` | Public | Get featured products |
| `GET` | `/api/products/search?q=` | Public | Search products by name/category/tags |
| `GET` | `/api/products/:id` | Public | Get single product by ID |
| `POST` | `/api/products` | Admin | Create a new product |
| `PUT` | `/api/products/:id` | Admin | Update a product |
| `DELETE` | `/api/products/:id` | Admin | Delete a product (cascades reviews) |
| `GET` | `/api/products/:id/reviews` | Public | Get all reviews for a product |
| `POST` | `/api/products/:id/reviews` | Private | Submit a review (one per user per product) |

**Query Parameters for `GET /api/products`:**

| Parameter | Type | Example | Description |
|---|---|---|---|
| `category` | string | `Electronics` | Filter by exact category match |
| `minPrice` | number | `10` | Minimum price filter |
| `maxPrice` | number | `500` | Maximum price filter |
| `rating` | number | `4` | Minimum rating filter |
| `search` | string | `wireless` | Text search across name, category, tags |
| `sort` | string | `price_asc` | Sort order: `newest`, `price_asc`, `price_desc`, `popular` |
| `page` | number | `1` | Page number (starts at 1) |
| `limit` | number | `12` | Items per page (default 12) |
| `isFeatured` | boolean | `true` | Filter featured products |

**Products response format:**

```json
{
  "products": [ { "_id": "...", "name": "...", "price": 29.99, ... } ],
  "page": 1,
  "pages": 3,
  "total": 36
}
```

### Orders API

| Method | Endpoint | Access | Description | Request Body |
|---|---|---|---|---|
| `POST` | `/api/orders` | Private | Create a new order | `{ orderItems, shippingAddress, paymentMethod, itemsPrice, shippingPrice, taxPrice, totalPrice }` |
| `GET` | `/api/orders/myorders` | Private | Get current user's orders | — |
| `GET` | `/api/orders/:id` | Private | Get single order by ID (populated user) | — |
| `GET` | `/api/orders` | Admin | Get all orders (populated users) | — |
| `PUT` | `/api/orders/:id/pay` | Private | Update order as paid with PayPal result | `{ id, status, update_time, email_address }` |
| `PUT` | `/api/orders/:id/status` | Admin | Update order status | `{ status: "processing" | "shipped" | "delivered" | "cancelled" }` |

**Shipping address format:**

```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "phone": "+1 (555) 123-4567",
  "address": "123 Main Street",
  "addressLine2": "Apt 4B",
  "city": "New York",
  "state": "New York",
  "postalCode": "10001",
  "country": "United States"
}
```

### Users API (Admin)

| Method | Endpoint | Access | Description | Request Body |
|---|---|---|---|---|
| `GET` | `/api/users` | Admin | Get all users (without passwords) | — |
| `GET` | `/api/users/:id` | Admin | Get single user by ID | — |
| `DELETE` | `/api/users/:id` | Admin | Delete a user (cannot delete admins) | — |
| `PUT` | `/api/users/:id` | Admin | Update user (name, email, isAdmin) | `{ name?, email?, isAdmin? }` |

---

## 💳 Payment Integration

### PayPal Setup

ShopNest integrates PayPal sandbox for payment processing. Follow these steps to configure it:

#### Step 1: Create a PayPal Developer Account

1. Go to [https://developer.paypal.com](https://developer.paypal.com)
2. Sign in with your PayPal account or create a new one
3. Navigate to the **Dashboard**

#### Step 2: Create a Sandbox App

1. Click **My Apps & Credentials**
2. Under **REST API Apps**, click **Create App**
3. Name your app (e.g., "ShopNest Dev")
4. Select **Merchant** as the app type
5. Click **Create App**

#### Step 3: Copy Your Sandbox Credentials

1. After creation, you'll see a **Client ID** and **Secret**
2. Copy the **Client ID** (sandbox) — this goes into your `.env` file

```env
PAYPAL_CLIENT_ID=Ae7C9...your_sandbox_client_id...Z2
```

#### Step 4: Configure PayPal Buttons

The frontend uses `@paypal/react-paypal-js` to render PayPal buttons. The integration:

1. **Fetches the PayPal Client ID** from `GET /api/config/paypal` on checkout page load
2. **Creates a PayPal order** with the purchase unit amount when the user clicks the PayPal button
3. **Captures the payment** via `actions.order.capture()` on approval
4. **Sends the payment result** to `PUT /api/orders/:id/pay`

#### Step 5: Test with Sandbox Credentials

Use these test buyer credentials to simulate payments:

| Email | Password |
|---|---|
| `sb-xxxxxxx@personal.example.com` | Your sandbox test password |

You can find/fund test accounts at [PayPal Developer Dashboard > Sandbox > Accounts](https://developer.paypal.com/dashboard/accounts).

> **Note:** PayPal buttons only render when `step === 3` and `paymentMethod === 'PayPal'` and `createdOrder` exists (i.e., the user has clicked "Place Order" to create the order on the backend first). This ensures the order is persisted before payment processing.

---

## 🌐 Deployment

### Backend — Render.com

1. **Push your code to GitHub** (or GitLab/Bitbucket)
2. **Create a free Render account** at [https://render.com](https://render.com)
3. **Click "New +" → "Web Service"**
4. **Connect your repository**
5. **Configure the service:**

   | Setting | Value |
   |---|---|
   | **Name** | `shopnest-api` |
   | **Runtime** | `Node` |
   | **Build Command** | `npm install` |
   | **Start Command** | `node server/server.js` |
   | **Root Directory** | `professional` (or root if repo root) |

6. **Add Environment Variables:**

   ```
   NODE_ENV=production
   PORT=5000
   MONGO_URI=mongodb+srv://...
   JWT_SECRET=your_secure_jwt_secret
   JWT_EXPIRES_IN=30d
   PAYPAL_CLIENT_ID=your_sandbox_client_id
   CLIENT_URL=https://shopnest-demo.vercel.app
   ```

7. **Whitelist Render's IP in MongoDB Atlas:**
   - Atlas Network Access → Add IP Address → `0.0.0.0/0` (allow all — required for free tier)

8. **Deploy** — Render auto-builds on every push to the connected branch.

### Frontend — Vercel

1. **Push your client code to GitHub**
2. **Create a free Vercel account** at [https://vercel.com](https://vercel.com)
3. **Click "Add New" → "Project"**
4. **Import your repository**
5. **Configure:**

   | Setting | Value |
   |---|---|
   | **Framework Preset** | Vite |
   | **Root Directory** | `client` |
   | **Build Command** | `npm run build` |
   | **Output Directory** | `dist` |

6. **Add Environment Variable:**

   ```
   VITE_API_URL=https://shopnest-api.onrender.com/api
   ```

   > Note: In development, Vite's proxy handles `/api` requests. In production, you need to update the Axios `baseURL` to point to your Render backend. Edit `client/src/services/api.js` to use `import.meta.env.VITE_API_URL` when available:
   > ```js
   > baseURL: import.meta.env.VITE_API_URL || '/api',
   > ```

7. **Add `vercel.json`** in the `client` root directory:

   ```json
   {
     "rewrites": [{ "source": "/(.*)", "destination": "/" }]
   }
   ```

   This ensures React Router handles client-side routing on Vercel.

8. **Deploy** — Vercel auto-deploys on every push to the connected branch.

### Alternative: Railway.app (Single Deploy)

Railway supports monorepo deployments with a single service for both frontend and backend:

1. Create a Railway account
2. Connect your GitHub repo
3. Set root directory to the project root
4. Add a `start` script in root `package.json` that runs both server and static serve:

   ```json
   {
     "scripts": {
       "start": "node server/server.js",
       "build": "cd client && npm install && npm run build"
     }
   }
   ```

5. After building, configure Express to serve the client build in production:

   ```js
   // In server/server.js (at the end, before error middleware)
   if (process.env.NODE_ENV === 'production') {
     app.use(express.static(path.join(__dirname, '..', 'client', 'dist')));
     app.get('*', (req, res) => {
       res.sendFile(path.resolve(__dirname, '..', 'client', 'dist', 'index.html'));
     });
   }
   ```

---

## 🧪 Demo Credentials

| Role | Email | Password |
|---|---|---|
| **Admin** | `admin@shopnest.com` | `admin123` |
| **Test User 1** | `user@shopnest.com` | `user123` |
| **Test User 2** | `jane@shopnest.com` | `jane123` |

> 💡 **Tip:** The admin account has full access to the dashboard at `/admin`. Use the test user accounts to experience the customer shopping flow.

🔗 **Live Demo:** [https://shopnest-demo.vercel.app](https://shopnest-demo.vercel.app)  
🔗 **API Docs:** [https://shopnest-api.onrender.com/api](https://shopnest-api.onrender.com/api)

---

## 🗺️ Roadmap

- [x] **Core shopping flow** — Browse, search, filter, cart, checkout, orders
- [x] **PayPal sandbox integration** — Complete payment lifecycle with `@paypal/react-paypal-js`
- [x] **Admin dashboard** — Analytics charts, product/order/user management, settings
- [x] **JWT authentication** — Register, login, protected routes, role-based access
- [x] **Product reviews & ratings** — Star picker, aggregate display, duplicate prevention
- [x] **Promo code engine** — Percentage and free-shipping discount codes
- [x] **Responsive design** — Full mobile support with touch interactions
- [ ] **Stripe payment gateway** — Credit/debit card processing with Stripe Elements
- [ ] **Email notifications** — Order confirmation and shipping updates via Nodemailer
- [ ] **Product wishlist sharing** — Share wishlists via unique links
- [ ] **Multi-currency support** — Dynamic pricing in USD, EUR, GBP, INR
- [ ] **Mobile app** — React Native cross-platform mobile experience
- [ ] **AI product recommendations** — Personalized suggestions based on browsing history
- [ ] **Inventory alerts** — Low-stock email/SMS notifications for admins
- [ ] **Order tracking** — Real-time shipping status with carrier integration
- [ ] **Social login** — OAuth with Google and Facebook

---

## 🤝 Contributing

Contributions are welcome and appreciated! Here's how to contribute:

### Development Workflow

1. **Fork the repository** on GitHub
2. **Clone your fork:**

   ```bash
   git clone https://github.com/your-username/shopnest.git
   cd shopnest
   ```

3. **Create a feature branch:**

   ```bash
   git checkout -b feat/your-feature-name
   ```

4. **Make your changes** and commit them:

   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

5. **Push to your fork:**

   ```bash
   git push origin feat/your-feature-name
   ```

6. **Open a Pull Request** against the `main` branch

### Commit Message Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

| Prefix | Usage |
|---|---|
| `feat:` | A new feature |
| `fix:` | A bug fix |
| `docs:` | Documentation changes |
| `style:` | Code style changes (formatting, missing semicolons, etc.) |
| `refactor:` | Code refactoring (neither a feature nor a fix) |
| `perf:` | Performance improvements |
| `test:` | Adding or updating tests |
| `chore:` | Build process, dependencies, or tooling changes |

### Code Style Guidelines

- **JavaScript:** ES6+ syntax, async/await over callbacks
- **React:** Functional components with hooks, no class components
- **State Management:** Redux Toolkit slices with `createAsyncThunk` for async operations
- **CSS:** Tailwind utility classes first; avoid custom CSS unless necessary
- **Error Handling:** Always show user feedback via `react-hot-toast`
- **Forms:** Use `react-hook-form` with Yup schemas for validation

---

## 📄 License

MIT License

Copyright (c) 2026 ShopNest

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

---

## 👨‍💻 Author

**Adnan Adnan** — Full-Stack Developer

[![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Adna9Shafi)

- 💬 **Ask me about:** React, Node.js, MongoDB, Redux, Tailwind CSS
- 📫 **Reach me:** [https://github.com/Adna9Shafi](https://github.com/Adna9Shafi)

---

## 🌟 Acknowledgments

- **Unsplash** — For the beautiful product and lifestyle images used throughout the demo
- **Tailwind CSS** — For the utility-first CSS framework that made the responsive UI a pleasure to build
- **Redux Toolkit** — For the opinionated, batteries-included state management approach
- **The React Community** — For years of open-source contributions, tutorials, and ecosystem growth
- **MongoDB Atlas** — For the generous free tier that makes cloud database hosting accessible
- **PayPal Developer** — For the comprehensive API and sandbox testing environment
- **Vercel & Render** — For free-tier hosting that simplifies deployment
- **All open-source maintainers** — Whose packages and tools made this project possible 🙏

---

<p align="center">Made with ❤️ by Adnan Shafi</p>
