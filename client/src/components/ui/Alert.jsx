import { FiAlertCircle, FiCheckCircle, FiInfo, FiX } from 'react-icons/fi';

export default function Alert({ type = 'info', message, onClose }) {
  const config = {
    success: { bg: 'bg-success/10', text: 'text-success', icon: FiCheckCircle },
    error: { bg: 'bg-danger/10', text: 'text-danger', icon: FiAlertCircle },
    info: { bg: 'bg-secondary/10', text: 'text-secondary', icon: FiInfo },
  };
  const { bg, text, icon: Icon } = config[type] || config.info;

  if (!message) return null;
  return (
    <div className={`${bg} ${text} px-4 py-3 rounded-lg flex items-center gap-3 text-sm`}>
      <Icon className="shrink-0" />
      <span className="flex-1">{message}</span>
      {onClose && <button onClick={onClose} className="hover:opacity-70"><FiX /></button>}
    </div>
  );
}
