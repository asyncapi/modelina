import React from 'react';
import TypeScriptGeneratorOptions from './options/TypeScriptGeneratorOptions';
import GeneralOptions from './options/GeneralOptions';
import { PlaygroundGeneralConfigContextInstance } from '../contexts/PlaygroundGeneralConfigContext';

interface WithRouterProps {
  setNewQuery?: (queryKey: string, queryValue: string) => void
}
type GeneralOptionsState = {}

export const defaultState: GeneralOptionsState = { };

class PlaygroundOptions extends React.Component<WithRouterProps, GeneralOptionsState> {
  static contextType = PlaygroundGeneralConfigContextInstance;
  declare context: React.ContextType<typeof PlaygroundGeneralConfigContextInstance>;
  constructor(props: any) {
    super(props)
    this.state = defaultState;
  }


  render() {
    let generatorOptions;
    if (this.context?.language === 'typescript') {
      generatorOptions = <TypeScriptGeneratorOptions setNewQuery={this.props.setNewQuery} />
    }
    return (
      <div className="h-full p-12 rounded-b shadow-lg font-bold">
        <GeneralOptions setNewQuery={this.props.setNewQuery}/>
        {generatorOptions}
      </div>
    );
  }
}
export default PlaygroundOptions;