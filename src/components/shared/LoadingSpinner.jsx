/**
 * Loading Spinner Component
 * @param {Object} props
 * @param {string} props.size - Size variant: 'sm', 'md', 'lg'
 * @param {string} props.text - Optional loading text
 * @param {string} props.className - Additional CSS classes
 */
const LoadingSpinner = ({ size = 'md', text = '', className = '' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  const spinnerSize = sizeClasses[size] || sizeClasses.md;

  return (
    <div className={`flex flex-col items-center justify-center py-8 ${className}`}>
      <div className={`${spinnerSize} border-4 border-gray-200 border-t-primary-600 rounded-full animate-spin`} />
      {text && <p className="mt-4 text-gray-600 text-sm">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;
