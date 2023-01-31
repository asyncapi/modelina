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


class TypeScriptReactGenerator extends React.Component<WithRouterProps, TypeScriptGeneratorState> {
  constructor(props: any) {
    super(props)
    const query = this.props.router.query as ModelinaTypeScriptOptions;
    const localState = defaultState;
    if(query.tsMarshalling !== undefined) {
      localState.tsMarshalling = (query.tsMarshalling === 'true');
    }
    if(query.tsModelType !== undefined) {
      localState.tsModelType = query.tsModelType as any;
    }
    this.state = localState;
    this.onChangeMarshalling = this.onChangeMarshalling.bind(this);
    this.onChangeVariant = this.onChangeVariant.bind(this);
  }
  
  onChangeMarshalling(event: any) {
    this.props.setNewConfig("tsMarshalling", String(event.target.checked));
    this.setState({...this.state, tsModelType: event.target.checked});
  }

  onChangeVariant(variant: any) {
    this.props.setNewConfig("tsModelType", String(variant));
    this.setState({...this.state, tsModelType: variant});
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
        {this.state.tsModelType === 'class' ? (
          <li>
            <label className="flex items-center py-2 justify-between cursor-pointer">
              <span className="text-sm mr-2">Include un/marshal functions</span>
              <input type="checkbox" className="form-checkbox cursor-pointer" name="marshalling" checked={this.state.tsMarshalling} onChange={this.onChangeMarshalling} />
            </label>
          </li>
        ) : null}
      </ul>
    );
  }
}
export default withRouter(TypeScriptReactGenerator);