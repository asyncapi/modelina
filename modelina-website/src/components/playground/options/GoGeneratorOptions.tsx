import React from 'react';
import { PlaygroundGoConfigContext } from '@/components/contexts/PlaygroundConfigContext';

interface GoGeneratorOptionsProps {
  setNewConfig?: (queryKey: string, queryValue: string) => void;
}

interface GoGeneratorState {}

export const defaultState: GoGeneratorState = {};

class GoGeneratorOptions extends React.Component<
  GoGeneratorOptionsProps,
  GoGeneratorState
> {
  static contextType = PlaygroundGoConfigContext;
  declare context: React.ContextType<typeof PlaygroundGoConfigContext>;
  constructor(props: any) {
    super(props);
    this.state = defaultState;
  }

  render() {
    return (
      <ul className="flex flex-col">
        <h3 className="text-lg font-medium leading-6 text-gray-900">
          Go Specific options
        </h3>
        <span className="mt-1 max-w-2xl text-sm text-gray-500">
          Currently no options are available
        </span>
      </ul>
    );
  }
}
export default GoGeneratorOptions;
