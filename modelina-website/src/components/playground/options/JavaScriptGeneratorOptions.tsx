import React from 'react';
import { PlaygroundJavaScriptConfigContext } from '@/components/contexts/PlaygroundConfigContext';

interface JavaScriptGeneratorOptionsProps {
  setNewConfig?: (queryKey: string, queryValue: string) => void;
}

interface JavaScriptGeneratorState {}

export const defaultState: JavaScriptGeneratorState = {};

class JavaScriptGeneratorOptions extends React.Component<
  JavaScriptGeneratorOptionsProps,
  JavaScriptGeneratorState
> {
  static contextType = PlaygroundJavaScriptConfigContext;
  declare context: React.ContextType<typeof PlaygroundJavaScriptConfigContext>;
  constructor(props: any) {
    super(props);
    this.state = defaultState;
  }

  render() {
    return (
      <ul className="flex flex-col">
        <h3 className="text-lg font-medium leading-6 text-gray-900">
          JavaScript Specific options
        </h3>
        <span className="mt-1 max-w-2xl text-sm text-gray-500">
          Currently no options are available
        </span>
      </ul>
    );
  }
}
export default JavaScriptGeneratorOptions;
