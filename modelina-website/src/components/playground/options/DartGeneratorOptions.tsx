import React, { useContext, useState } from 'react';
import { PlaygroundDartConfigContext } from '@/components/contexts/PlaygroundConfigContext';

interface DartGeneratorOptionsProps {
  setNewConfig?: (queryKey: string, queryValue: string) => void;
}

interface DartGeneratorState { }

export const defaultState: DartGeneratorState = {};

const DartGeneratorOptions: React.FC<DartGeneratorOptionsProps> = ({ setNewConfig }) => {
  const context = useContext(PlaygroundDartConfigContext);
  const [ state, setState ] = useState<DartGeneratorState>(defaultState);

  return (
    <ul className="flex flex-col">
      <h3 className="py-2 w-full text-left border-b-[1px] border-gray-700">
        Dart Specific options
      </h3>
      <span className="mt-1 max-w-2xl text-sm text-gray-500">
        Currently no options are available
      </span>
    </ul>
  );
}

export default DartGeneratorOptions;