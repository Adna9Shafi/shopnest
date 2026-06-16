export default function Badge({ type, text }) {
  const styles = {
    new: 'bg-success text-white',
    sale: 'bg-danger text-white',
    hot: 'bg-accent text-white',
  };
  return (
    <span className={`${styles[type] || 'bg-gray-500 text-white'} text-xs font-semibold px-2.5 py-1 rounded-full`}>
      {text || type.toUpperCase()}
    </span>
  );
}
