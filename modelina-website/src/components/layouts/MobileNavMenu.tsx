import { useTheme } from '../contexts/ThemeContext';
import Link from 'next/link';
import ModelinaLogo from '../icons/ModelinaLogo';
import ModelinaLogoDark from '../icons/ModelinaLogoDark';

interface MobileNavMenuProps {
  onClickClose?: () => void;
}

export default function MobileNavMenu({ onClickClose = () => {} }: MobileNavMenuProps) {
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';
  const LogoComponent = isDarkMode ? ModelinaLogoDark : ModelinaLogo; 

  return (
    <div className='fixed inset-x-0 top-0 max-h-full origin-top-right overflow-y-scroll py-2 transition lg:hidden'>
      <div className='rounded-lg shadow-lg'>
        <div className='shadow-xs divide-y-2 divide-gray-50 dark:divide-gray-700 rounded-lg bg-white dark:bg-dark'>
          <div className='space-y-6 px-5 pb-6 pt-5'>
            <div className='flex items-center justify-between'>
              <Link href='/' className='flex'>
                <LogoComponent className='h-8 w-auto' />
              </Link>
              <div className='justify-content -mr-2 flex flex-row items-center'>
                <button
                  onClick={onClickClose}
                  type='button'
                  className='inline-flex items-center justify-center rounded-md p-2 text-gray-400 transition duration-150 ease-in-out hover:bg-gray-100 hover:text-gray-500 focus:bg-gray-100 focus:text-gray-500 focus:outline-none dark:hover:bg-gray-800 dark:hover:text-gray-300 dark:focus:bg-gray-800 dark:focus:text-gray-300'
                >
                  <svg className='size-6' stroke='currentColor' fill='none' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M6 18L18 6M6 6l12 12' />
                  </svg>
                </button>
              </div>
            </div>
            <div className='space-y-2 py-2'>
              <Link href='/examples' className='flex' legacyBehavior>
                <h4 className='mb-4 block font-medium text-gray-500 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'>
                  <a className='cursor-pointer'>Examples</a>
                </h4>
              </Link>
              <Link href='/playground' className='flex' legacyBehavior>
                <h4 className='mb-4 block font-medium text-gray-500 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'>
                  <a className='cursor-pointer'>Playground</a>
                </h4>
              </Link>
              <Link href='/docs' className='flex' legacyBehavior>
                <h4 className='mb-4 block font-medium text-gray-500 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'>
                  <a className='cursor-pointer'>Docs</a>
                </h4>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}