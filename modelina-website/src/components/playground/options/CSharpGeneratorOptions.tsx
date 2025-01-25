import { debounce } from 'lodash';
import React, { useContext, useEffect, useState } from 'react';

import { PlaygroundCSharpConfigContext } from '@/components/contexts/PlaygroundConfigContext';
import InfoModal from '@/components/InfoModal';
import Select from '@/components/Select';

interface CSharpGeneratorOptionsProps {
  setNewConfig?: (queryKey: string, queryValue: any) => void;
}

interface CSharpGeneratorState {
  namespace?: string;
}

export const defaultState: CSharpGeneratorState = {};

const CSharpGeneratorOptions: React.FC<CSharpGeneratorOptionsProps> = ({ setNewConfig }) => {
  const context = useContext(PlaygroundCSharpConfigContext);
  const [state, setState] = useState<CSharpGeneratorState>(defaultState);

  useEffect(() => {
    setState((prevState) => ({
      ...prevState,
      namespace: context?.csharpNamespace
    }));
  }, [context?.csharpNamespace]);

  const debouncedSetNewConfig = debounce(setNewConfig || (() => {}), 500);

  const onChangeArrayType = (arrayType: any) => {
    setNewConfig?.('csharpArrayType', String(arrayType));
  };

  const onChangeAutoImplementProperties = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewConfig?.('csharpAutoImplemented', event.target.checked);
  };

  const onChangeOverwriteHashCodeSupport = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewConfig?.('csharpOverwriteHashcode', event.target.checked);
  };

  const onChangeIncludeJson = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewConfig?.('csharpIncludeJson', event.target.checked);
  };

  const onChangeOverwriteEqualSupport = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewConfig?.('csharpOverwriteEqual', event.target.checked);
  };

  const onChangeIncludeNewtonsoft = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewConfig?.('csharpIncludeNewtonsoft', event.target.checked);
  };

  const onChangeNullable = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewConfig?.('csharpNullable', event.target.checked);
  };

  const onChangeNamespace = (event: React.ChangeEvent<HTMLInputElement>) => {
    setState({ ...state, namespace: event.target.value });
    setNewConfig && debouncedSetNewConfig('csharpNamespace', event.target.value);
  };

  return (
    <ul className='flex flex-col'>
      <h3 className='w-full border-b border-gray-700 py-2 text-left'>CSharp Specific options</h3>
      <li className='flex items-center gap-1'>
        <InfoModal text='Namespace:'>
          <p className='font-regular'>
            In C#, a namespace is used to organize code into logical groups and avoid naming conflicts. It provides a
            way to uniquely identify classes, structs, interfaces, and other types within a project. By specifying a
            namespace for the generated C# data models, you can control their visibility and easily reference them in
            other parts of your code.
          </p>
        </InfoModal>
        <label className='flex grow cursor-pointer items-center justify-between gap-1 py-2'>
          <span className='mt-1 max-w-2xl text-sm text-gray-500'>Namespace</span>
          <input
            type='text'
            className='text-md form-input w-[90%] cursor-pointer rounded-md border-gray-300 font-regular text-gray-700 focus-within:text-gray-900 hover:bg-gray-50'
            name='csharpNamespace'
            value={state.namespace}
            onChange={onChangeNamespace}
          />
        </label>
      </li>
      <li className='flex items-center gap-1'>
        <InfoModal text='C# array type:'>
          <p className='font-regular'>
            In C#, arrays are used to store collections of elements of the same type. The <strong>C# array type</strong>{' '}
            option determines how arrays are represented in the generated C# data models. If you choose the{' '}
            <strong>array</strong> type, the models will use the C# array syntax, such as int[] or string[].
            <br />
            <br />
            Alternatively, if you choose the <strong>List</strong> type, the models will use the List&lt;T&gt; class
            from the System.Collections.Generic namespace, providing additional functionality and flexibility for
            working with collections.
          </p>
        </InfoModal>
        <label className='flex grow cursor-pointer items-center justify-between gap-1 py-2'>
          <span className='mt-1 max-w-2xl text-sm text-gray-500'>C# array type</span>
          <Select
            options={[
              { value: 'List', text: 'List' },
              { value: 'Array', text: 'Array' }
            ]}
            value={context?.csharpArrayType}
            onChange={onChangeArrayType}
            className='shadow-outline-blue cursor-pointer'
          />
        </label>
      </li>
      <li className='flex items-center gap-1'>
        <InfoModal text='Include auto-implemented properties:'>
          <p className='font-regular'>
            Auto-implemented properties in C# allow you to define properties without explicitly writing the backing
            field. The compiler automatically generates the backing field and the get/set methods for you. When the{' '}
            <strong>Include auto-implemented properties</strong> option is enabled, the generated C# data models will
            use this simplified syntax for property declarations, reducing the amount of boilerplate code you need to
            write.
          </p>
        </InfoModal>
        <label className='flex grow cursor-pointer items-center justify-between gap-1 py-2'>
          <span className='mt-1 max-w-2xl text-sm text-gray-500'>Include auto-implemented properties</span>
          <input
            type='checkbox'
            className='form-checkbox cursor-pointer'
            name='csharpAutoImplemented'
            checked={context?.csharpAutoImplemented}
            onChange={onChangeAutoImplementProperties}
          />
        </label>
      </li>
      <li className='flex items-center gap-1'>
        <InfoModal text='Include Overwrite HashCode Support:'>
          <p className='font-regular'>
            In C#, the GetHashCode() method is used to generate a hash code for an object. This method is often
            overridden when you need to define custom equality comparisons or store objects in hash-based data
            structures. By enabling the <strong>Include Overwrite HashCode Support</strong> option, the generated C#
            data models will include support for overwriting the GetHashCode() method, allowing you to customize the
            hash code calculation based on the model&apos;s properties.
          </p>
        </InfoModal>
        <label className='flex grow cursor-pointer items-center justify-between gap-1 py-2'>
          <span className='mt-1 max-w-2xl text-sm text-gray-500'>Include Overwrite HashCode Support</span>
          <input
            type='checkbox'
            className='form-checkbox cursor-pointer'
            name='csharpOverwriteHashcode'
            checked={context?.csharpOverwriteHashcode}
            onChange={onChangeOverwriteHashCodeSupport}
          />
        </label>
      </li>
      <li className='flex items-center gap-1'>
        <InfoModal text='Include Overwrite Equal Support:'>
          <p className='font-regular'>
            The Equals() method in C# is used to compare two objects for equality. By default, it performs reference
            equality comparison. However, in certain cases, you may want to override this method to provide custom
            equality logic based on specific properties or criteria. Enabling the{' '}
            <strong>Include Overwrite Equal Support</strong> option in the generated C# data models includes support for
            overwriting the Equals() method, allowing you to define your own equality comparisons.
          </p>
        </InfoModal>
        <label className='flex grow cursor-pointer items-center justify-between gap-1 py-2'>
          <span className='mt-1 max-w-2xl text-sm text-gray-500'>Include Overwrite Equal Support</span>
          <input
            type='checkbox'
            className='form-checkbox cursor-pointer'
            name='csharpOverwriteEqual'
            checked={context?.csharpOverwriteEqual}
            onChange={onChangeOverwriteEqualSupport}
          />
        </label>
      </li>
      <li className='flex items-center gap-1'>
        <InfoModal text='Include JSON serialization:'>
          <p className='font-regular'>
            In C#, JSON serialization is the process of converting an object to its JSON representation and vice versa.
            Enabling the <strong>Include JSON serialization</strong> option in the generated C# data models includes the
            necessary attributes and code to facilitate JSON serialization, making it easy to serialize the models to
            JSON format or deserialize JSON data into instances of the models.
          </p>
        </InfoModal>
        <label className='flex grow cursor-pointer items-center justify-between gap-1 py-2'>
          <span className='mt-1 max-w-2xl text-sm text-gray-500'>Include JSON serialization</span>
          <input
            type='checkbox'
            className='form-checkbox cursor-pointer'
            name='csharpIncludeJson'
            checked={context?.csharpIncludeJson}
            onChange={onChangeIncludeJson}
          />
        </label>
      </li>
      <li className='flex items-center gap-1'>
        <InfoModal text='Include Newtonsoft serialization:'>
          <p className='font-regular'>
            Newtonsoft.Json (Json.NET) is a popular third-party JSON serialization library for C#. It provides advanced
            features and customization options for working with JSON data. When the{' '}
            <strong>Include Newtonsoft serialization</strong> option is enabled in the generated C# data models, the
            necessary attributes and code are included to support serialization and deserialization using the Json.NET
            library.
          </p>
        </InfoModal>
        <label className='flex grow cursor-pointer items-center justify-between gap-1 py-2'>
          <span className='mt-1 max-w-2xl text-sm text-gray-500'>Include Newtonsoft serialization</span>
          <input
            type='checkbox'
            className='form-checkbox cursor-pointer'
            name='csharpIncludeNewtonsoft'
            checked={context?.csharpIncludeNewtonsoft}
            onChange={onChangeIncludeNewtonsoft}
          />
        </label>
      </li>
      <li className='flex items-center gap-1'>
        <InfoModal text='Nullable:'>
          <p className='font-regular'>
            In C#, the nullable feature allows you to explicitly indicate whether a value type (such as int, bool, etc.)
            or a reference type (such as a class) can accept null values. By enabling the <strong>Nullable</strong>{' '}
            option in the generated C# data models, you allow properties to be nullable, meaning they can have a null
            value in addition to their normal value range. This provides flexibility when dealing with optional or
            unknown data values.
          </p>
        </InfoModal>
        <label className='flex grow cursor-pointer items-center justify-between gap-1 py-2'>
          <span className='mt-1 max-w-2xl text-sm text-gray-500'>Nullable</span>
          <input
            type='checkbox'
            className='form-checkbox cursor-pointer'
            name='csharpNullable'
            checked={context?.csharpNullable}
            onChange={onChangeNullable}
          />
        </label>
      </li>
    </ul>
  );
};

export default CSharpGeneratorOptions;
