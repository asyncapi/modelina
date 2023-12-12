import React, { useContext, useState } from 'react';
import { PlaygroundPythonConfigContext } from '@/components/contexts/PlaygroundConfigContext';

interface PythonGeneratorOptionsProps {
  setNewConfig?: (queryKey: string, queryValue: string) => void;
}

interface PythonGeneratorState {}

export const defaultState: PythonGeneratorState = {};

const PythonGeneratorOptions: React.FC<PythonGeneratorOptionsProps> = () => {
  const context = useContext(PlaygroundPythonConfigContext);
  const [state, setState] = useState<PythonGeneratorState>(defaultState);

  return (
    <ul className="flex flex-col">
      <h3 className="py-2 w-full text-left border-b-[1px] border-gray-700">
        Python Specific options
      </h3>
      <span className="mt-1 max-w-2xl text-sm text-gray-500">
        Currently no options are available
      </span>
    </ul>
  );
};

export default PythonGeneratorOptions;