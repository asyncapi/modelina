import React from 'react';

interface JavaScriptGeneratorOptionsProps {
  setNewConfig?: (queryKey: string, queryValue: any) => void;
}

interface JavaScriptGeneratorState {}

export const defaultState: JavaScriptGeneratorState = {};

const JavaScriptGeneratorOptions: React.FC<JavaScriptGeneratorOptionsProps> = () => {
  return (
    <ul className='flex flex-col'>
      <h3 className='w-full border-b border-gray-700 py-2 text-left'>JavaScript Specific options</h3>
      <span className='mt-1 max-w-2xl text-sm text-gray-500'>Currently no options are available</span>
    </ul>
  );
};

export default JavaScriptGeneratorOptions;
