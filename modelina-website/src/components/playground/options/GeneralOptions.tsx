import React from 'react';
import Select from '../../Select';
import { modelinaLanguageOptions } from '@/types';
import { PlaygroundGeneralConfigContext } from '@/components/contexts/PlaygroundGeneralConfigContext';

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
  }

  onChangeLanguage(language: any) {
    if (this.props.setNewConfig) {
      this.props.setNewConfig('language', String(language));
    }
  }

  render() {
    return (
      <ul className="flex flex-col">
        <h3 className="text-lg font-medium leading-6 text-gray-900">
          General options
        </h3>
        <li>
          <label className="flex items-center py-2 justify-between cursor-pointer">
            <span className="mt-1 max-w-2xl text-sm text-gray-500">
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
      </ul>
    );
  }
}
export default GeneralOptions;
