import React from 'react';
import TypeScriptGeneratorOptions from './options/TypeScriptGeneratorOptions';
import GeneralOptions from './options/GeneralOptions';
import { PlaygroundGeneralConfigContext } from '../contexts/PlaygroundGeneralConfigContext';
import JavaScriptGeneratorOptions from './options/JavaScriptGeneratorOptions';
import CSharpGeneratorOptions from './options/CSharpGeneratorOptions';
import DartGeneratorOptions from './options/DartGeneratorOptions';
import GoGeneratorOptions from './options/GoGeneratorOptions';
import JavaGeneratorOptions from './options/JavaGeneratorOptions';
import KotlinGeneratorOptions from './options/KotlinGeneratorOptions';
import RustGeneratorOptions from './options/RustGeneratorOptions';
import PythonGeneratorOptions from './options/PythonGeneratorOptions';
import CplusplusGeneratorOptions from './options/CplusplusGeneratorOptions';
import PhpGeneratorOptions from './options/PhpGeneratorOptions';

interface WithRouterProps {
  setNewConfig?: (queryKey: string, queryValue: string) => void;
}
interface PlaygroundOptionsState {}

export const defaultState: PlaygroundOptionsState = {};

class PlaygroundOptions extends React.Component<
  WithRouterProps,
  PlaygroundOptionsState
> {
  static contextType = PlaygroundGeneralConfigContext;
  declare context: React.ContextType<typeof PlaygroundGeneralConfigContext>;
  constructor(props: any) {
    super(props);
    this.state = defaultState;
  }

  render() {
    let generatorOptions;
    if (this.context?.language === 'typescript') {
      generatorOptions = (
        <TypeScriptGeneratorOptions setNewConfig={this.props.setNewConfig} />
      );
    } else if (this.context?.language === 'javascript') {
      generatorOptions = (
        <JavaScriptGeneratorOptions setNewConfig={this.props.setNewConfig} />
      );
    } else if (this.context?.language === 'csharp') {
      generatorOptions = (
        <CSharpGeneratorOptions setNewConfig={this.props.setNewConfig} />
      );
    } else if (this.context?.language === 'dart') {
      generatorOptions = (
        <DartGeneratorOptions setNewConfig={this.props.setNewConfig} />
      );
    } else if (this.context?.language === 'go') {
      generatorOptions = (
        <GoGeneratorOptions setNewConfig={this.props.setNewConfig} />
      );
    } else if (this.context?.language === 'cplusplus') {
      generatorOptions = (
        <CplusplusGeneratorOptions setNewConfig={this.props.setNewConfig} />
      );
    } else if (this.context?.language === 'java') {
      generatorOptions = (
        <JavaGeneratorOptions setNewConfig={this.props.setNewConfig} />
      );
    } else if (this.context?.language === 'kotlin') {
      generatorOptions = (
        <KotlinGeneratorOptions setNewConfig={this.props.setNewConfig} />
      );
    } else if (this.context?.language === 'rust') {
      generatorOptions = (
        <RustGeneratorOptions setNewConfig={this.props.setNewConfig} />
      );
    } else if (this.context?.language === 'python') {
      generatorOptions = (
        <PythonGeneratorOptions setNewConfig={this.props.setNewConfig} />
      );
    } else if (this.context?.language === 'php') {
      generatorOptions = (
        <PhpGeneratorOptions setNewConfig={this.props.setNewConfig} />
      );
    }
    return (
      <div className="p-12 rounded-b shadow-lg font-bold">
        <GeneralOptions setNewConfig={this.props.setNewConfig} />
        {generatorOptions}
      </div>
    );
  }
}
export default PlaygroundOptions;
