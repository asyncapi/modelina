import React from 'react';
import { PlaygroundJavaConfigContext } from '@/components/contexts/PlaygroundConfigContext';

interface JavaGeneratorOptionsProps {
  setNewConfig?: (queryKey: string, queryValue: string) => void;
}

interface JavaGeneratorState {}

export const defaultState: JavaGeneratorState = {};

class JavaGeneratorOptions extends React.Component<
  JavaGeneratorOptionsProps,
  JavaGeneratorState
> {
  static contextType = PlaygroundJavaConfigContext;
  declare context: React.ContextType<typeof PlaygroundJavaConfigContext>;
  constructor(props: any) {
    super(props);
    this.state = defaultState;
  }

  render() {
    return (
      <ul className="flex flex-col">
        <h3 className="text-lg font-medium leading-6 text-gray-900">
          Java Specific options
        </h3>
        <span className="mt-1 max-w-2xl text-sm text-gray-500">
          Currently no options are available
        </span>
      </ul>
    );
  }
}
export default JavaGeneratorOptions;
