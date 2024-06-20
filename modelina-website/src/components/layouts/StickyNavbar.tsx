export default function StickyNavbar({ children, className = '' }: any) {
  return <div className={`sticky top-0 z-30 w-full border-b border-gray-300 bg-white ${className}`}>{children}</div>;
}
