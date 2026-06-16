export default function ProductSort({ value, onChange }) {
  const options = [
    { value: 'newest', label: 'Newest' },
    { value: 'price_asc', label: 'Price: Low to High' },
    { value: 'price_desc', label: 'Price: High to Low' },
    { value: 'popular', label: 'Most Popular' },
  ];

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-textMuted hidden sm:inline">Sort by:</span>
      <select value={value || 'newest'} onChange={(e) => onChange(e.target.value)} className="px-3 py-2 bg-white border border-border rounded-lg text-sm focus:ring-2 focus:ring-secondary/20 focus:border-secondary">
        {options.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
      </select>
    </div>
  );
}
