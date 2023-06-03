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
    this.onChangeNamespace = this.onChangeNamespace.bind(this);
  }

  onChangeNamespace(event: any) {
    if (this.props.setNewConfig) {
      this.props.setNewConfig('cplusplusNamespace', event.target.value);
    }
  }

  render() {
    return (
      <ul className="flex flex-col">
        <h3 className="text-lg font-medium leading-6 text-gray-900">
          C++ Specific options
        </h3>
        <li>
          <label className="flex items-center py-2 justify-between cursor-pointer">
            <span className="mt-1 max-w-2xl text-sm text-gray-500">
              Namespace
            </span>
            <input
              type="text"
              className="form-input rounded-md border-gray-300 cursor-pointer font-regular text-md text-gray-700 hover:bg-gray-50 focus-within:text-gray-900"
              name="cplusplusNamespace"
              value={this.context?.cplusplusNamespace}
              onChange={this.onChangeNamespace}
            />
          </label>
        </li>
      </ul>
    );
  }
}
export default CplusplusGeneratorOptions;
