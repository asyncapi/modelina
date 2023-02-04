import React from 'react';
import { PlaygroundRustConfigContext } from '@/components/contexts/PlaygroundConfigContext';

interface RustGeneratorOptionsProps {
  setNewConfig?: (queryKey: string, queryValue: string) => void;
}

interface RustGeneratorState {}

export const defaultState: RustGeneratorState = {};

class RustGeneratorOptions extends React.Component<
  RustGeneratorOptionsProps,
  RustGeneratorState
> {
  static contextType = PlaygroundRustConfigContext;
  declare context: React.ContextType<typeof PlaygroundRustConfigContext>;
  constructor(props: any) {
    super(props);
    this.state = defaultState;
  }

  render() {
    return (
      <ul className="flex flex-col">
        <h3 className="text-lg font-medium leading-6 text-gray-900">
          Rust Specific options
        </h3>
        <span className="mt-1 max-w-2xl text-sm text-gray-500">
          Currently no options are available
        </span>
      </ul>
    );
  }
}
export default RustGeneratorOptions;
