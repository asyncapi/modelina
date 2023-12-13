import React, { useContext, useState } from 'react';
import { PlaygroundJavaScriptConfigContext } from '@/components/contexts/PlaygroundConfigContext';

interface JavaScriptGeneratorOptionsProps {
  setNewConfig?: (queryKey: string, queryValue: any) => void;
}

interface JavaScriptGeneratorState {}

export const defaultState: JavaScriptGeneratorState = {};

const JavaScriptGeneratorOptions: React.FC<JavaScriptGeneratorOptionsProps> = ({
  setNewConfig,
}) => {
  const context = useContext(PlaygroundJavaScriptConfigContext);
  const [state, setState] = useState<JavaScriptGeneratorState>(defaultState);

  return (
    <ul className="flex flex-col">
      <h3 className="py-2 w-full text-left border-b-[1px] border-gray-700">
        JavaScript Specific options
      </h3>
      <span className="mt-1 max-w-2xl text-sm text-gray-500">
        Currently no options are available
      </span>
    </ul>
  );
};

export default JavaScriptGeneratorOptions;
