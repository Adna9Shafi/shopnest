export default function Button({ children, variant = 'primary', size = 'md', className = '', disabled, onClick, type = 'button' }) {
  const base = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed';
  const variants = {
    primary: 'bg-primary text-white hover:bg-primary/90',
    accent: 'bg-accent text-white hover:bg-accent/90',
    outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-white',
    ghost: 'text-textMuted hover:bg-gray-100',
    danger: 'bg-danger text-white hover:bg-danger/90',
  };
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  return (
    <button type={type} disabled={disabled} onClick={onClick} className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}>
      {children}
    </button>
  );
}
