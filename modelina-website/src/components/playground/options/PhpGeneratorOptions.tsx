import React from 'react';
import { PlaygroundPhpConfigContext } from '@/components/contexts/PlaygroundConfigContext';

interface PhpGeneratorOptionsProps {
  setNewConfig?: (queryKey: string, queryValue: string) => void;
}

interface PhpGeneratorState {}

export const defaultState: PhpGeneratorState = {};

class PhpGeneratorOptions extends React.Component<
  PhpGeneratorOptionsProps,
  PhpGeneratorState
> {
  static contextType = PlaygroundPhpConfigContext;
  declare context: React.ContextType<typeof PlaygroundPhpConfigContext>;
  constructor(props: any) {
    super(props);
    this.state = defaultState;
    this.onChangeIncludeDescriptions =
      this.onChangeIncludeDescriptions.bind(this);
    this.onChangeNamespace = this.onChangeNamespace.bind(this);
  }

  onChangeIncludeDescriptions(event: any) {
    if (this.props.setNewConfig) {
      this.props.setNewConfig('phpIncludeDescriptions', event.target.checked);
    }
  }

  onChangeNamespace(event: any) {
    if (this.props.setNewConfig) {
      this.props.setNewConfig('phpNamespace', event.target.value);
    }
  }

  render() {
    return (
      <ul className="flex flex-col">
        <h3 className="text-lg font-medium leading-6 text-gray-900">
          PHP Specific options
        </h3>
        <li>
          <label className="flex items-center py-2 justify-between cursor-pointer">
            <span className="mt-1 max-w-2xl text-sm text-gray-500">
              Namespace
            </span>
            <input
              type="text"
              className="form-input rounded-md border-gray-300 cursor-pointer font-regular text-md text-gray-700 hover:bg-gray-50 focus-within:text-gray-900"
              name="phpNamespace"
              value={this.context?.phpNamespace}
              onChange={this.onChangeNamespace}
            />
          </label>
        </li>
        <li>
          <label className="flex items-center py-2 justify-between cursor-pointer">
            <span className="mt-1 max-w-2xl text-sm text-gray-500">
              Include Descriptions
            </span>
            <input
              type="checkbox"
              className="form-checkbox cursor-pointer"
              name="includeDescriptions"
              checked={this.context?.phpIncludeDescriptions}
              onChange={this.onChangeIncludeDescriptions}
            />
          </label>
        </li>
      </ul>
    );
  }
}
export default PhpGeneratorOptions;
