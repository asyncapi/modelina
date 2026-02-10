import Link from 'next/link';

import ModelinaLogo from '../icons/ModelinaLogo';

export default function MobileNavMenu({ onClickClose = () => {} }) {
  return (
    <div className='fixed inset-x-0 top-0 max-h-full origin-top-right overflow-y-scroll py-2 transition lg:hidden'>
      <div className='rounded-lg shadow-lg'>
        <div className='shadow-xs divide-y-2 divide-gray-50 rounded-lg bg-white'>
          <div className='space-y-6 px-5 pb-6 pt-5'>
            <div className='flex items-center justify-between'>
              <Link href='/' className='flex'>
                <ModelinaLogo className='h-8 w-auto' />
              </Link>
              <div className='justify-content -mr-2 flex flex-row items-center'>
                <button
                  onClick={onClickClose}
                  type='button'
                  className='inline-flex items-center justify-center rounded-md p-2 text-gray-400 transition duration-150 ease-in-out hover:bg-gray-100 hover:text-gray-500 focus:bg-gray-100 focus:text-gray-500 focus:outline-none'
                >
                  <svg className='size-6' stroke='currentColor' fill='none' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M6 18L18 6M6 6l12 12' />
                  </svg>
                </button>
              </div>
            </div>
            <div className='space-y-2 py-2'>
              <Link href='/examples' className='flex cursor-pointer'>
                <h4 className='mb-4 block font-medium text-gray-500'>Examples</h4>
              </Link>
              <Link href='/playground' className='flex cursor-pointer'>
                <h4 className='mb-4 block font-medium text-gray-500'>Playground</h4>
              </Link>
              <Link href='/docs' className='flex cursor-pointer'>
                <h4 className='mb-4 block font-medium text-gray-500'>Docs</h4>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
