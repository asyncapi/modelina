import Link from 'next/link';

export default function NavItem({
  text,
  href,
  target = '_self',
  onClick = undefined,
  onMouseEnter = undefined,
  hasDropdown = false,
  className = ''
}: any) {
  if (href && !hasDropdown) {
    return (
      <Link
        href={href}
        target={target}
        rel='noopener noreferrer'
        className={`${className} font-body text-base font-semibold leading-6 text-gray-700 transition duration-150 ease-in-out hover:text-gray-900 focus:text-gray-900 focus:outline-none`}
      >
        {text}
      </Link>
    );
  }

  return (
    <button
      type='button'
      onClick={href ? undefined : onClick}
      onMouseEnter={onMouseEnter}
      className={`${className} group inline-flex items-center space-x-2 text-base font-semibold leading-6 tracking-heading text-gray-700 transition duration-150 ease-in-out hover:text-gray-900 focus:text-gray-900 focus:outline-none`}
    >
      {href ? (
        <Link
          href={href}
          target={target}
          rel='noopener noreferrer'
          className={`${className} font-body text-base font-semibold leading-6 text-gray-700 transition duration-150 ease-in-out hover:text-gray-900 focus:text-gray-900 focus:outline-none`}
        >
          {text}
        </Link>
      ) : (
        <span>{text}</span>
      )}
      {hasDropdown && (
        <div className='inline-block'>
          <svg
            className='size-5 text-gray-400 transition duration-150 ease-in-out group-hover:text-gray-500 group-focus:text-gray-500'
            fill='currentColor'
            viewBox='0 0 20 20'
          >
            <path
              fillRule='evenodd'
              d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z'
              clipRule='evenodd'
            />
          </svg>
        </div>
      )}
    </button>
  );
}
