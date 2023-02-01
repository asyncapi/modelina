import React from 'react';
import Select from './Select';
import { ModelinaGeneralOptions, modelinaLanguageOptions, ModelinaTypeScriptOptions } from '@/types';
import { withRouter, NextRouter } from 'next/router';

interface WithRouterProps {
  router: NextRouter,
  setNewConfig: (propertyKey: string, propertyValue: string) => void
}
type GeneralOptionsState = {
  language: string
}

export const defaultState: GeneralOptionsState = { 
  language: 'typescript' 
};

class GeneralOptions extends React.Component<WithRouterProps, GeneralOptionsState> {
  constructor(props: any) {
    super(props)
    const localState = defaultState;
    this.state = localState;
    this.onChangeLanguage = this.onChangeLanguage.bind(this);
  }

  onChangeLanguage(language: any) {
    this.props.setNewConfig("language", String(language));
    this.setState({...this.state, language});
  }

  render() {
    const query = this.props.router.query as ModelinaGeneralOptions;
    const localState = {...this.state};
    if(query.language !== undefined) {
      localState.language = query.language;
    }
    return (
      <ul className="flex flex-col">
        <li>
          <label className="flex items-center py-2 justify-between cursor-pointer">
            <span className="mt-1 max-w-2xl text-sm text-gray-500">Output type</span>
            <Select
              options={modelinaLanguageOptions}
              selected={localState}
              onChange={this.onChangeLanguage}
              className="shadow-outline-blue cursor-pointer"
            />
          </label>
        </li>
      </ul>
    );
  }
}
export default withRouter(GeneralOptions);