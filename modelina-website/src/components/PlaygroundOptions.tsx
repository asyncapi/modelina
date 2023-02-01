import React from 'react';
import Select from './Select';
import { ModelinaGeneralOptions, modelinaLanguageOptions, ModelinaTypeScriptOptions } from '@/types';
import { withRouter, NextRouter } from 'next/router';
import TypeScriptGeneratorOptions from './TypeScriptGeneratorOptions';
import GeneralOptions from './GeneralOptions';

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

class PlaygroundOptions extends React.Component<WithRouterProps, GeneralOptionsState> {
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
    const { language } = this.state;
    let generatorOptions;
    if (language === 'typescript') {
      generatorOptions = <TypeScriptGeneratorOptions setNewConfig={this.props.setNewConfig} />
    }
    return (
      <div className="h-full bg-code-editor-dark rounded-b shadow-lg font-bold">
        <GeneralOptions setNewConfig={this.props.setNewConfig}/>
        {generatorOptions}
      </div>
    );
  }
}
export default withRouter(PlaygroundOptions);