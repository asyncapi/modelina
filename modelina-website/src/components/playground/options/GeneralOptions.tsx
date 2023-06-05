"use client"
import React from 'react';
import Select from '../../Select';
import { modelinaLanguageOptions } from '@/types';
import { PlaygroundGeneralConfigContext } from '@/components/contexts/PlaygroundConfigContext';
import InfoModal from '@/components/InfoModal';

interface WithRouterProps {
  setNewConfig?: (queryKey: string, queryValue: string) => void;
}
interface GeneralOptionsState {}

export const defaultState: GeneralOptionsState = {};

class GeneralOptions extends React.Component<
  WithRouterProps,
  GeneralOptionsState
> {
  static contextType = PlaygroundGeneralConfigContext;
  declare context: React.ContextType<typeof PlaygroundGeneralConfigContext>;

  constructor(props: any) {
    super(props);
    this.state = defaultState;
    this.onChangeLanguage = this.onChangeLanguage.bind(this);
    this.onChangeShowTypeMappingExample = this.onChangeShowTypeMappingExample.bind(this);
    this.onChangeIndentationType = this.onChangeIndentationType.bind(this);
    this.onChangePropertyNamingFormat = this.onChangePropertyNamingFormat.bind(this);
    this.onChangeModelNamingFormat = this.onChangeModelNamingFormat.bind(this);
    this.onChangeEnumKeyNamingFormat = this.onChangeEnumKeyNamingFormat.bind(this);
  }

  onChangeLanguage(language: any) {
    if (this.props.setNewConfig) {
      this.props.setNewConfig('language', String(language));
    }
  }

  onChangeShowTypeMappingExample(event: any) {
    if (this.props.setNewConfig) {
      this.props.setNewConfig('showTypeMappingExample', event.target.checked);
    }
  }

  onChangeIndentationType(value: any) {
    if (this.props.setNewConfig) {
      this.props.setNewConfig('indentationType', String(value));
    }
  }

  onChangePropertyNamingFormat(value: any) {
    if (this.props.setNewConfig) {
      this.props.setNewConfig('propertyNamingFormat', String(value));
    }
  }

  onChangeModelNamingFormat(value: any) {
    if (this.props.setNewConfig) {
      this.props.setNewConfig('modelNamingFormat', String(value));
    }
  }

  onChangeEnumKeyNamingFormat(value: any) {
    if (this.props.setNewConfig) {
      this.props.setNewConfig('enumKeyNamingFormat', String(value));
    }
  }

  


  render() {
    return (
      <ul className="flex flex-col">
        <h3 className="text-lg font-medium leading-6 text-gray-900">
          General options
        </h3>
        <li className=' flex items-center mt-3'>
          <InfoModal text="Output type :">
            <p>
              Additional information about the output type{' '}
              <a href="https://example.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">Click here</a> to visit the website.
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Praesentium ipsam, ex quis veritatis totam quo. Cupiditate sequi laudantium corporis commodi.
            </p>
          </InfoModal>
          <label className="flex flex-grow justify-between items-center cursor-pointer">
            <span className=" text-sm text-gray-500">
              Output type
            </span>
            <Select
              options={modelinaLanguageOptions}
              value={this.context?.language}
              onChange={this.onChangeLanguage}
              className="shadow-outline-blue cursor-pointer"
            />
          </label>
        </li>

        <li>
          <label className="flex items-center py-2 justify-between cursor-pointer">
            <span className="mt-1 max-w-2xl text-sm text-gray-500">
              Include change type mapping example
            </span>
            <input
              type="checkbox"
              className="form-checkbox cursor-pointer"
              name="includeDescriptions"
              checked={this.context?.showTypeMappingExample}
              onChange={this.onChangeShowTypeMappingExample}
            />
          </label>
        </li>
        <li>
          <label className="flex items-center py-2 justify-between cursor-pointer">
            <span className="mt-1 max-w-2xl text-sm text-gray-500">
              Change indentation type
            </span>
            <Select
              options={[
                { value: 'tabs', text: 'Tabs' },
                { value: 'spaces', text: 'Spaces' }
              ]}
            
              value={this.context?.indentationType}
              onChange={this.onChangeIndentationType}
              className="shadow-outline-blue cursor-pointer"
            />
          </label>
        </li>
        <li>
          <label className="flex items-center py-2 justify-between cursor-pointer">
            <span className="mt-1 max-w-2xl text-sm text-gray-500">
              Change property naming format
            </span>
            <Select
              options={[
                { value: 'default', text: 'Default' },
                { value: 'snake_case', text: 'Snake Case' },
                { value: 'pascal_case', text: 'Pascal Case' },
                { value: 'camel_case', text: 'Camel Case' },
                { value: 'param_case', text: 'Param Case' },
                { value: 'constant_case', text: 'Constant Case' }
              ]}
            
              value={this.context?.propertyNamingFormat}
              onChange={this.onChangePropertyNamingFormat}
              className="shadow-outline-blue cursor-pointer"
            />
          </label>
        </li>
        <li>
          <label className="flex items-center py-2 justify-between cursor-pointer">
            <span className="mt-1 max-w-2xl text-sm text-gray-500">
              Change model naming format
            </span>
            <Select
              options={[
                { value: 'default', text: 'Default' },
                { value: 'snake_case', text: 'Snake Case' },
                { value: 'pascal_case', text: 'Pascal Case' },
                { value: 'camel_case', text: 'Camel Case' },
                { value: 'param_case', text: 'Param Case' },
                { value: 'constant_case', text: 'Constant Case' }
              ]}
            
              value={this.context?.modelNamingFormat}
              onChange={this.onChangeModelNamingFormat}
              className="shadow-outline-blue cursor-pointer"
            />
          </label>
        </li>
        <li>
          <label className="flex items-center py-2 justify-between cursor-pointer">
            <span className="mt-1 max-w-2xl text-sm text-gray-500">
              Change enum key naming format
            </span>
            <Select
              options={[
                { value: 'default', text: 'Default' },
                { value: 'snake_case', text: 'Snake Case' },
                { value: 'pascal_case', text: 'Pascal Case' },
                { value: 'camel_case', text: 'Camel Case' },
                { value: 'param_case', text: 'Param Case' },
                { value: 'constant_case', text: 'Constant Case' }
              ]}
            
              value={this.context?.enumKeyNamingFormat}
              onChange={this.onChangeEnumKeyNamingFormat}
              className="shadow-outline-blue cursor-pointer"
            />
          </label>
        </li>
      </ul>
    );
  }
}
export default GeneralOptions;
