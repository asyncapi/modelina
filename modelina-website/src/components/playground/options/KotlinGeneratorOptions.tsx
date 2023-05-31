import React from 'react';
import { PlaygroundKotlinConfigContext } from '@/components/contexts/PlaygroundConfigContext';

interface KotlinGeneratorOptionsProps {
  setNewConfig?: (queryKey: string, queryValue: string) => void;
}

interface KotlinGeneratorState {}

export const defaultState: KotlinGeneratorState = {};

class KotlinGeneratorOptions extends React.Component<
  KotlinGeneratorOptionsProps,
  KotlinGeneratorState
> {
  static contextType = PlaygroundKotlinConfigContext;
  declare context: React.ContextType<typeof PlaygroundKotlinConfigContext>;
  constructor(props: any) {
    super(props);
    this.state = defaultState;
  }

  render() {
    return (
      <ul className="flex flex-col">
        <h3 className="text-lg font-medium leading-6 text-gray-900">
          Kotlin Specific options
        </h3>
        <span className="mt-1 max-w-2xl text-sm text-gray-500">
          Currently no options are available
        </span>
      </ul>
    );
  }
}
export default KotlinGeneratorOptions;
