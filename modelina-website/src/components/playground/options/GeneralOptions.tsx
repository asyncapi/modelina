import React from 'react';
import Select from '../../Select';
import { modelinaLanguageOptions } from '@/types';
import { PlaygroundGeneralConfigContextInstance } from '@/components/contexts/PlaygroundGeneralConfigContext';

interface WithRouterProps {
  setNewQuery?: (queryKey: string, queryValue: string) => void
}
type GeneralOptionsState = {}

export const defaultState: GeneralOptionsState = { };

class GeneralOptions extends React.Component<WithRouterProps, GeneralOptionsState> {
  static contextType = PlaygroundGeneralConfigContextInstance;
  declare context: React.ContextType<typeof PlaygroundGeneralConfigContextInstance>;
  constructor(props: any) {
    super(props)
    this.state = defaultState;
    this.onChangeLanguage = this.onChangeLanguage.bind(this);
  }

  onChangeLanguage(language: any) {
    if (this.props.setNewQuery) this.props.setNewQuery("language", String(language));
  }

  render() {
    return (
      <ul className="flex flex-col">
        <h3 className="text-lg font-medium leading-6 text-gray-900">General options</h3>
        <li>
          <label className="flex items-center py-2 justify-between cursor-pointer">
            <span className="mt-1 max-w-2xl text-sm text-gray-500">Output type</span>
            <Select
              options={modelinaLanguageOptions}
              selected={this.context?.language}
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