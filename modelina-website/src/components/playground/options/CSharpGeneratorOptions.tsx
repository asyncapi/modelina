import React from 'react';
import { PlaygroundCSharpConfigContext } from '@/components/contexts/PlaygroundConfigContext';

interface CSharpGeneratorOptionsProps {
  setNewConfig?: (queryKey: string, queryValue: string) => void;
}

interface CSharpGeneratorState {}

export const defaultState: CSharpGeneratorState = {};

class CSharpGeneratorOptions extends React.Component<
  CSharpGeneratorOptionsProps,
  CSharpGeneratorState
> {
  static contextType = PlaygroundCSharpConfigContext;
  declare context: React.ContextType<typeof PlaygroundCSharpConfigContext>;
  constructor(props: any) {
    super(props);
    this.state = defaultState;
  }

  render() {
    return (
      <ul className="flex flex-col">
        <h3 className="text-lg font-medium leading-6 text-gray-900">
          CSharp Specific options
        </h3>
        <span className="mt-1 max-w-2xl text-sm text-gray-500">
          Currently no options are available
        </span>
      </ul>
    );
  }
}
export default CSharpGeneratorOptions;
