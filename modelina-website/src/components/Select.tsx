import {twMerge} from 'tailwind-merge';

export default function Select({
  className = '',
  onChange = () => {},
  options = [],
  selected,
}: any) {
  return (
    <select
      onChange={(ev: any) => onChange(ev.target.value)}
      className={twMerge(`form-select h-full py-0 pl-2 pr-8 inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500 ${className}`)}
      value={selected}
    >
      {options.map((option: any, index: any) => (
        <option key={index} selected={option.value === selected} value={option.value}>
          {option.text}
        </option>
      ))}
    </select>
  )
}