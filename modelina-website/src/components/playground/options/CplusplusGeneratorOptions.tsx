import React from 'react';
import { PlaygroundCplusplusConfigContext } from '@/components/contexts/PlaygroundConfigContext';
import { debounce } from 'lodash';
import InfoModal from '@/components/InfoModal';

interface CplusplusGeneratorOptionsProps {
  setNewConfig?: (queryKey: string, queryValue: string) => void;
}

interface CplusplusGeneratorState {
  namespace?: string;
}

export const defaultState: CplusplusGeneratorState = {};

class CplusplusGeneratorOptions extends React.Component<
  CplusplusGeneratorOptionsProps,
  CplusplusGeneratorState
> {
  static contextType = PlaygroundCplusplusConfigContext;
  declare context: React.ContextType<typeof PlaygroundCplusplusConfigContext>;
  constructor(props: any) {
    super(props);
    this.state = defaultState;
    this.setState({ ...this.state, namespace: this.context?.cplusplusNamespace });
    this.onChangeNamespace = this.onChangeNamespace.bind(this);
    this.debouncedSetNewConfig = this.debouncedSetNewConfig.bind(this);
  }

  componentDidMount() {
    this.setState({ ...this.state, namespace: this.context?.cplusplusNamespace });
  }

  onChangeNamespace(event: any) {
    this.setState({ ...this.state, namespace: event.target.value })
    if (this.props.setNewConfig) {
      this.debouncedSetNewConfig('cplusplusNamespace', event.target.value);
    }
  }

  debouncedSetNewConfig = debounce(this.props.setNewConfig || (() => {}), 500);

  render() {
    return (
      <ul className="flex flex-col">
        <h3 className="py-2 w-full text-left border-b-[1px] border-gray-700 text-sm">
          C++ Specific options
        </h3>
        <li className=' flex items-center'>
          <InfoModal text="Namespace :">
            <p>
            In C++, a namespace is a feature that allows you to organize your code into logical groups or containers. It helps in avoiding naming conflicts between different parts of your code and provides a way to encapsulate related code.
            </p>
          </InfoModal>
          <label className="flex flex-grow items-center py-2 justify-between cursor-pointer">
            <span className="mt-1 max-w-2xl text-sm text-gray-500">
              Namespace
            </span>
            <input
              type="text"
              className="form-input rounded-md border-gray-300 cursor-pointer font-regular text-md text-gray-700 hover:bg-gray-50 focus-within:text-gray-900"
              name="cplusplusNamespace"
              value={this.state.namespace}
              onChange={this.onChangeNamespace}
            />
          </label>
        </li>
      </ul>
    );
  }
}
export default CplusplusGeneratorOptions;
