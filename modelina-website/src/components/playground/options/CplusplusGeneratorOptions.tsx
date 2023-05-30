import React from 'react';
import { PlaygroundCplusplusConfigContext } from '@/components/contexts/PlaygroundConfigContext';

interface CplusplusGeneratorOptionsProps {
  setNewConfig?: (queryKey: string, queryValue: string) => void;
}

interface CplusplusGeneratorState {}

export const defaultState: CplusplusGeneratorState = {};

class CplusplusGeneratorOptions extends React.Component<
  CplusplusGeneratorOptionsProps,
  CplusplusGeneratorState
> {
  static contextType = PlaygroundCplusplusConfigContext;
  declare context: React.ContextType<typeof PlaygroundCplusplusConfigContext>;
  constructor(props: any) {
    super(props);
    this.state = defaultState;
  }

  render() {
    return (
      <ul className="flex flex-col">
        <h3 className="text-lg font-medium leading-6 text-gray-900">
          C++ Specific options
        </h3>
        <span className="mt-1 max-w-2xl text-sm text-gray-500">
          Currently no options are available
        </span>
      </ul>
    );
  }
}
export default CplusplusGeneratorOptions;
