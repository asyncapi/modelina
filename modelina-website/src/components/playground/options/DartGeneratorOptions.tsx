import React from 'react';
import { PlaygroundDartConfigContext } from '@/components/contexts/PlaygroundConfigContext';

interface DartGeneratorOptionsProps {
  setNewConfig?: (queryKey: string, queryValue: string) => void;
}

interface DartGeneratorState {}

export const defaultState: DartGeneratorState = {};

class DartGeneratorOptions extends React.Component<
  DartGeneratorOptionsProps,
  DartGeneratorState
> {
  static contextType = PlaygroundDartConfigContext;
  declare context: React.ContextType<typeof PlaygroundDartConfigContext>;
  constructor(props: any) {
    super(props);
    this.state = defaultState;
  }

  render() {
    return (
      <ul className="flex flex-col">
        <h3 className="text-lg font-medium leading-6 text-gray-900">
          Dart Specific options
        </h3>
        <span className="mt-1 max-w-2xl text-sm text-gray-500">
          Currently no options are available
        </span>
      </ul>
    );
  }
}
export default DartGeneratorOptions;
