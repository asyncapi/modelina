import React, { useContext, useState } from 'react';
import Select from '../../Select';
import { PlaygroundTypeScriptConfigContext } from '@/components/contexts/PlaygroundConfigContext';
import InfoModal from '@/components/InfoModal';

interface TypeScriptGeneratorOptionsProps {
  setNewConfig?: (queryKey: string, queryValue: any, updateCode?: boolean) => void;
}

interface TypeScriptGeneratorState { }

export const defaultState: TypeScriptGeneratorState = {};

const TypeScriptGeneratorOptions: React.FC<TypeScriptGeneratorOptionsProps> = ({ setNewConfig }) => {
  const context = useContext(PlaygroundTypeScriptConfigContext);
  const [state, setState] = useState<TypeScriptGeneratorState>(defaultState);

  const onChangeMarshalling = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewConfig && setNewConfig('tsMarshalling', event.target.checked);
  };

  const onChangeIncludeDescriptions = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewConfig && setNewConfig('tsIncludeDescriptions', event.target.checked);
  };

  const onChangeVariant = (variant: string) => {
    setNewConfig && setNewConfig('tsModelType', variant);
  };

  const onChangeModuleSystem = (moduleSystem: string) => {
    setNewConfig && setNewConfig('tsModuleSystem', moduleSystem);
  };

  const onChangeEnumType = (enumType: string) => {
    setNewConfig && setNewConfig('tsEnumType', enumType);
  };

  const onChangeIncludeJsonBinPack = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (setNewConfig) {
      const shouldIncludeMarshalling = context?.tsMarshalling === false && event.target.checked === true;
      setNewConfig('tsIncludeJsonBinPack', event.target.checked, !shouldIncludeMarshalling);

      if (shouldIncludeMarshalling) {
        setNewConfig('tsMarshalling', event.target.checked);
      }
    }
  };

  const onChangeIncludeExampleFunction = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewConfig && setNewConfig('tsIncludeExampleFunction', event.target.checked);
  };

  return (
    <ul className="flex flex-col">
      <h3 className="py-2 w-full text-left border-b-[1px] border-gray-700">
        TypeScript Specific options
      </h3>
      <li className="flex gap-1 items-center">
        <InfoModal text='TypeScript class variant' >
          <p>
            It indicates which model type should be rendered for the object type. Its value can be either interface or class.
            <br /> <br />
            The default value is class.
          </p>
        </InfoModal>
        <label className="flex flex-grow gap-1 items-center py-2 justify-between cursor-pointer">
          <span className="mt-1 max-w-2xl text-sm text-gray-500">
            TypeScript class variant
          </span>
          <Select
            options={[
              { value: 'class', text: 'Class' },
              { value: 'interface', text: 'Interface' }
            ]}
            value={context?.tsModelType}
            onChange={onChangeVariant}
            className="shadow-outline-blue cursor-pointer"
          />
        </label>
      </li>
      <li className="flex gap-1 items-center">
        <InfoModal text='TypeScript enum type: ' >
          <p>
            It indicates which type should be rendered for some enum type. Its value can be either union or enum.
            <br /> <br />
            The default value is union.
          </p>
        </InfoModal>
        <label className="flex flex-grow gap-1 items-center py-2 justify-between cursor-pointer">
          <span className="mt-1 max-w-2xl text-sm text-gray-500">
            TypeScript enum type
          </span>
          <Select
            options={[
              { value: 'union', text: 'Union' },
              { value: 'enum', text: 'Enum' }
            ]}
            value={context?.tsEnumType}
            onChange={onChangeEnumType}
            className="shadow-outline-blue cursor-pointer"
          />
        </label>
      </li>
      <li className="flex gap-1 items-center">
        <InfoModal text='TypeScript module system: ' >
          <p>
            It indicates which module system should be used for the generated code. Its value can be either ESM or CJS.
            <br /> <br />
            The default value is ESM.
            <br /> <br />
            <b>ESM</b> - ECMAScript Modules. This uses the import/export syntax.
            <br /> <br />
            <b>CJS</b> - CommonJS Modules. This uses the require/module.exports syntax.
          </p>
        </InfoModal>
        <label className="flex flex-grow gap-1 items-center py-2 justify-between cursor-pointer">
          <span className="mt-1 max-w-2xl text-sm text-gray-500">
            TypeScript module system
          </span>
          <Select
            options={[
              { value: 'ESM', text: 'ESM' },
              { value: 'CJS', text: 'CJS' }
            ]}
            value={context?.tsModuleSystem}
            onChange={onChangeModuleSystem}
            className="shadow-outline-blue cursor-pointer"
          />
        </label>
      </li>
      <li className="flex gap-1 items-center">
        <InfoModal text='TypeScript include descriptions: ' >
          <p>
            It indicates whether the descriptions should be included in the generated code.
            <br /> <br />
            The default value is false.
          </p>
        </InfoModal>
        <label className="flex flex-grow gap-1 items-center py-2 justify-between cursor-pointer">
          <span className="mt-1 max-w-2xl text-sm text-gray-500">
            Include Descriptions
          </span>
          <input
            type="checkbox"
            className="form-checkbox cursor-pointer"
            name="includeDescriptions"
            checked={context?.tsIncludeDescriptions}
            onChange={onChangeIncludeDescriptions}
          />
        </label>
      </li>
      {context?.tsModelType === 'class' ? (
        <li className="flex gap-1 items-center">
          <InfoModal text='TypeScript include un/marshal functions: ' >
            <p>
              It indicates whether the un/marshal functions should be included in the generated code.
              <br /> <br />
              The default value is false.
              <br /> <br />
              <b>Unmarshal</b> - This function takes a JSON object and returns an instance of the class.
              <br /> <br />
              <b>Marshal</b> - This function takes an instance of the class and returns a JSON object.
            </p>
          </InfoModal>
          <label className="flex flex-grow gap-1 items-center py-2 justify-between cursor-pointer">
            <span className="mt-1 max-w-2xl text-sm text-gray-500">
              Include un/marshal functions
            </span>
            <input
              type="checkbox"
              className="form-checkbox cursor-pointer"
              name="marshalling"
              checked={context?.tsMarshalling}
              onChange={onChangeMarshalling}
            />
          </label>
        </li>
      ) : null}
      {context?.tsModelType === 'class' ? (
        <li className="flex gap-1 items-center">
          <InfoModal text='TypeScript include JsonBinPack support: ' >
            <p>
              It indicates whether the <a href={'https://www.jsonbinpack.org/'}>JsonBinPack</a> support should be included in the generated code.
              This allows you to convert models to a buffer, which is highly space-efficient, instead of sending pure JSON data over the wire.
              <br /> <br />
              The default value is false.
              <br /><br />
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
          <label className="flex flex-grow gap-1 items-center py-2 justify-between cursor-pointer">
            <span className="mt-1 max-w-2xl text-sm text-gray-500">
              Include JsonBinPack support
            </span>
            <input
              type="checkbox"
              className="form-checkbox cursor-pointer"
              name="jsonbinpack"
              checked={context?.tsIncludeJsonBinPack}
              onChange={onChangeIncludeJsonBinPack}
            />
          </label>
        </li>
      ) : null}
      {context?.tsModelType === 'class' ? (
        <li className="flex gap-1 items-center">
          <InfoModal text='TypeScript include example functions: ' >
            <p>
              It indicates whether the generated code should include a function that returns an example instance of the model with placeholder values.
              <br /> <br />
              The default value is false.
            </p>
          </InfoModal>
          <label className="flex flex-grow gap-1 items-center py-2 justify-between cursor-pointer">
            <span className="mt-1 max-w-2xl text-sm text-gray-500">
              Include example functions
            </span>
            <input
              type="checkbox"
              className="form-checkbox cursor-pointer"
              name="exampleFunction"
              checked={context?.tsIncludeExampleFunction}
              onChange={onChangeIncludeExampleFunction}
            />
          </label>
        </li>
      ) : null}
    </ul>
  );
};

export default TypeScriptGeneratorOptions;