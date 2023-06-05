import React from 'react';
import { PlaygroundCSharpConfigContext } from '@/components/contexts/PlaygroundConfigContext';
import Select from '@/components/Select';
import { debounce } from 'lodash';

interface CSharpGeneratorOptionsProps {
  setNewConfig?: (queryKey: string, queryValue: string) => void;
}

interface CSharpGeneratorState {
  namespace?: string;
}

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
    this.onChangeIncludeNewtonsoft = this.onChangeIncludeNewtonsoft.bind(this);
    this.onChangeNamespace = this.onChangeNamespace.bind(this);
    this.debouncedSetNewConfig = this.debouncedSetNewConfig.bind(this);
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
  
  onChangeIncludeNewtonsoft(event: any) {
    if (this.props.setNewConfig) {
      this.props.setNewConfig('csharpIncludeNewtonsoft', event.target.checked);
    }
  }

  componentDidMount() {
    this.setState({ ...this.state, namespace: this.context?.csharpNamespace });
  }

  onChangeNamespace(event: any) {
    this.setState({ ...this.state, namespace: event.target.value })
    if (this.props.setNewConfig) {
      this.debouncedSetNewConfig('csharpNamespace', event.target.value);
    }
  }

  debouncedSetNewConfig = debounce(this.props.setNewConfig || (() => {}), 500);

  render() {
    return (
      <ul className="flex flex-col">
        <h3 className="text-lg font-medium leading-6 text-gray-900">
          CSharp Specific options
        </h3>
        <li>
          <label className="flex items-center py-2 justify-between cursor-pointer">
            <span className="mt-1 max-w-2xl text-sm text-gray-500">
              Namespace
            </span>
            <input
              type="text"
              className="form-input rounded-md border-gray-300 cursor-pointer font-regular text-md text-gray-700 hover:bg-gray-50 focus-within:text-gray-900"
              name="csharpNamespace"
              value={this.state.namespace}
              onChange={this.onChangeNamespace}
            />
          </label>
        </li>
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
              Include Overwrite HashCode Support
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
              Include Overwrite Equal Support
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
              Include Newtonsoft serialization
            </span>
            <input
              type="checkbox"
              className="form-checkbox cursor-pointer"
              name="csharpIncludeNewtonsoft"
              checked={this.context?.csharpIncludeNewtonsoft}
              onChange={this.onChangeIncludeNewtonsoft}
            />
          </label>
        </li>
      </ul>
    );
  }
}
export default CSharpGeneratorOptions;
