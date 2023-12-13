import React, { useContext, useState } from 'react';
import { PlaygroundRustConfigContext } from '@/components/contexts/PlaygroundConfigContext';

interface RustGeneratorOptionsProps {
  setNewConfig?: (queryKey: string, queryValue: any) => void;
}

interface RustGeneratorState {}

export const defaultState: RustGeneratorState = {};

const RustGeneratorOptions: React.FC<RustGeneratorOptionsProps> = () => {
  const context = useContext(PlaygroundRustConfigContext);
  const [state, setState] = useState<RustGeneratorState>(defaultState);

  return (
    <ul className="flex flex-col">
      <h3 className="py-2 w-full text-left border-b-[1px] border-gray-700">
        Rust Specific options
      </h3>
      <span className="mt-1 max-w-2xl text-sm text-gray-500">
        Currently no options are available
      </span>
    </ul>
  );
};

export default RustGeneratorOptions;
