import { useTheme } from '../contexts/ThemeContext';
import { FiMoon, FiSun } from 'react-icons/fi';

export function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme();
  
  return (
    <button
      onClick={toggleTheme}
      className="rounded-md p-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}
    >
      {isDark ? (
        <FiSun className="h-5 w-5 text-gray-600 dark:text-gray-400" />
      ) : (
        <FiMoon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
      )}
    </button>
  );
}