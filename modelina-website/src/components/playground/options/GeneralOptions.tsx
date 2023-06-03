import React from 'react';
import Select from '../../Select';
import { modelinaLanguageOptions } from '@/types';
import { PlaygroundGeneralConfigContext } from '@/components/contexts/PlaygroundConfigContext';

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
        <li className="relative">
          <label className="flex items-center py-2 justify-between cursor-pointer">
            <span className="mt-1 max-w-2xl text-sm text-gray-500 relative group flex items-center">
              <svg
                className=" -ml-5 mr-2"
                width="7"
                height="13"
                viewBox="0 0 7 13"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5.25 0C4.2875 0 3.5 0.73125 3.5 1.625C3.5 2.51875 4.2875 3.25 5.25 3.25C6.2125 3.25 7 2.51875 7 1.625C7 0.73125 6.2125 0 5.25 0ZM2.625 4.0625C1.1725 4.0625 0 5.15125 0 6.5H1.75C1.75 6.045 2.135 5.6875 2.625 5.6875C3.115 5.6875 3.5 6.045 3.5 6.5C3.5 6.955 1.75 9.165 1.75 10.5625C1.75 11.96 2.9225 13 4.375 13C5.8275 13 7 11.9112 7 10.5625H5.25C5.25 11.0175 4.865 11.375 4.375 11.375C3.885 11.375 3.5 11.0175 3.5 10.5625C3.5 9.9775 5.25 7.5725 5.25 6.5C5.25 5.18375 4.0775 4.0625 2.625 4.0625Z"
                  fill="#DBD9D9"
                />
              </svg>
              Output type
              <span className="opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity duration-300 ease-in ">
                <span className="absolute -left-1/2 bg-blue-200 text-white text-xs py-1 px-2 rounded-lg bottom-full transform translate-x-[-7rem] translate-y-1/2">
                  Additional information about the output type
                </span>
              </span>
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
