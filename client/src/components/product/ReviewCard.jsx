import Rating from '../ui/Rating';
import { formatDate } from '../../utils/formatDate';

export default function ReviewCard({ review }) {
  return (
    <div className="p-4 bg-gray-50 rounded-xl">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium">{review.name}</span>
        <span className="text-xs text-textMuted">{formatDate(review.createdAt)}</span>
      </div>
      <Rating value={review.rating} size="sm" />
      <p className="text-sm text-textMuted mt-2 leading-relaxed">{review.comment}</p>
    </div>
  );
}
