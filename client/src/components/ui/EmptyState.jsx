import { FiInbox } from 'react-icons/fi';
import Button from './Button';

export default function EmptyState({ icon: Icon = FiInbox, title = 'Nothing here', description, actionLabel, onAction }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <Icon size={48} className="text-gray-300 mb-4" />
      <h3 className="text-lg font-heading font-semibold text-primary mb-1">{title}</h3>
      {description && <p className="text-textMuted text-sm mb-4 max-w-xs">{description}</p>}
      {actionLabel && onAction && <Button onClick={onAction}>{actionLabel}</Button>}
    </div>
  );
}
