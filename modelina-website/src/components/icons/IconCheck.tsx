export default function IconCheck({ className }: any) {
    return (
      <svg
        className={className || 'inline-block'}
        fill='currentColor'
        viewBox='0 0 22 22'
        
      >
        <circle cx='12' cy='12' r='10' className='text-gray-500' />
        <path
          d='M7 12l3 3 7-7'
          fill='none'
          stroke='#252f3f'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
        />
      </svg>
    );
  }
  