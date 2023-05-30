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
    this.onChangeAutoImplementProperties = this.onChangeAutoImplementProperties.bind(this);
    this.onChangeOverwriteHashCodeSupport = this.onChangeOverwriteHashCodeSupport.bind(this);
    this.onChangeIncludeJson = this.onChangeIncludeJson.bind(this);
    this.onChangeOverwriteEqualSupport = this.onChangeOverwriteEqualSupport.bind(this);
  }

  onChangeArrayType(arrayType: any) {
    if (this.props.setNewConfig) {
      this.props.setNewConfig('csharpArrayType', String(arrayType));
    }
  }

  onChangeAutoImplementProperties(event: any) {
    if (this.props.setNewConfig) {
      this.props.setNewConfig('csharpAutoImplemented', event.target.checked);
    }
  }

  onChangeOverwriteHashCodeSupport(event: any) {
    if (this.props.setNewConfig) {
      this.props.setNewConfig('csharpOverwriteHashcode', event.target.checked);
    }
  }

  onChangeIncludeJson(event: any) {
    if (this.props.setNewConfig) {
      this.props.setNewConfig('csharpIncludeJson', event.target.checked);
    }
  }

  onChangeOverwriteEqualSupport(event: any) {
    if (this.props.setNewConfig) {
      this.props.setNewConfig('csharpOverwriteEqual', event.target.checked);
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
        <li>
          <label className="flex items-center py-2 justify-between cursor-pointer">
            <span className="mt-1 max-w-2xl text-sm text-gray-500">
              Include auto-implemented properties
            </span>
            <input
              type="checkbox"
              className="form-checkbox cursor-pointer"
              name="csharpAutoImplemented"
              checked={this.context?.csharpAutoImplemented}
              onChange={this.onChangeAutoImplementProperties}
            />
          </label>
        </li>
        <li>
          <label className="flex items-center py-2 justify-between cursor-pointer">
            <span className="mt-1 max-w-2xl text-sm text-gray-500">
              Include OverWrite HashCode Support
            </span>
            <input
              type="checkbox"
              className="form-checkbox cursor-pointer"
              name="csharpOverwriteHashcode"
              checked={this.context?.csharpOverwriteHashcode}
              onChange={this.onChangeOverwriteHashCodeSupport}
            />
          </label>
        </li>
        <li>
          <label className="flex items-center py-2 justify-between cursor-pointer">
            <span className="mt-1 max-w-2xl text-sm text-gray-500">
              Include JSON serialization
            </span>
            <input
              type="checkbox"
              className="form-checkbox cursor-pointer"
              name="csharpIncludeJson"
              checked={this.context?.csharpIncludeJson}
              onChange={this.onChangeIncludeJson}
            />
          </label>
        </li>
        <li>
          <label className="flex items-center py-2 justify-between cursor-pointer">
            <span className="mt-1 max-w-2xl text-sm text-gray-500">
              Include OverWrite Equal Support
            </span>
            <input
              type="checkbox"
              className="form-checkbox cursor-pointer"
              name="csharpOverwriteEqual"
              checked={this.context?.csharpOverwriteEqual}
              onChange={this.onChangeOverwriteEqualSupport}
            />
          </label>
        </li>
      </ul>
    );
  }
}
export default CSharpGeneratorOptions;
