import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { BsSun, BsMoonFill } from "react-icons/bs";
import GithubButton from '../buttons/GithubButton';
import ModelinaLogo from '../icons/ModelinaLogo';
import ModelinaLogoDark from '../icons/ModelinaLogoDark';
import MobileNavMenu from './MobileNavMenu';
import NavItem from './NavItem';
import { useTheme } from '../contexts/ThemeContext';

export default function NavBar({ className = '', hideLogo = false }) {
  const { asPath } = useRouter();
  const [open, setOpen] = useState<boolean>();
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const { theme, toggleTheme } = useTheme();
  const isDarkMode = theme === 'dark';
  function showMenu(menu: boolean) {
    if (open === menu) return;
    setOpen(menu);
  }

  useEffect(() => {
    setMobileMenuOpen(false);
    setOpen(false);
  }, [asPath]);

  const LogoComponent = isDarkMode ? ModelinaLogoDark : ModelinaLogo;

  return (
    <div 
      className={`${className} z-50 transition-colors duration-200 border-b dark:border-gray-800
        backdrop-blur-md bg-white/80 dark:bg-gray-900/80`}
    >
      <div className='flex w-full items-center justify-between py-3 lg:justify-start lg:space-x-10'>
        {!hideLogo && (
          <div className='lg:w-auto lg:flex-1'>
            <div className='flex'>
              <Link href='https://modelina.org/' className='cursor-pointer'>
                <LogoComponent
                  className={`h-12 w-auto sm:h-16 transition-opacity duration-200 ${
                    theme === 'dark' ? 'opacity-90' : 'opacity-100'
                  }`} 
                />
              </Link>
            </div>
          </div>
        )}

        <div className='-my-2 -mr-2 flex flex-row items-center justify-center lg:hidden'>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl mr-2 transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-gray-800"
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? (
              <BsSun className="w-5 h-5 text-blue-400" />
            ) : (
              <BsMoonFill className="w-5 h-5 text-blue-600" />
            )}
          </button>
          <button
            onClick={() => setMobileMenuOpen(true)}
            type='button'
            className='inline-flex items-center justify-center rounded-md p-2 text-gray-600 dark:text-gray-300
              hover:bg-gray-100 dark:hover:bg-gray-800 transition duration-200 ease-in-out focus:outline-none'
          >
            <svg className='size-6' stroke='currentColor' fill='none' viewBox='0 0 24 24'>
              <title>Menu</title>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M4 6h16M4 12h16M4 18h16' />
            </svg>
          </button>
        </div>

        <nav className='hidden w-full space-x-6 lg:flex lg:items-center lg:justify-end xl:space-x-10'>
          <div className='relative' onMouseLeave={() => showMenu(false)}>
            <NavItem text='Examples' href='/examples' />
          </div>

          <div className='relative' onMouseLeave={() => showMenu(false)}>
            <NavItem text='Playground' href='/playground' />
          </div>

          <div className='relative' onMouseLeave={() => showMenu(false)}>
            <NavItem text='Docs' href='/docs' />
          </div>

          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-gray-800"
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? (
              <BsSun className="w-5 h-5 text-blue-400" />
            ) : (
              <BsMoonFill className="w-5 h-5 text-blue-600" />
            )}
          </button>

          <div className='justify-content flex flex-row items-center'>
            <GithubButton
              text='Star on GitHub'
              href='https://github.com/asyncapi/modelina'
              className='ml-2 py-2'
              inNav='true'
            />
          </div>
        </nav>
      </div>

      {mobileMenuOpen && <MobileNavMenu onClickClose={() => setMobileMenuOpen(false)} />}
    </div>
  );
}