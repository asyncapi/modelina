export default function StickyNavbar({ children, className = '' }: any) {
  return (
    <div className={`sticky top-0 z-30 w-full border-b border-gray-200 dark:border-gray-800 
      bg-white dark:bg-gray-900 ${className}`}>
      {children}
    </div>
  );
}