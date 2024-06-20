import React from 'react';

interface RustGeneratorOptionsProps {
  setNewConfig?: (queryKey: string, queryValue: any) => void;
}

interface RustGeneratorState {}

export const defaultState: RustGeneratorState = {};

const RustGeneratorOptions: React.FC<RustGeneratorOptionsProps> = () => {
  return (
    <ul className='flex flex-col'>
      <h3 className='w-full border-b border-gray-700 py-2 text-left'>Rust Specific options</h3>
      <span className='mt-1 max-w-2xl text-sm text-gray-500'>Currently no options are available</span>
    </ul>
  );
};

export default RustGeneratorOptions;
