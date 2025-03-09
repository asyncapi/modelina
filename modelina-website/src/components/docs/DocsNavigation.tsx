import React from 'react';

interface DocsNavigationProps {
  onClose: () => void;
  menuItems: React.ReactNode;
}

const DocsNavigation: React.FC<DocsNavigationProps> = ({ onClose, menuItems }) => {
  return (
    <div className="z-60 lg:hidden">
      <div className="fixed inset-0 z-40 flex">
        {/* Overlay */}
        <div className="fixed inset-0">
          <div
            className="absolute inset-0 bg-gray-600 opacity-75 dark:bg-gray-900"
            onClick={onClose}
          />
        </div>

        {/* Navigation panel */}
        <div className="relative flex w-full max-w-xs flex-1 flex-col bg-white dark:bg-dark">
          {/* Close button */}
          <div className="absolute right-0 top-0 -mr-14 p-1">
            <button
              onClick={onClose}
              className="flex size-12 items-center justify-center rounded-full focus:bg-gray-600 focus:outline-none"
              aria-label="Close sidebar"
            >
              <svg
                className="size-6 text-white"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Navigation content */}
          <div className="h-0 flex-1 overflow-y-auto pt-5">
            <nav className="mb-4 mt-5 px-2">
              <ul className="ml-3 mt-1 border-l border-gray-200 dark:border-gray-700 pl-4">
                {menuItems}
              </ul>
            </nav>
          </div>
        </div>

        {/* Spacer */}
        <div className="w-14 shrink-0" />
      </div>
    </div>
  );
};

export default DocsNavigation;