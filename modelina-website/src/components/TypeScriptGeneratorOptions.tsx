import React from 'react';
import Select from './Select';
import { ModelinaTypeScriptOptions } from '@/types';
import { withRouter, NextRouter } from 'next/router';

interface WithRouterProps {
  router: NextRouter,
  setNewConfig: (propertyKey: string, propertyValue: string) => void
}
type TypeScriptGeneratorState = {
  tsMarshalling: boolean;
  tsModelType: "class" | "interface" | undefined;
}

export const defaultState: TypeScriptGeneratorState = { 
  tsMarshalling: false, 
  tsModelType: 'class' 
};

class TypeScriptGeneratorOptions extends React.Component<WithRouterProps, TypeScriptGeneratorState> {
  constructor(props: any) {
    super(props)
    const localState = defaultState;
    this.state = localState;
    this.onChangeMarshalling = this.onChangeMarshalling.bind(this);
    this.onChangeVariant = this.onChangeVariant.bind(this);
  }
  
  onChangeMarshalling(event: any) {
    this.props.setNewConfig("tsMarshalling", event.target.checked);
    this.setState({...this.state, tsMarshalling: event.target.checked});
  }

  onChangeVariant(variant: any) {
    this.props.setNewConfig("tsModelType", String(variant));
    this.setState({...this.state, tsModelType: variant});
  }

  render() {
    const query = this.props.router.query as ModelinaTypeScriptOptions;
    const localState = {...this.state};
    if(query.tsMarshalling !== undefined) {
      localState.tsMarshalling = (query.tsMarshalling === 'true');
    }
    if(query.tsModelType !== undefined) {
      localState.tsModelType = query.tsModelType as any;
    }
    return (
      <ul className="flex flex-col">
        <h3 className="text-lg font-medium leading-6 text-gray-900">TypeScript Specific options</h3>
        <li>
          <label className="flex items-center py-2 justify-between cursor-pointer">
            <span className="mt-1 max-w-2xl text-sm text-gray-500">TypeScript class variant</span>
            <Select
              options={[{ value: 'class', text: 'Class' }, { value: 'interface', text: 'Interface' }]}
              value={localState.tsModelType}
              onChange={this.onChangeVariant}
              className="shadow-outline-blue cursor-pointer"
            />
          </label>
        </li>
        {localState.tsModelType === 'class' ? (
          <li>
            <label className="flex items-center py-2 justify-between cursor-pointer">
              <span className="mt-1 max-w-2xl text-sm text-gray-500">Include un/marshal functions</span>
              <input type="checkbox" 
                className="form-checkbox cursor-pointer" 
                name="marshalling" 
                checked={localState.tsMarshalling} 
                onChange={this.onChangeMarshalling} />
            </label>
          </li>
        ) : null}
      </ul>
    );
  }
}
export default withRouter(TypeScriptGeneratorOptions);