import React from 'react';
import { debounce } from 'lodash';
import { PlaygroundJavaConfigContext } from '@/components/contexts/PlaygroundConfigContext';
import Select from '@/components/Select';
import InfoModal from '@/components/InfoModal';

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
        <h3 className="py-2 w-full text-left border-b-[1px] border-gray-700 text-sm">
          Java Specific options
        </h3>
        <li className=' flex items-center'>
          <InfoModal text="Package Name :">
            <p>
            In Java, a package name is a way to organize and group related classes and interfaces. It is a naming convention that helps prevent naming conflicts and provides a hierarchical structure to the Java codebase.
            <br/><br/>
            A package name is written as  series of identifiers separated by dots ('.'). Each identifier represents a level in the package hierarchy. For example, a package name could be 'com.example.myapp'.
            </p>
          </InfoModal>
          <label className="flex flex-grow items-center py-2 justify-between cursor-pointer">
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
        <li className=' flex items-center'>
          <InfoModal text="Include Jackson serialization :">
            <p>
            When you enable the "Include Jackson serialization" option, it means that the code generator will include the necessary annotations from the Jackson library in the generated code. These annotations are used to configure and control how Java objects are serialized to JSON and deserialized from JSON.
            <br/><br/>
            Annotations in Java are represented by the @ symbol followed by the annotation name. 
            </p>
          </InfoModal>
          <label className="flex flex-grow items-center py-2 justify-between cursor-pointer">
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
        <li className=' flex items-center'>
          <InfoModal text="Include Marshaling serialization :">
            <p>
            This option indicates whether the marshal and unmarshal functions would be included in the generated code or not 
            <br/><br/>
            the defalult value is false
            <br/><br/>
            marshal - this function takes an instance of the class and return a JSON object.
            <br/><br/>
            unmarshal - this function takes a JSON object and returns an instanve of the class.
            </p>
          </InfoModal>
          <label className="flex flex-grow items-center py-2 justify-between cursor-pointer">
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
        <li className=' flex items-center'>
          <InfoModal text="Java array type :">
            <p>
            This option allows you to switch between rendering collections as List type or Array.
            <br/><br/>
            The default value is Array.
            </p>
          </InfoModal>
          <label className="flex flex-grow items-center py-2 justify-between cursor-pointer">
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
        <li className=' flex items-center'>
          <InfoModal text="Include Overwrite HashCode Support :">
            <p>
            In Java, the "hashCode()" method is used to generate a unique numeric value (hash code) for an object. The default implementation of hashCode() in the Object class generates hash codes based on the memory address of the object, which may not be suitable for all classes.
            <br/><br/>
            When you enable the "Include Overwrite HashCode Support" option, it means that the code generator will automatically generate a customized implementation of the hashCode() method for the class you are working with. Instead of using the default implementation.
            </p>
          </InfoModal>
          <label className="flex flex-grow items-center py-2 justify-between cursor-pointer">
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
        <li className=' flex items-center'>
          <InfoModal text="Include Overwrite Equal Support :">
            <p>
            In Java, the "equals()" method is used to determine if two objects are equal based on their content rather than their memory addresses. The default implementation of equals() in the Object class performs a reference equality check, meaning it only returns true if the compared objects are the same instance in memory.
            <br/><br/>
            When you enable the "Include Overwrite Equal Support" option, it means that the code generator will automatically generate a customized implementation of the equals() method for the class you are working with. Instead of using the default implementation.
            </p>
          </InfoModal>
          <label className="flex flex-grow items-center py-2 justify-between cursor-pointer">
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
        <li className=' flex items-center'>
          <InfoModal text="Include Overwrite toString Support :">
            <p>
            In Java, the "toString()" method is a built-in method defined in the Object class and inherited by all other classes. Its purpose is to provide a string representation of an object. By default, the toString() method in the Object class returns a string that includes the class name, an "@" symbol, and the hexadecimal representation of the object's hash code.
            <br/><br/>
            When you enable the "Include Overwrite toString Support" option, it means that the code generator will automatically generate a customized implementation of the toString() method for the class you are working with. Instead of using the default implementation.
            </p>
          </InfoModal>
          <label className="flex flex-grow items-center py-2 justify-between cursor-pointer">
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
        <li className=' flex items-center'>
          <InfoModal text="Include javaDocs :">
            <p>
            Enabling this option will include the description of the properties as comments in the generated code.
            <br/><br/>
            The default value if false.
            </p>
          </InfoModal>
          <label className="flex flex-grow items-center py-2 justify-between cursor-pointer">
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
        <li className=' flex items-center'>
          <InfoModal text="Include Javax validation constraints  :">
            <p>
              By using the 'javax.validation.constraints' annotations, you can ensure that the data in your Java object adheres to specific rules and constraints. This helps in validating user input, ensuring data integrity, and facilitating error handling and validation reporting.
            </p>
          </InfoModal>
          <label className="flex flex-grow items-center py-2 justify-between cursor-pointer">
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
