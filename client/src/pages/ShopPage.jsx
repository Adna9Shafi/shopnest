import { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { productService } from '../services/productService';
import ProductCard from '../components/product/ProductCard';
import ProductFilters from '../components/product/ProductFilters';
import ProductSort from '../components/product/ProductSort';
import Pagination from '../components/ui/Pagination';
import Spinner from '../components/ui/Spinner';
import { FiGrid, FiList, FiSearch, FiSliders, FiX } from 'react-icons/fi';

export default function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(parseInt(searchParams.get('page')) || 1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [viewMode, setViewMode] = useState('grid');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const searchTimeout = useRef(null);

  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    rating: searchParams.get('rating') || '',
    search: searchParams.get('search') || '',
    sort: searchParams.get('sort') || 'newest',
  });

  useEffect(() => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => { if (v) params.set(k, v); });
    if (page > 1) params.set('page', page);
    params.set('limit', '12');
    setSearchParams(params, { replace: true });
  }, [filters, page, setSearchParams]);

  useEffect(() => {
    setLoading(true);
    window.scrollTo(0, 0);
    const params = { ...filters, page, limit: 12 };
    Object.keys(params).forEach((k) => { if (!params[k]) delete params[k]; });
    productService.getAll(params).then((res) => {
      setProducts(res.data.products);
      setPage(res.data.page);
      setPages(res.data.pages);
      setTotal(res.data.total);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [filters, page]);

  const handleFilterChange = useCallback((newFilters) => {
    setFilters(newFilters);
    setPage(1);
  }, []);

  const handleSortChange = useCallback((sort) => {
    setFilters((p) => ({ ...p, sort }));
  }, []);

  const handleSearchChange = (e) => {
    clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => {
      setFilters((p) => ({ ...p, search: e.target.value }));
      setPage(1);
    }, 300);
  };

  const clearAll = () => {
    setFilters({ category: '', minPrice: '', maxPrice: '', rating: '', search: '', sort: 'newest' });
    setPage(1);
  };

  const hasActiveFilters = filters.category || filters.minPrice || filters.maxPrice || filters.rating || filters.search;

  return (
    <>
      <Helmet><title>Shop — ShopNest</title></Helmet>
      <div className="container-custom py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-heading font-bold">All Products</h1>
            {!loading && <p className="text-sm text-textMuted mt-1">Showing {products.length} of {total} products</p>}
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setShowMobileFilters(true)} className="lg:hidden flex items-center gap-2 px-4 py-2 border border-border rounded-lg text-sm hover:bg-gray-50">
              <FiSliders size={16} /> Filters
            </button>
            <ProductSort value={filters.sort} onChange={handleSortChange} />
            <div className="hidden sm:flex border border-border rounded-lg overflow-hidden">
              <button onClick={() => setViewMode('grid')} className={`p-2 ${viewMode === 'grid' ? 'bg-primary text-white' : 'text-textMuted hover:bg-gray-50'}`}><FiGrid size={16} /></button>
              <button onClick={() => setViewMode('list')} className={`p-2 ${viewMode === 'list' ? 'bg-primary text-white' : 'text-textMuted hover:bg-gray-50'}`}><FiList size={16} /></button>
            </div>
          </div>
        </div>

        <div className="flex gap-8">
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-24 space-y-6">
              <div className="relative">
                <FiSearch size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-textMuted" />
                <input type="text" defaultValue={filters.search} onChange={handleSearchChange} placeholder="Search products..." className="w-full pl-9 pr-4 py-2.5 bg-white border border-border rounded-lg text-sm focus:ring-2 focus:ring-secondary/20 focus:border-secondary" />
              </div>
              <ProductFilters filters={filters} onChange={handleFilterChange} showCounts />
              {hasActiveFilters && (
                <button onClick={clearAll} className="text-sm text-secondary hover:underline">Clear all filters</button>
              )}
            </div>
          </aside>

          {showMobileFilters && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <div className="absolute inset-0 bg-black/50" onClick={() => setShowMobileFilters(false)} />
              <div className="absolute left-0 top-0 bottom-0 w-80 bg-white p-6 overflow-y-auto animate-slide-in">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-heading font-semibold">Filters</h3>
                  <button onClick={() => setShowMobileFilters(false)} className="p-1 hover:bg-gray-100 rounded"><FiX size={20} /></button>
                </div>
                <div className="relative mb-6">
                  <FiSearch size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-textMuted" />
                  <input type="text" defaultValue={filters.search} onChange={handleSearchChange} placeholder="Search products..." className="w-full pl-9 pr-4 py-2.5 bg-white border border-border rounded-lg text-sm focus:ring-2 focus:ring-secondary/20 focus:border-secondary" />
                </div>
                <ProductFilters filters={filters} onChange={(f) => { handleFilterChange(f); }} showCounts />
                {hasActiveFilters && (
                  <button onClick={clearAll} className="text-sm text-secondary hover:underline mt-4">Clear all filters</button>
                )}
              </div>
            </div>
          )}

          <div className="flex-1 min-w-0">
            {loading ? (
              <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3' : 'grid-cols-1'} gap-4 md:gap-6`}>
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className={`card overflow-hidden animate-pulse ${viewMode === 'list' ? 'flex gap-4' : ''}`}>
                    <div className={`${viewMode === 'list' ? 'w-40 shrink-0' : ''} aspect-[4/3] bg-gray-200`} />
                    <div className="p-4 space-y-3 flex-1">
                      <div className="h-4 bg-gray-200 rounded w-3/4" />
                      <div className="h-3 bg-gray-200 rounded w-1/2" />
                      <div className="h-5 bg-gray-200 rounded w-1/3" />
                      <div className="h-10 bg-gray-200 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-20">
                <FiSearch size={48} className="mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-heading font-semibold text-primary mb-1">No products found</h3>
                <p className="text-textMuted text-sm mb-4">Try adjusting your search or filter criteria</p>
                {hasActiveFilters && <button onClick={clearAll} className="btn-primary">Clear Filters</button>}
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                {products.map((product) => <ProductCard key={product._id} product={product} />)}
              </div>
            ) : (
              <div className="space-y-4">
                {products.map((product) => (
                  <div key={product._id} className="card flex gap-4 p-4">
                    <Link to={`/product/${product._id}`} className="shrink-0 w-32 h-32">
                      <img src={product.images?.[0] || '/placeholder.jpg'} alt={product.name} className="w-full h-full object-cover rounded-lg" />
                    </Link>
                    <div className="flex-1 min-w-0">
                      <Link to={`/product/${product._id}`} className="text-base font-medium text-primary hover:text-secondary transition-colors">{product.name}</Link>
                      <p className="text-sm text-textMuted mt-1 line-clamp-2">{product.description}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-lg font-bold text-primary">{product.price ? `$${product.price.toFixed(2)}` : ''}</span>
                        {product.comparePrice && <span className="text-sm text-textMuted line-through">${product.comparePrice.toFixed(2)}</span>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <Pagination page={page} pages={pages} onPageChange={setPage} />
          </div>
        </div>
      </div>
    </>
  );
}
