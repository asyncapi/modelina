import React from 'react';
import Select from '../../Select';
import { PlaygroundTypeScriptConfigContext } from '@/components/contexts/PlaygroundConfigContext';

interface TypeScriptGeneratorOptionsProps {
  setNewConfig?: (queryKey: string, queryValue: any, updateCode?: boolean) => void;
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
    this.onChangeEnumType = this.onChangeEnumType.bind(this);
    this.onChangeModuleSystem = this.onChangeModuleSystem.bind(this);
    this.onChangeIncludeExampleFunction = this.onChangeIncludeExampleFunction.bind(this);
    this.onChangeIncludeJsonBinPack = this.onChangeIncludeJsonBinPack.bind(this);
    this.onChangeIncludeDescriptions =
      this.onChangeIncludeDescriptions.bind(this);
  }

  onChangeMarshalling(event: any) {
    if (this.props.setNewConfig) {
      this.props.setNewConfig('tsMarshalling', event.target.checked);
    }
  }

  onChangeIncludeDescriptions(event: any) {
    if (this.props.setNewConfig) {
      this.props.setNewConfig('tsIncludeDescriptions', event.target.checked);
    }
  }

  onChangeVariant(variant: any) {
    if (this.props.setNewConfig) {
      this.props.setNewConfig('tsModelType', String(variant));
    }
  }

  onChangeModuleSystem(moduleSystem: any) {
    if (this.props.setNewConfig) {
      this.props.setNewConfig('tsModuleSystem', String(moduleSystem));
    }
  }

  onChangeEnumType(enumType: any) {
    if (this.props.setNewConfig) {
      this.props.setNewConfig('tsEnumType', String(enumType));
    }
  }

  onChangeIncludeJsonBinPack(event: any) {
    if (this.props.setNewConfig) {
      const shouldIncludeMarshalling = this.context?.tsMarshalling === false && event.target.checked === true;
      this.props.setNewConfig('tsIncludeJsonBinPack', event.target.checked, shouldIncludeMarshalling ? false : true);

      if(shouldIncludeMarshalling) {
        this.props.setNewConfig('tsMarshalling', event.target.checked);
      }
    }
  }

  onChangeIncludeExampleFunction(event: any) {
    if (this.props.setNewConfig) {
      this.props.setNewConfig('tsIncludeExampleFunction', event.target.checked);
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
        <li>
          <label className="flex items-center py-2 justify-between cursor-pointer">
            <span className="mt-1 max-w-2xl text-sm text-gray-500">
              TypeScript enum type
            </span>
            <Select
              options={[
                { value: 'union', text: 'Union' },
                { value: 'enum', text: 'Enum' }
              ]}
              value={this.context?.tsEnumType}
              onChange={this.onChangeEnumType}
              className="shadow-outline-blue cursor-pointer"
            />
          </label>
        </li>
        <li>
          <label className="flex items-center py-2 justify-between cursor-pointer">
            <span className="mt-1 max-w-2xl text-sm text-gray-500">
              TypeScript module system
            </span>
            <Select
              options={[
                { value: 'ESM', text: 'ESM' },
                { value: 'CJS', text: 'CJS' }
              ]}
              value={this.context?.tsModuleSystem}
              onChange={this.onChangeModuleSystem}
              className="shadow-outline-blue cursor-pointer"
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
              checked={this.context?.tsIncludeDescriptions}
              onChange={this.onChangeIncludeDescriptions}
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
                checked={this.context?.tsMarshalling}
                onChange={this.onChangeMarshalling}
              />
            </label>
          </li>
        ) : null}
        {this.context?.tsModelType === 'class' ? (
          <li>
            <label className="flex items-center py-2 justify-between cursor-pointer">
              <span className="mt-1 max-w-2xl text-sm text-gray-500">
                Include JsonBinPack support
              </span>
              <input
                type="checkbox"
                className="form-checkbox cursor-pointer"
                name="jsonbinpack"
                checked={this.context?.tsIncludeJsonBinPack}
                onChange={this.onChangeIncludeJsonBinPack}
              />
            </label>
          </li>
        ) : null}
        {this.context?.tsModelType === 'class' ? (
          <li>
            <label className="flex items-center py-2 justify-between cursor-pointer">
              <span className="mt-1 max-w-2xl text-sm text-gray-500">
                Include example functions
              </span>
              <input
                type="checkbox"
                className="form-checkbox cursor-pointer"
                name="exampleFunction"
                checked={this.context?.tsIncludeExampleFunction}
                onChange={this.onChangeIncludeExampleFunction}
              />
            </label>
          </li>
        ) : null}
      </ul>
    );
  }
}
export default TypeScriptGeneratorOptions;
