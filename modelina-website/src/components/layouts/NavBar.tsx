import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import GithubButton from '../buttons/GithubButton';
import ModelinaLogo from '../icons/ModelinaLogo';
import MobileNavMenu from './MobileNavMenu';
import NavItem from './NavItem';

export default function NavBar({ className = '', hideLogo = false }) {
  const { asPath } = useRouter();
  const [open, setOpen] = useState<boolean>();
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  function showMenu(menu: boolean) {
    if (open === menu) {
      return;
    }
    setOpen(menu);
  }

  useEffect(() => {
    setMobileMenuOpen(false);
    setOpen(false);
  }, [asPath]);

  return (
    <div className={`bg-white ${className} z-50`}>
      <div className='flex w-full items-center justify-between py-3 lg:justify-start lg:space-x-10'>
        {!hideLogo && (
          <div className='lg:w-auto lg:flex-1'>
            <div className='flex'>
              <Link href='https://modelina.org/' className='cursor-pointer'>
                <ModelinaLogo className='h-12 w-auto sm:h-16' />
              </Link>
            </div>
          </div>
        )}

        <div className='-my-2 -mr-2 flex flex-row items-center justify-center lg:hidden'>
          <button
            onClick={() => setMobileMenuOpen(true)}
            type='button'
            className='inline-flex items-center justify-center rounded-md p-2 text-gray-400 transition duration-150 ease-in-out hover:bg-gray-100 hover:text-gray-500 focus:bg-gray-100 focus:text-gray-500 focus:outline-none'
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

      {/* Mobile menu, show/hide based on mobile menu state. */}
      {mobileMenuOpen && <MobileNavMenu onClickClose={() => setMobileMenuOpen(false)} />}
    </div>
  );
}
