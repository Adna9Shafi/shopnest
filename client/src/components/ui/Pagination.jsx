import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

export default function Pagination({ page, pages, onPageChange }) {
  if (pages <= 1) return null;

  const getPages = () => {
    const delta = 2;
    const range = [];
    for (let i = Math.max(2, page - delta); i <= Math.min(pages - 1, page + delta); i++) range.push(i);
    if (page - delta > 2) range.unshift('...');
    if (page + delta < pages - 1) range.push('...');
    return [1, ...range, pages];
  };

  return (
    <div className="flex items-center justify-center gap-1 mt-8">
      <button disabled={page <= 1} onClick={() => onPageChange(page - 1)} className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed">
        <FiChevronLeft size={18} />
      </button>
      {getPages().map((p, i) =>
        p === '...' ? <span key={`dots-${i}`} className="px-2 text-textMuted">...</span> : (
          <button key={p} onClick={() => onPageChange(p)} className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${p === page ? 'bg-primary text-white' : 'hover:bg-gray-100'}`}>
            {p}
          </button>
        )
      )}
      <button disabled={page >= pages} onClick={() => onPageChange(page + 1)} className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed">
        <FiChevronRight size={18} />
      </button>
    </div>
  );
}
