import React from 'react';
import Select from '../../Select';
import { PlaygroundTypeScriptConfigContext } from '@/components/contexts/PlaygroundConfigContext';
import InfoModal from '@/components/InfoModal';

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
        <li className='flex items-center'>
          <InfoModal text='Typesript class variant' >
            <p>
              It indicates which model type should be rendered for the object type. Its value can be either interface or class.
              <br/> <br/>
              The default value is class.
            </p>                
          </InfoModal>
          <label className="flex flex-grow items-center py-2 justify-between cursor-pointer">
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
        <li className='flex items-center'>
          <InfoModal text='Typesript enum type: ' >
            <p>
              It indicates which type should be rendered for some enum type. Its value can be either union or enum.
              <br/> <br/>
              The default value is union.
            </p>
          </InfoModal>
          <label className="flex flex-grow items-center py-2 justify-between cursor-pointer">
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
        <li className='flex items-center'>
          <InfoModal text='Typesript module system: ' >
            <p>
              It indicates which module system should be used for the generated code. Its value can be either ESM or CJS.
              <br/> <br/>
              The default value is ESM.
              <br/> <br/>
              <b>ESM</b> - ECMAScript Modules. This uses the import/export syntax.
              <br/> <br/>
              <b>CJS</b> - CommonJS Modules. This uses the require/module.exports syntax.
            </p>
          </InfoModal>
          <label className="flex flex-grow items-center py-2 justify-between cursor-pointer">
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
        <li className='flex items-center'>
          <InfoModal text='Typesript include descriptions: ' >
            <p>
              It indicates whether the descriptions should be included in the generated code.
              <br/> <br/>
              The default value is false.
            </p>
          </InfoModal>
          <label className="flex flex-grow items-center py-2 justify-between cursor-pointer">
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
          <li className='flex items-center'>
            <InfoModal text='Typesript include un/marshal functions: ' >
              <p>
                It indicates whether the un/marshal functions should be included in the generated code.
                <br/> <br/>
                The default value is false.
                <br/> <br/>
                <b>Unmarshal</b> - This function takes a JSON object and returns an instance of the class.
                <br/> <br/>
                <b>Marshal</b> - This function takes an instance of the class and returns a JSON object.
              </p>
            </InfoModal>
            <label className="flex flex-grow items-center py-2 justify-between cursor-pointer">
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
          <li className='flex items-center'>
            <InfoModal text='Typesript include JsonBinPack support: ' >
              <p>
                It indicates whether the <a href={'https://www.jsonbinpack.org/'}>JsonBinPack</a> support should be included in the generated code. 
                This allows you to convert models to a buffer, which is highly space-efficient, instead of sending pure JSON data over the wire.
                <br/> <br/>
                The default value is false.
                <br/><br/>
                <ul className='list-disc list-inside'>
                  <li className='list-disc'>This functionality is for the library jsonbinpack.</li>
                  <li>This preset can ONLY be used with AsyncAPI 2.x and JSON Schema draft 4 to 7 inputs.</li>
                  <li>
                    This functionality has two requirements:
                    <ol className='list-decimal list-inside'>
                      <li>You MUST manually install the library <a href={'https://www.jsonbinpack.org/'}>JsonBinPack</a>.</li>
                      <li>You MUST also use the Generate un/marshal functions for classes</li>
                    </ol>
                  </li>
                </ul>
              </p>
            </InfoModal>
            <label className="flex flex-grow items-center py-2 justify-between cursor-pointer">
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
          <li className='flex items-center'>
            <InfoModal text='Typesript include example functions: ' >
              <p>
                It indicates whether the generated code should include a function that returns an example instance of the model with placeholder values.
                <br/> <br/>
                The default value is false.
              </p>
            </InfoModal>
            <label className="flex flex-grow items-center py-2 justify-between cursor-pointer">
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
