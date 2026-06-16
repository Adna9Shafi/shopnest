import { useEffect, useCallback } from 'react';
import { FiX } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

export default function Modal({ isOpen, onClose, title, children, size = 'md' }) {
  const handleEsc = useCallback((e) => { if (e.key === 'Escape') onClose(); }, [onClose]);
  useEffect(() => {
    if (isOpen) { document.addEventListener('keydown', handleEsc); document.body.style.overflow = 'hidden'; }
    return () => { document.removeEventListener('keydown', handleEsc); document.body.style.overflow = ''; };
  }, [isOpen, handleEsc]);

  const sizes = { sm: 'max-w-md', md: 'max-w-2xl', lg: 'max-w-4xl' };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/50" onClick={onClose} />
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className={`relative bg-card rounded-xl shadow-modal w-full ${sizes[size]} max-h-[90vh] overflow-y-auto`}>
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h3 className="text-lg font-heading font-semibold">{title}</h3>
              <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg transition-colors"><FiX size={20} /></button>
            </div>
            <div className="p-4">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
