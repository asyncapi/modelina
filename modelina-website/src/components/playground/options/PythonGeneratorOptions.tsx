import React from 'react';
import { PlaygroundPythonConfigContext } from '@/components/contexts/PlaygroundConfigContext';

interface PythonGeneratorOptionsProps {
  setNewConfig?: (queryKey: string, queryValue: string) => void;
}

interface PythonGeneratorState {}

export const defaultState: PythonGeneratorState = {};

class PythonGeneratorOptions extends React.Component<
  PythonGeneratorOptionsProps,
  PythonGeneratorState
> {
  static contextType = PlaygroundPythonConfigContext;
  declare context: React.ContextType<typeof PlaygroundPythonConfigContext>;
  constructor(props: any) {
    super(props);
    this.state = defaultState;
  }

  render() {
    return (
      <ul className="flex flex-col">
        <h3 className="text-lg font-medium leading-6 text-gray-900">
          Python Specific options
        </h3>
        <span className="mt-1 max-w-2xl text-sm text-gray-500">
          Currently no options are available
        </span>
      </ul>
    );
  }
}
export default PythonGeneratorOptions;
