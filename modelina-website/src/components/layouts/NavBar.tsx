import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import ModelinaLogo from '../icons/ModelinaLogo';
import NavItem from './NavItem';
import MobileNavMenu from './MobileNavMenu';
import GithubButton from '../buttons/GithubButton';
import Link from 'next/link';

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
      <div className="flex w-full justify-between items-center py-6 lg:justify-start lg:space-x-10">
        {!hideLogo && (
          <div className="lg:w-auto lg:flex-1">
            <div className="flex">
              <Link href="https://modelina.org/" className="cursor-pointer">
                <ModelinaLogo className="h-8 w-auto sm:h-8" />
              </Link>
            </div>
          </div>
        )}

        <div className="flex flex-row items-center justify-center -mr-2 -my-2 lg:hidden">
          <button
            onClick={() => setMobileMenuOpen(true)}
            type="button"
            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-gray-500 transition duration-150 ease-in-out"
          >
            <svg
              className="h-6 w-6"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 24 24"
            >
              <title>Menu</title>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>

        <nav className="hidden lg:flex lg:items-center lg:justify-end space-x-6 xl:space-x-10 w-full">
          <div className="relative" onMouseLeave={() => showMenu(false)}>
            <NavItem text="Examples" href="/examples" />
          </div>

          <div className="relative" onMouseLeave={() => showMenu(false)}>
            <NavItem text="Playground" href="/playground" />
          </div>

          <div className="relative" onMouseLeave={() => showMenu(false)}>
            <NavItem text="Docs" href="/docs" />
          </div>

          <div className="flex flex-row items-center justify-content">
            <GithubButton
              text="Star on GitHub"
              href="https://github.com/asyncapi/modelina"
              className="py-2 ml-2"
              inNav="true"
            />
          </div>
        </nav>
      </div>

      {/* Mobile menu, show/hide based on mobile menu state. */}
      {mobileMenuOpen && (
        <MobileNavMenu onClickClose={() => setMobileMenuOpen(false)} />
      )}
    </div>
  );
}
