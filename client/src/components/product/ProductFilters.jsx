import { useState } from 'react';
import { FiChevronDown } from 'react-icons/fi';

const categories = ['All', 'Electronics', 'Clothing', 'Home & Garden', 'Sports', 'Beauty'];

export default function ProductFilters({ filters, onChange }) {
  const [showFilters, setShowFilters] = useState(false);

  const handleChange = (key, value) => {
    onChange({ ...filters, [key]: value });
  };

  return (
    <div className="space-y-6">
      <div>
        <button onClick={() => setShowFilters(!showFilters)} className="flex items-center justify-between w-full lg:hidden text-sm font-semibold mb-2">
          Filters <FiChevronDown className={`transition-transform ${showFilters ? 'rotate-180' : ''}`} />
        </button>
        <div className={`space-y-6 ${showFilters ? 'block' : 'hidden'} lg:block`}>
          <div>
            <h4 className="text-xs font-semibold text-textMuted uppercase tracking-wider mb-3">Category</h4>
            <div className="space-y-1">
              {categories.map((cat) => (
                <button key={cat} onClick={() => handleChange('category', cat === 'All' ? '' : cat)} className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${(filters.category === cat || (!filters.category && cat === 'All')) ? 'bg-secondary/10 text-secondary font-medium' : 'hover:bg-gray-50 text-textMuted'}`}>
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-textMuted uppercase tracking-wider mb-3">Price Range</h4>
            <div className="flex items-center gap-2">
              <input type="number" placeholder="Min" value={filters.minPrice || ''} onChange={(e) => handleChange('minPrice', e.target.value)} className="w-full px-3 py-2 bg-gray-50 border border-border rounded-lg text-sm" />
              <span className="text-textMuted">-</span>
              <input type="number" placeholder="Max" value={filters.maxPrice || ''} onChange={(e) => handleChange('maxPrice', e.target.value)} className="w-full px-3 py-2 bg-gray-50 border border-border rounded-lg text-sm" />
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-textMuted uppercase tracking-wider mb-3">Minimum Rating</h4>
            <div className="flex gap-1">
              {[4, 3, 2, 1].map((r) => (
                <button key={r} onClick={() => handleChange('rating', filters.rating === r ? '' : r)} className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${filters.rating === r ? 'bg-accent text-white' : 'bg-gray-100 hover:bg-gray-200'}`}>
                  {r}+
                </button>
              ))}
            </div>
          </div>

          <button onClick={() => onChange({})} className="text-sm text-secondary hover:underline">Clear all filters</button>
        </div>
      </div>
    </div>
  );
}
