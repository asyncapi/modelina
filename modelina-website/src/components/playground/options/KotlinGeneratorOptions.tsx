import React from 'react';
import { debounce } from 'lodash';
import { PlaygroundKotlinConfigContext } from '@/components/contexts/PlaygroundConfigContext';

interface KotlinGeneratorOptionsProps {
  setNewConfig?: (queryKey: string, queryValue: string) => void;
}

interface KotlinGeneratorState {
  packageName?: string;
}

export const defaultState: KotlinGeneratorState = {};

class KotlinGeneratorOptions extends React.Component<
  KotlinGeneratorOptionsProps,
  KotlinGeneratorState
> {
  static contextType = PlaygroundKotlinConfigContext;
  declare context: React.ContextType<typeof PlaygroundKotlinConfigContext>;
  constructor(props: any) {
    super(props);
    this.state = defaultState;
    this.debouncedSetNewConfig = this.debouncedSetNewConfig.bind(this);
    this.onChangePackageName = this.onChangePackageName.bind(this);
  }

  debouncedSetNewConfig = debounce(this.props.setNewConfig as (queryKey: string, queryValue: string) => void, 500);

  componentDidMount(): void {
    this.setState({ ...this.state, packageName: this.context?.kotlinPackageName });
  }

  onChangePackageName(event: any) {
    this.setState({ ...this.state, packageName: event.target.value });
    if (this.props.setNewConfig) {
      this.debouncedSetNewConfig('kotlinPackageName', event.target.value);
    }
  }

  render() {
    return (
      <ul className="flex flex-col">
        <h3 className="text-lg font-medium leading-6 text-gray-900">
          Kotlin Specific options
        </h3>
        <li>
          <label className="flex items-center py-2 justify-between cursor-pointer">
            <span className="mt-1 max-w-2xl text-sm text-gray-500">
              Package Name
            </span>
            <input
              type="text"
              className="form-input rounded-md border-gray-300 cursor-pointer font-regular text-md text-gray-700 hover:bg-gray-50 focus-within:text-gray-900"
              name="kotlinPackageName"
              value={this.state?.packageName}
              onChange={this.onChangePackageName}
            />
          </label>
        </li>
      </ul>
    );
  }
}
export default KotlinGeneratorOptions;
