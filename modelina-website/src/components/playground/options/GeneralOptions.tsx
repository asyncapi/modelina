'use client';

import React, { useContext } from 'react';

import { PlaygroundGeneralConfigContext } from '@/components/contexts/PlaygroundConfigContext';
import InfoModal from '@/components/InfoModal';
import { modelinaLanguageOptions } from '@/types';

import Select from '../../Select';

interface GeneralOptionsProps {
  setNewConfig?: (queryKey: string, queryValue: any) => void;
}

interface GeneralOptionsState {}

export const defaultState: GeneralOptionsState = {};

const GeneralOptions: React.FC<GeneralOptionsProps> = ({ setNewConfig }) => {
  const context = useContext(PlaygroundGeneralConfigContext);

  const onChangeLanguage = (language: any) => {
    setNewConfig?.('language', String(language));
  };

  const onChangeShowTypeMappingExample = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewConfig?.('showTypeMappingExample', event.target.checked);
  };

  const onChangeIndentationType = (value: any) => {
    setNewConfig?.('indentationType', String(value));
  };

  const onChangePropertyNamingFormat = (value: any) => {
    setNewConfig?.('propertyNamingFormat', String(value));
  };

  const onChangeModelNamingFormat = (value: any) => {
    setNewConfig?.('modelNamingFormat', String(value));
  };

  const onChangeEnumKeyNamingFormat = (value: any) => {
    setNewConfig?.('enumKeyNamingFormat', String(value));
  };

  return (
    <ul className='flex flex-col'>
      <h3 className='w-full border-b border-gray-700 py-2 text-left'>General options</h3>
      <li className='mt-3 flex items-center gap-1'>
        <InfoModal text='Output type :'>
          <p>
            The provided option allows you to change the type of output you want to generate. However, please be aware
            that certain outputs may not be supported within the playground environment. To obtain an updated list of
            supported outputs, kindly refer to{' '}
            <a
              href='https://github.com/asyncapi/modelina#features'
              target='_blank'
              rel='noopener noreferrer'
              className='text-blue-400 underline'
            >
              the main readme file
            </a>
            .
          </p>
        </InfoModal>
        <label className='flex grow cursor-pointer items-center justify-between gap-1'>
          <span className=' text-sm text-gray-500'>Output type</span>
          <Select
            options={modelinaLanguageOptions}
            value={context?.language}
            onChange={onChangeLanguage}
            className='shadow-outline-blue cursor-pointer'
          />
        </label>
      </li>

      <li className='flex items-center gap-1'>
        <InfoModal text='Include change type mapping example :'>
          <p>
            In code generation, a common task is to map the data types from the input model to the output. In Modelina
            you can do this through type mapping.
            <br />
            <br />
            This option includes a simple example type mapping, that maps integers to a custom type.
          </p>
        </InfoModal>
        <label className='flex grow cursor-pointer items-center justify-between gap-1 py-2'>
          <span className='mt-1 max-w-2xl text-sm text-gray-500'>Include change type mapping example</span>
          <input
            type='checkbox'
            className='form-checkbox cursor-pointer'
            name='includeDescriptions'
            checked={context?.showTypeMappingExample}
            onChange={onChangeShowTypeMappingExample}
          />
        </label>
      </li>

      <li className='flex items-center gap-1'>
        <InfoModal text='Change indentation type :'>
          <p>
            The indentation type option allows you to choose between using tabs or spaces for indentation in the
            generated code.
          </p>
        </InfoModal>
        <label className='flex grow cursor-pointer items-center justify-between gap-1 py-2'>
          <span className='mt-1 max-w-2xl text-sm text-gray-500'>Change indentation type</span>
          <Select
            options={[
              { value: 'tabs', text: 'Tabs' },
              { value: 'spaces', text: 'Spaces' }
            ]}
            value={context?.indentationType}
            onChange={onChangeIndentationType}
            className='shadow-outline-blue cursor-pointer'
          />
        </label>
      </li>

      <li className='flex items-center gap-1'>
        <InfoModal text='Change property naming format :'>
          <p>
            This option allows you to customize the naming style for properties in your code. There are no limitations
            to how you can format it, but for this simple example it provides the following options:
            <br /> <br />
            Default: This option refers to the default naming format for properties, which may vary depending on the
            programming language or coding convention being used.
            <br /> <br />
            Snake case: Property names are written in lowercase letters, and words are separated by underscores. (e.g:
            property_name)
            <br /> <br />
            Pascal case: Property names start with an uppercase letter, and subsequent words are also capitalized. (e.g:
            PropertyName)
            <br /> <br />
            Camel case: Property names start with a lowercase letter, and subsequent words are capitalized. (e.g:
            propertyName)
            <br /> <br />
            Param case: Property names use hyphens to separate words, and all letters are in lowercase. (e.g:
            property-name)
            <br /> <br />
            Constant case: Property names are written in uppercase letters, and words are separated by underscores.
            (e.g: PROPERTY_NAME)
          </p>
        </InfoModal>
        <label className='flex grow cursor-pointer items-center justify-between gap-1 py-2'>
          <span className='mt-1 max-w-2xl text-sm text-gray-500'>Change property naming format</span>
          <Select
            options={[
              { value: 'default', text: 'Default' },
              { value: 'snake_case', text: 'Snake Case' },
              { value: 'pascal_case', text: 'Pascal Case' },
              { value: 'camel_case', text: 'Camel Case' },
              { value: 'param_case', text: 'Param Case' },
              { value: 'constant_case', text: 'Constant Case' }
            ]}
            value={context?.propertyNamingFormat}
            onChange={onChangePropertyNamingFormat}
            className='shadow-outline-blue cursor-pointer'
          />
        </label>
      </li>

      <li className='flex items-center gap-1'>
        <InfoModal text='Change model naming format :'>
          <p>
            This option allows you to customize the naming style for model names. There are no limitations to how you
            can format it, but for this simple example it provides the following options:
            <br /> <br />
            Default: This option refers to the default naming format for models, which may vary depending on the
            programming language or coding convention being used.
            <br /> <br />
            Snake case: Model names are written in lowercase letters, and words are separated by underscores. (e.g:
            model_name)
            <br /> <br />
            Pascal case: Model names start with an uppercase letter, and subsequent words are also capitalized. (e.g:
            ModelName)
            <br /> <br />
            Camel case: Model names start with a lowercase letter, and subsequent words are capitalized. (e.g:
            modelName)
            <br /> <br />
            Param case: Model names use hyphens to separate words, and all letters are in lowercase. (e.g: model-name)
            <br /> <br />
            Constant case: Model names are written in uppercase letters, and words are separated by underscores. (e.g:
            MODEL_NAME)
          </p>
        </InfoModal>
        <label className='flex grow cursor-pointer items-center justify-between gap-1 py-2'>
          <span className='mt-1 max-w-2xl text-sm text-gray-500'>Change model naming format</span>
          <Select
            options={[
              { value: 'default', text: 'Default' },
              { value: 'snake_case', text: 'Snake Case' },
              { value: 'pascal_case', text: 'Pascal Case' },
              { value: 'camel_case', text: 'Camel Case' },
              { value: 'param_case', text: 'Param Case' },
              { value: 'constant_case', text: 'Constant Case' }
            ]}
            value={context?.modelNamingFormat}
            onChange={onChangeModelNamingFormat}
            className='shadow-outline-blue cursor-pointer'
          />
        </label>
      </li>

      <li className='flex items-center gap-1'>
        <InfoModal text='Change enum key naming format :'>
          <p>
            This option allows you to customize the naming style for enum keys. There are no limitations to how you can
            format it, but for this simple example it provides the following options:
            <br /> <br />
            Default: This option refers to the default naming format for enum keys, which may vary depending on the
            programming language or coding convention being used.
            <br /> <br />
            Snake case: Enum key names are written in lowercase letters, and words are separated by underscores. (e.g:
            enum_key)
            <br /> <br />
            Pascal case: Enum key names start with an uppercase letter, and subsequent words are also capitalized. (e.g:
            EnumKey)
            <br /> <br />
            Camel case: Enum key names start with a lowercase letter, and subsequent words are capitalized. (e.g:
            enumKey)
            <br /> <br />
            Param case: Enum key names use hyphens to separate words, and all letters are in lowercase. (e.g: enum-key)
            <br /> <br />
            Constant case: Enum key names are written in uppercase letters, and words are separated by underscores.
            (e.g: ENUM_KEY)
          </p>
        </InfoModal>
        <label className='flex grow cursor-pointer items-center justify-between gap-1 py-2'>
          <span className='mt-1 max-w-2xl text-sm text-gray-500'>Change enum key naming format</span>
          <Select
            options={[
              { value: 'default', text: 'Default' },
              { value: 'snake_case', text: 'Snake Case' },
              { value: 'pascal_case', text: 'Pascal Case' },
              { value: 'camel_case', text: 'Camel Case' },
              { value: 'param_case', text: 'Param Case' },
              { value: 'constant_case', text: 'Constant Case' }
            ]}
            value={context?.enumKeyNamingFormat}
            onChange={onChangeEnumKeyNamingFormat}
            className='shadow-outline-blue cursor-pointer'
          />
        </label>
      </li>
    </ul>
  );
};

export default GeneralOptions;
