import ModelinaLogo from '../icons/ModelinaLogo';
import Link from 'next/link';

export default function MobileNavMenu({ onClickClose = () => { } }) {
  return (
    <div className="fixed top-0 inset-x-0 py-2 transition transform origin-top-right max-h-full lg:hidden overflow-y-scroll">
      <div className="rounded-lg shadow-lg">
        <div className="rounded-lg shadow-xs bg-white divide-y-2 divide-gray-50">
          <div className="pt-5 pb-6 px-5 space-y-6">
            <div className="flex items-center justify-between">
              <Link href="/" className="flex">
                <ModelinaLogo className="h-8 w-auto" />
              </Link>
              <div className="flex flex-row items-center justify-content -mr-2">
                <button
                  onClick={onClickClose}
                  type="button"
                  className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-gray-500 transition duration-150 ease-in-out"
                >
                  <svg
                    className="h-6 w-6"
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
            </div>
            <div className="py-2 space-y-2">
              <Link href="/examples" className="flex" legacyBehavior>
                <a className="cursor-pointer">
                  <h4 className="text-gray-500 hover:text-gray-600 font-medium block mb-4 bg-gray-100 px-2 py-2 rounded-md">
                    Examples
                  </h4>
                </a>
              </Link>
              <Link href="/playground" className="flex" legacyBehavior>
                <a className="cursor-pointer">
                  <h4 className="text-gray-500 hover:text-gray-600 font-medium block mb-4 bg-gray-100 px-2 py-2 rounded-md">
                    Playground
                  </h4>
                </a>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
