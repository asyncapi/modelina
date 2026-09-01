import { twMerge } from 'tailwind-merge';

export default function Select({ className = '', onChange = () => {}, options = [], value }: any) {
  return (
    <select
      onChange={(ev: any) => onChange(ev.target.value)}
      className={twMerge(
        `inline-flex h-full form-select justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100 focus:outline-none ${className}`
      )}
      value={value}
      style={{ paddingRight: '40px' }}
    >
      {options.map((option: any, index: any) => (
        <option key={index} value={option.value}>
          {option.text}
        </option>
      ))}
    </select>
  );
}
