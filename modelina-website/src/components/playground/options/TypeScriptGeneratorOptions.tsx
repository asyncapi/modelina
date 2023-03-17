import React from 'react';
import Select from '../../Select';
import { PlaygroundTypeScriptConfigContext } from '@/components/contexts/PlaygroundConfigContext';

interface TypeScriptGeneratorOptionsProps {
  setNewConfig?: (queryKey: string, queryValue: string) => void;
}

interface TypeScriptGeneratorState {}

export const defaultState: TypeScriptGeneratorState = {};

class TypeScriptGeneratorOptions extends React.Component<
  TypeScriptGeneratorOptionsProps,
  TypeScriptGeneratorState
> {
  static contextType = PlaygroundTypeScriptConfigContext;
  declare context: React.ContextType<typeof PlaygroundTypeScriptConfigContext>;
  constructor(props: any) {
    super(props);
    this.state = defaultState;
    this.onChangeMarshalling = this.onChangeMarshalling.bind(this);
    this.onChangeVariant = this.onChangeVariant.bind(this);
  }

  onChangeMarshalling(event: any) {
    if (this.props.setNewConfig) {
      this.props.setNewConfig('tsMarshalling', event.target.checked);
    }
  }

  onChangeVariant(variant: any) {
    if (this.props.setNewConfig) {
      this.props.setNewConfig('tsModelType', String(variant));
    }
  }

  render() {
    return (
      <ul className="flex flex-col">
        <h3 className="text-lg font-medium leading-6 text-gray-900">
          TypeScript Specific options
        </h3>
        <li>
          <label className="flex items-center py-2 justify-between cursor-pointer">
            <span className="mt-1 max-w-2xl text-sm text-gray-500">
              TypeScript class variant
            </span>
            <Select
              options={[
                { value: 'class', text: 'Class' },
                { value: 'interface', text: 'Interface' }
              ]}
              value={this.context?.tsModelType}
              onChange={this.onChangeVariant}
              className="shadow-outline-blue cursor-pointer"
            />
          </label>
        </li>
        {this.context?.tsModelType === 'class' ? (
          <li>
            <label className="flex items-center py-2 justify-between cursor-pointer">
              <span className="mt-1 max-w-2xl text-sm text-gray-500">
                Include un/marshal functions
              </span>
              <input
                type="checkbox"
                className="form-checkbox cursor-pointer"
                name="marshalling"
                checked={this.context.tsMarshalling}
                onChange={this.onChangeMarshalling}
              />
            </label>
          </li>
        ) : null}
      </ul>
    );
  }
}
export default TypeScriptGeneratorOptions;
