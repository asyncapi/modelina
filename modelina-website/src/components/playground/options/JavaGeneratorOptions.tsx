import React from 'react';
import { debounce } from 'lodash';
import { PlaygroundJavaConfigContext } from '@/components/contexts/PlaygroundConfigContext';
import Select from '@/components/Select';

interface JavaGeneratorOptionsProps {
  setNewConfig?: (queryKey: string, queryValue: string) => void;
}

interface JavaGeneratorState {
  packageName?: string;
}

export const defaultState: JavaGeneratorState = {};

class JavaGeneratorOptions extends React.Component<
  JavaGeneratorOptionsProps,
  JavaGeneratorState
> {
  static contextType = PlaygroundJavaConfigContext;
  declare context: React.ContextType<typeof PlaygroundJavaConfigContext>;
  constructor(props: any) {
    super(props);
    this.state = defaultState;
    this.debouncedSetNewConfig = this.debouncedSetNewConfig.bind(this);
    this.onChangePackageName = this.onChangePackageName.bind(this);
    this.onChangeIncludeJackson = this.onChangeIncludeJackson.bind(this);
    this.onChangeIncludeMarshaling = this.onChangeIncludeMarshaling.bind(this);
    this.onChangeArrayType = this.onChangeArrayType.bind(this);
    this.onChangeOverwriteHashCodeSupport = this.onChangeOverwriteHashCodeSupport.bind(this);
    this.onChangeOverwriteEqualSupport = this.onChangeOverwriteEqualSupport.bind(this);
    this.onChangeOverwriteToStringSupport = this.onChangeOverwriteToStringSupport.bind(this);
    this.onChangeJavaDocs = this.onChangeJavaDocs.bind(this);
    this.onChangeJavaxAnnotation = this.onChangeJavaxAnnotation.bind(this);
  }

  debouncedSetNewConfig = debounce(this.props.setNewConfig as (queryKey: string, queryValue: string) => void, 500);

  componentDidMount(): void {
    this.setState({ ...this.state, packageName: this.context?.javaPackageName });
  }

  onChangePackageName(event: any) {
    this.setState({ ...this.state, packageName: event.target.value });
    if (this.props.setNewConfig) {
      this.debouncedSetNewConfig('javaPackageName', event.target.value);
    }
  }

  onChangeIncludeJackson(event: any) {
    if (this.props.setNewConfig) {
      this.props.setNewConfig('javaIncludeJackson', event.target.checked);
    }
  }

  onChangeIncludeMarshaling(event: any) {
    if (this.props.setNewConfig) {
      this.props.setNewConfig('javaIncludeMarshaling', event.target.checked);
    }
  }

  onChangeArrayType(arrayType: any) {
    if (this.props.setNewConfig) {
      this.props.setNewConfig('javaArrayType', String(arrayType));
    }
  }

  onChangeOverwriteHashCodeSupport(event: any) {
    if (this.props.setNewConfig) {
      this.props.setNewConfig('javaOverwriteHashcode', event.target.checked);
    }
  }

  onChangeOverwriteEqualSupport(event: any) {
    if (this.props.setNewConfig) {
      this.props.setNewConfig('javaOverwriteEqual', event.target.checked);
    }
  }

  onChangeOverwriteToStringSupport(event: any){
    if(this.props.setNewConfig){
      this.props.setNewConfig('javaOverwriteToString',event.target.checked);
    }
  }

  onChangeJavaDocs(event: any) {
    if (this.props.setNewConfig) {
      this.props.setNewConfig('javaJavaDocs', event.target.checked);
    }
  }

  onChangeJavaxAnnotation(event: any) {
    if (this.props.setNewConfig) {
      this.props.setNewConfig('javaJavaxAnnotation', event.target.checked);
    }
  }

  render() {
    return (
      <ul className="flex flex-col">
        <h3 className="text-lg font-medium leading-6 text-gray-900">
          Java Specific options
        </h3>
        <li>
          <label className="flex items-center py-2 justify-between cursor-pointer">
            <span className="mt-1 max-w-2xl text-sm text-gray-500">
              Package Name
            </span>
            <input
              type="text"
              className="form-input rounded-md border-gray-300 cursor-pointer font-regular text-md text-gray-700 hover:bg-gray-50 focus-within:text-gray-900"
              name="javaPackageName"
              value={this.state?.packageName}
              onChange={this.onChangePackageName}
            />
          </label>
        </li>
        <li>
          <label className="flex items-center py-2 justify-between cursor-pointer">
            <span className="mt-1 max-w-2xl text-sm text-gray-500">
              Include Jackson serialization
            </span>
            <input
              type="checkbox"
              className="form-checkbox cursor-pointer"
              name="javaIncludeJackson"
              checked={this.context?.javaIncludeJackson}
              onChange={this.onChangeIncludeJackson}
            />
          </label>
        </li>
        <li>
          <label className="flex items-center py-2 justify-between cursor-pointer">
            <span className="mt-1 max-w-2xl text-sm text-gray-500">
              Include Marshaling serialization
            </span>
            <input
              type="checkbox"
              className="form-checkbox cursor-pointer"
              name="javaIncludeMarshaling"
              checked={this.context?.javaIncludeMarshaling}
              onChange={this.onChangeIncludeMarshaling}
            />
          </label>
        </li>
        <li>
          <label className="flex items-center py-2 justify-between cursor-pointer">
            <span className="mt-1 max-w-2xl text-sm text-gray-500">
              Java array type
            </span>
            <Select
              options={[
                { value: 'List', text: 'List' },
                { value: 'Array', text: 'Array' }
              ]}
              value={this.context?.javaArrayType}
              onChange={this.onChangeArrayType}
              className="shadow-outline-blue cursor-pointer"
            />
          </label>
        </li>
        <li>
          <label className="flex items-center py-2 justify-between cursor-pointer">
            <span className="mt-1 max-w-2xl text-sm text-gray-500">
              Include Overwrite HashCode Support
            </span>
            <input
              type="checkbox"
              className="form-checkbox cursor-pointer"
              name="csharpOverwriteHashcode"
              checked={this.context?.javaOverwriteHashcode}
              onChange={this.onChangeOverwriteHashCodeSupport}
            />
          </label>
        </li>
        <li>
          <label className="flex items-center py-2 justify-between cursor-pointer">
            <span className="mt-1 max-w-2xl text-sm text-gray-500">
              Include Overwrite Equal Support
            </span>
            <input
              type="checkbox"
              className="form-checkbox cursor-pointer"
              name="csharpOverwriteEqual"
              checked={this.context?.javaOverwriteEqual}
              onChange={this.onChangeOverwriteEqualSupport}
            />
          </label>
        </li>
        <li>
          <label className="flex items-center py-2 justify-between cursor-pointer">
            <span className="mt-1 max-w-2xl text-sm text-gray-500">
              Include Overwrite toString Support
            </span>
            <input
              type="checkbox"
              className="form-checkbox cursor-pointer"
              name="javaOverwriteToString"
              checked={this.context?.javaOverwriteToString}
              onChange={this.onChangeOverwriteToStringSupport}
            />
          </label>
        </li>
        <li>
          <label className="flex items-center py-2 justify-between cursor-pointer">
            <span className="mt-1 max-w-2xl text-sm text-gray-500">
              Include javaDocs
            </span>
            <input
              type="checkbox"
              className="form-checkbox cursor-pointer"
              name="javaJavaDocs"
              checked={this.context?.javaJavaDocs}
              onChange={this.onChangeJavaDocs}
            />
          </label>
        </li>
        <li>
          <label className="flex items-center py-2 justify-between cursor-pointer">
            <span className="mt-1 max-w-2xl text-sm text-gray-500">
              Include Javax validation constraints 
            </span>
            <input
              type="checkbox"
              className="form-checkbox cursor-pointer"
              name="javaJavaxAnnotation"
              checked={this.context?.javaJavaxAnnotation}
              onChange={this.onChangeJavaxAnnotation}
            />
          </label>
        </li>
      </ul>
    );
  }
}
export default JavaGeneratorOptions;
