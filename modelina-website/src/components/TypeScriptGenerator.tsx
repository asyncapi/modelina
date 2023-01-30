import React from 'react';
import { TS_COMMON_PRESET, TypeScriptGenerator } from "@asyncapi/modelina/lib/cjs";
import Select from './Select';

interface GeneratorCallbackProps {
  generator: any;
  generatorCode: string
};

type GeneratorReactProps = { 
  onGeneratorChange: (args: GeneratorCallbackProps) => void;
  onInit: (args: GeneratorCallbackProps) => void;
};

type TypeScriptGeneratorState = {
  variant: "class" | "interface" | undefined;
  marshalling: boolean;
}

export const defaultState: TypeScriptGeneratorState = { 
  marshalling: false, 
  variant: 'class' 
};

/**
 * Function for getting the generator for class model type as well as the code that comprise of the generator, just in text form.
 */
export function getGeneratorCode(state: TypeScriptGeneratorState = defaultState): GeneratorCallbackProps {
  const generator = new TypeScriptGenerator({
    modelType: state.variant,
    presets: [
      {
        preset: TS_COMMON_PRESET,
        options: {
          marshalling: state.marshalling
        }
      }
    ]
  });

  const generateInstanceCode = `const generator = new TypeScriptGenerator({
  modelType: 'class',
  ${state.marshalling ? `presets: [
    {
      preset: TS_COMMON_PRESET,
      options: {
        marshalling: true
      }
    }
  ]` : ''}
});`.replace(/^\s*\n/gm, '');

  const generatorCode = `import { TypeScriptGenerator, TS_COMMON_PRESET } from '@asyncapi/modelina';

${generateInstanceCode}`

  return { generator, generatorCode };
}
export default class TypeScriptReactGenerator extends React.Component<GeneratorReactProps, TypeScriptGeneratorState> {
  constructor(props: GeneratorReactProps) {
    super(props)
    this.state = defaultState;
    this.onChangeMarshalling = this.onChangeMarshalling.bind(this);
    this.onChangeVariant = this.onChangeVariant.bind(this);
    this.onNewSettings = this.onNewSettings.bind(this);
    this.props.onInit(getGeneratorCode(this.state));
  }

  componentDidMount() {
  }

  onChangeMarshalling(event: any) {
    const newState = {...this.state, marshalling: event.target.checked}
    this.setState(newState)
    this.onNewSettings(newState)
  }
  onChangeVariant(variant: any) {
    const newState = {...this.state, variant}
    this.setState(newState)
    this.onNewSettings(newState)
  }
  async onNewSettings(state: any) {
    this.props.onGeneratorChange(getGeneratorCode(state))
  }

  render() {
    return (
      <ul className="flex flex-col">
        <li>
          <label className="flex items-center py-2 justify-between cursor-pointer">
            <span className="text-sm mr-2">Output variant</span>
              <Select
                options={[{ value: 'class', text: 'Class' }, { value: 'interface', text: 'Interface' }]}
                selected={'class'}
                onChange={this.onChangeVariant}
                className="shadow-outline-blue cursor-pointer"
              />
          </label>
        </li>
        {this.state.variant === 'class' ? (
          <li>
            <label className="flex items-center py-2 justify-between cursor-pointer">
              <span className="text-sm mr-2">Include un/marshal functions</span>
              <input type="checkbox" className="form-checkbox cursor-pointer" name="marshalling" checked={this.state.marshalling} onChange={this.onChangeMarshalling} />
            </label>
          </li>
        ) : null}
      </ul>
    );
  }
}