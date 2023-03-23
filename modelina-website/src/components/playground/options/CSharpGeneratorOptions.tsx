import React from 'react';
import { PlaygroundCSharpConfigContext } from '@/components/contexts/PlaygroundConfigContext';
import Select from '@/components/Select';

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
    this.onChangeArrayType = this.onChangeArrayType.bind(this);
  }

  onChangeArrayType(arrayType: any) {
    if (this.props.setNewConfig) {
      this.props.setNewConfig('csharpArrayType', String(arrayType));
    }
  }

  render() {
    return (
      <ul className="flex flex-col">
        <h3 className="text-lg font-medium leading-6 text-gray-900">
          CSharp Specific options
        </h3>
        <li>
          <label className="flex items-center py-2 justify-between cursor-pointer">
            <span className="mt-1 max-w-2xl text-sm text-gray-500">
              C# array type
            </span>
            <Select
              options={[
                { value: 'List', text: 'List' },
                { value: 'Array', text: 'Array' }
              ]}
              value={this.context?.csharpArrayType}
              onChange={this.onChangeArrayType}
              className="shadow-outline-blue cursor-pointer"
            />
          </label>
        </li>
      </ul>
    );
  }
}
export default CSharpGeneratorOptions;
