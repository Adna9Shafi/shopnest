import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

export default function Rating({ value = 0, count, size = 'sm' }) {
  const starSize = size === 'sm' ? 'text-sm' : 'text-base';
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star} className={`${starSize} ${star <= Math.floor(value) ? 'text-accent' : star === Math.ceil(value) && value % 1 >= 0.5 ? 'text-accent' : 'text-gray-300'}`}>
          {star <= Math.floor(value) ? <FaStar /> : star === Math.ceil(value) && value % 1 >= 0.5 ? <FaStarHalfAlt /> : <FaRegStar />}
        </span>
      ))}
      {count !== undefined && <span className="text-xs text-textMuted ml-1">({count})</span>}
    </div>
  );
}
