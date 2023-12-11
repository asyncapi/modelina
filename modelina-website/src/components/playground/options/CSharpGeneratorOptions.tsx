import React from 'react';
import { PlaygroundCSharpConfigContext } from '@/components/contexts/PlaygroundConfigContext';
import Select from '@/components/Select';
import { debounce } from 'lodash';
import InfoModal from '@/components/InfoModal';

interface CSharpGeneratorOptionsProps {
  setNewConfig?: (queryKey: string, queryValue: string) => void;
}

interface CSharpGeneratorState {
  namespace?: string;
}

export const defaultState: CSharpGeneratorState = {};

class CSharpGeneratorOptions extends React.Component<
  CSharpGeneratorOptionsProps,
  CSharpGeneratorState
> {
  static contextType = PlaygroundCSharpConfigContext;
  declare context: React.ContextType<typeof PlaygroundCSharpConfigContext>;
  constructor(props: any) {
    super(props);
    this.state = defaultState;
    this.onChangeArrayType = this.onChangeArrayType.bind(this);
    this.onChangeAutoImplementProperties =
      this.onChangeAutoImplementProperties.bind(this);
    this.onChangeOverwriteHashCodeSupport =
      this.onChangeOverwriteHashCodeSupport.bind(this);
    this.onChangeIncludeJson = this.onChangeIncludeJson.bind(this);
    this.onChangeOverwriteEqualSupport =
      this.onChangeOverwriteEqualSupport.bind(this);
    this.onChangeIncludeNewtonsoft = this.onChangeIncludeNewtonsoft.bind(this);
    this.onChangeNullable = this.onChangeNullable.bind(this);
    this.onChangeNamespace = this.onChangeNamespace.bind(this);
    this.debouncedSetNewConfig = this.debouncedSetNewConfig.bind(this);
  }

  onChangeArrayType(arrayType: any) {
    if (this.props.setNewConfig) {
      this.props.setNewConfig('csharpArrayType', String(arrayType));
    }
  }

  onChangeAutoImplementProperties(event: any) {
    if (this.props.setNewConfig) {
      this.props.setNewConfig('csharpAutoImplemented', event.target.checked);
    }
  }

  onChangeOverwriteHashCodeSupport(event: any) {
    if (this.props.setNewConfig) {
      this.props.setNewConfig('csharpOverwriteHashcode', event.target.checked);
    }
  }

  onChangeIncludeJson(event: any) {
    if (this.props.setNewConfig) {
      this.props.setNewConfig('csharpIncludeJson', event.target.checked);
    }
  }

  onChangeOverwriteEqualSupport(event: any) {
    if (this.props.setNewConfig) {
      this.props.setNewConfig('csharpOverwriteEqual', event.target.checked);
    }
  }

  onChangeIncludeNewtonsoft(event: any) {
    if (this.props.setNewConfig) {
      this.props.setNewConfig('csharpIncludeNewtonsoft', event.target.checked);
    }
  }

  onChangeNullable(event: any) {
    if (this.props.setNewConfig) {
      this.props.setNewConfig('csharpNullable', event.target.checked);
    }
  }

  componentDidMount() {
    this.setState({ ...this.state, namespace: this.context?.csharpNamespace });
  }

  onChangeNamespace(event: any) {
    this.setState({ ...this.state, namespace: event.target.value });
    if (this.props.setNewConfig) {
      this.debouncedSetNewConfig('csharpNamespace', event.target.value);
    }
  }

  debouncedSetNewConfig = debounce(this.props.setNewConfig || (() => { }), 500);

  render() {
    return (
      <ul className="flex flex-col">
        <h3 className="py-2 w-full text-left border-b-[1px] border-gray-700">
          CSharp Specific options
        </h3>
        <li className="flex gap-1 items-center">
          <InfoModal text="Namespace:">
            <p className="font-regular">
              In C#, a namespace is used to organize code into logical groups
              and avoid naming conflicts. It provides a way to uniquely identify
              classes, structs, interfaces, and other types within a project. By
              specifying a namespace for the generated C# data models, you can
              control their visibility and easily reference them in other parts
              of your code.
            </p>
          </InfoModal>
          <label className="flex flex-grow gap-1 items-center py-2 justify-between cursor-pointer">
            <span className="mt-1 max-w-2xl text-sm text-gray-500">
              Namespace
            </span>
            <input
              type="text"
              className="form-input w-[90%] rounded-md border-gray-300 cursor-pointer font-regular text-md text-gray-700 hover:bg-gray-50 focus-within:text-gray-900"
              name="csharpNamespace"
              value={this.state.namespace}
              onChange={this.onChangeNamespace}
            />
          </label>
        </li>
        <li className="flex gap-1 items-center">
          <InfoModal text="C# array type:">
            <p className="font-regular">
              In C#, arrays are used to store collections of elements of the
              same type. The <strong>C# array type</strong> option
              determines how arrays are represented in the generated C# data
              models. If you choose the <strong>array</strong> type, the models will use the C# array syntax,
              such as int[] or string[].
              <br />
              <br />
              Alternatively, if you choose the <strong>List</strong> type, the
              models will use the List&lt;T&gt; class from the
              System.Collections.Generic namespace, providing additional
              functionality and flexibility for working with collections.
            </p>
          </InfoModal>
          <label className="flex flex-grow gap-1 items-center py-2 justify-between cursor-pointer">
            <span className="mt-1 max-w-2xl text-sm text-gray-500">
              C# array type
            </span>
            <Select
              options={[
                { value: 'List', text: 'List' },
                { value: 'Array', text: 'Array' }
              ]}
              value={this.context?.csharpArrayType}
              onChange={this.onChangeArrayType}
              className="shadow-outline-blue cursor-pointer"
            />
          </label>
        </li>
        <li className="flex gap-1 items-center">
          <InfoModal text="Include auto-implemented properties:">
            <p className="font-regular">
              Auto-implemented properties in C# allow you to define properties
              without explicitly writing the backing field. The compiler
              automatically generates the backing field and the get/set methods
              for you. When the <strong>Include auto-implemented properties</strong> option is
              enabled, the generated C# data models will use this simplified
              syntax for property declarations, reducing the amount of
              boilerplate code you need to write.
            </p>
          </InfoModal>
          <label className="flex flex-grow gap-1 items-center py-2 justify-between cursor-pointer">
            <span className="mt-1 max-w-2xl text-sm text-gray-500">
              Include auto-implemented properties
            </span>
            <input
              type="checkbox"
              className="form-checkbox cursor-pointer"
              name="csharpAutoImplemented"
              checked={this.context?.csharpAutoImplemented}
              onChange={this.onChangeAutoImplementProperties}
            />
          </label>
        </li>
        <li className="flex gap-1 items-center">
          <InfoModal text="Include Overwrite HashCode Support:">
            <p className="font-regular">
              In C#, the GetHashCode() method is used to generate a hash code
              for an object. This method is often overridden when you need to
              define custom equality comparisons or store objects in hash-based
              data structures. By enabling the <strong>Include Overwrite HashCode Support</strong> option, the
              generated C# data models will include support for overwriting the
              GetHashCode() method, allowing you to customize the hash code
              calculation based on the model's properties.
            </p>
          </InfoModal>
          <label className="flex flex-grow gap-1 items-center py-2 justify-between cursor-pointer">
            <span className="mt-1 max-w-2xl text-sm text-gray-500">
              Include Overwrite HashCode Support
            </span>
            <input
              type="checkbox"
              className="form-checkbox cursor-pointer"
              name="csharpOverwriteHashcode"
              checked={this.context?.csharpOverwriteHashcode}
              onChange={this.onChangeOverwriteHashCodeSupport}
            />
          </label>
        </li>
        <li className="flex gap-1 items-center">
          <InfoModal text="Include Overwrite Equal Support:">
            <p className="font-regular">
              The Equals() method in C# is used to compare two objects for
              equality. By default, it performs reference equality comparison.
              However, in certain cases, you may want to override this method to
              provide custom equality logic based on specific properties or
              criteria. Enabling the <strong>Include Overwrite Equal Support</strong> option in the
              generated C# data models includes support for overwriting the
              Equals() method, allowing you to define your own equality
              comparisons.
            </p>
          </InfoModal>
          <label className="flex flex-grow gap-1 items-center py-2 justify-between cursor-pointer">
            <span className="mt-1 max-w-2xl text-sm text-gray-500">
              Include Overwrite Equal Support
            </span>
            <input
              type="checkbox"
              className="form-checkbox cursor-pointer"
              name="csharpOverwriteEqual"
              checked={this.context?.csharpOverwriteEqual}
              onChange={this.onChangeOverwriteEqualSupport}
            />
          </label>
        </li>
        <li className="flex gap-1 items-center">
          <InfoModal text="Include JSON serialization:">
            <p className="font-regular">
              In C#, JSON serialization is the process of converting an object
              to its JSON representation and vice versa. Enabling the <strong>Include JSON serialization</strong> option in the
              generated C# data models includes the necessary attributes and
              code to facilitate JSON serialization, making it easy to serialize
              the models to JSON format or deserialize JSON data into instances
              of the models.
            </p>
          </InfoModal>
          <label className="flex flex-grow gap-1 items-center py-2 justify-between cursor-pointer">
            <span className="mt-1 max-w-2xl text-sm text-gray-500">
              Include JSON serialization
            </span>
            <input
              type="checkbox"
              className="form-checkbox cursor-pointer"
              name="csharpIncludeJson"
              checked={this.context?.csharpIncludeJson}
              onChange={this.onChangeIncludeJson}
            />
          </label>
        </li>
        <li className="flex gap-1 items-center">
          <InfoModal text="Include Newtonsoft serialization:">
            <p className="font-regular">
              Newtonsoft.Json (Json.NET) is a popular third-party JSON
              serialization library for C#. It provides advanced features and
              customization options for working with JSON data. When the <strong>Include Newtonsoft serialization</strong> option is
              enabled in the generated C# data models, the necessary attributes
              and code are included to support serialization and deserialization
              using the Json.NET library.
            </p>
          </InfoModal>
          <label className="flex flex-grow gap-1 items-center py-2 justify-between cursor-pointer">
            <span className="mt-1 max-w-2xl text-sm text-gray-500">
              Include Newtonsoft serialization
            </span>
            <input
              type="checkbox"
              className="form-checkbox cursor-pointer"
              name="csharpIncludeNewtonsoft"
              checked={this.context?.csharpIncludeNewtonsoft}
              onChange={this.onChangeIncludeNewtonsoft}
            />
          </label>
        </li>
        <li className="flex gap-1 items-center">
          <InfoModal text="Nullable:">
            <p className="font-regular">
              In C#, the nullable feature allows you to explicitly indicate
              whether a value type (such as int, bool, etc.) or a reference type
              (such as a class) can accept null values. By enabling the <strong>Nullable</strong> option in the generated C# data models,
              you allow properties to be nullable, meaning they can have a null
              value in addition to their normal value range. This provides
              flexibility when dealing with optional or unknown data values.
            </p>
          </InfoModal>
          <label className="flex flex-grow gap-1 items-center py-2 justify-between cursor-pointer">
            <span className="mt-1 max-w-2xl text-sm text-gray-500">
              Nullable
            </span>
            <input
              type="checkbox"
              className="form-checkbox cursor-pointer"
              name="csharpNullable"
              checked={this.context?.csharpNullable}
              onChange={this.onChangeNullable}
            />
          </label>
        </li>
      </ul>
    );
  }
}
export default CSharpGeneratorOptions;
