import { debounce } from 'lodash';
import React, { useCallback, useContext, useEffect, useState } from 'react';

import { PlaygroundJavaConfigContext } from '@/components/contexts/PlaygroundConfigContext';
import InfoModal from '@/components/InfoModal';
import Select from '@/components/Select';

interface JavaGeneratorOptionsProps {
  setNewConfig?: (queryKey: string, queryValue: any) => void;
}

interface JavaGeneratorState {
  packageName?: string;
}

export const defaultState: JavaGeneratorState = {};

const JavaGeneratorOptions: React.FC<JavaGeneratorOptionsProps> = ({ setNewConfig }) => {
  const context = useContext(PlaygroundJavaConfigContext);
  const [state, setState] = useState<JavaGeneratorState>(defaultState);

  useEffect(() => {
    setState({ ...state, packageName: context?.javaPackageName });
  }, [context?.javaPackageName]);

  const debouncedSetNewConfig = debounce(
    (queryKey: string, queryValue: any) => setNewConfig?.(queryKey, queryValue),
    500
  );

  const onChangePackageName = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const packageName = event.target.value;

      setState({ ...state, packageName });
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      setNewConfig && debouncedSetNewConfig('javaPackageName', packageName);
    },
    [setNewConfig, debouncedSetNewConfig, state]
  );

  const onChangeIncludeJackson = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setNewConfig?.('javaIncludeJackson', event.target.checked);
    },
    [setNewConfig]
  );

  const onChangeIncludeMarshaling = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setNewConfig?.('javaIncludeMarshaling', event.target.checked);
    },
    [setNewConfig]
  );

  const onChangeArrayType = useCallback(
    (arrayType: string) => {
      setNewConfig?.('javaArrayType', arrayType);
    },
    [setNewConfig]
  );

  const onChangeOverwriteHashCodeSupport = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setNewConfig?.('javaOverwriteHashcode', event.target.checked);
    },
    [setNewConfig]
  );

  const onChangeOverwriteEqualSupport = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setNewConfig?.('javaOverwriteEqual', event.target.checked);
    },
    [setNewConfig]
  );

  const onChangeOverwriteToStringSupport = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setNewConfig?.('javaOverwriteToString', event.target.checked);
    },
    [setNewConfig]
  );

  const onChangeJavaDocs = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setNewConfig?.('javaJavaDocs', event.target.checked);
    },
    [setNewConfig]
  );

  const onChangeJavaxAnnotation = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setNewConfig?.('javaJavaxAnnotation', event.target.checked);
    },
    [setNewConfig]
  );

  return (
    <ul className='flex flex-col'>
      <h3 className='w-full border-b border-gray-700 py-2 text-left'>Java Specific options</h3>
      <li className='flex items-center gap-1'>
        <InfoModal text='Package Name :'>
          <p>
            In Java, a package name is a way to organize and group related classes and interfaces. It is a naming
            convention that helps prevent naming conflicts and provides a hierarchical structure to the Java codebase.
            <br />
            <br />A package name is written as series of identifiers separated by dots (&apos;.&apos;). Each identifier
            represents a level in the package hierarchy. For example, a package name could be
            &apos;com.example.myapp&apos;.
          </p>
        </InfoModal>
        <label className='flex grow cursor-pointer items-center justify-between gap-1 py-2'>
          <span className='mt-1 max-w-2xl text-sm text-gray-500'>Package Name</span>
          <input
            type='text'
            className='text-md form-input w-[88%] cursor-pointer rounded-md border-gray-300 font-regular text-gray-700 focus-within:text-gray-900 hover:bg-gray-50'
            name='javaPackageName'
            value={state?.packageName}
            onChange={onChangePackageName}
          />
        </label>
      </li>
      <li className='flex items-center gap-1'>
        <InfoModal text='Include Jackson serialization :'>
          <p>
            When you enable the &quot;Include Jackson serialization&quot; option, it means that the code generator will
            include the necessary annotations from the Jackson library in the generated code. These annotations are used
            configure and control how Java objects are serialized to JSON and deserialized from JSON.
            <br />
            <br />
            Annotations in Java are represented by the @ symbol followed by the annotation name.
          </p>
        </InfoModal>
        <label className='flex grow cursor-pointer items-center justify-between gap-1 py-2'>
          <span className='mt-1 max-w-2xl text-sm text-gray-500'>Include Jackson serialization</span>
          <input
            type='checkbox'
            className='form-checkbox cursor-pointer'
            name='javaIncludeJackson'
            checked={context?.javaIncludeJackson}
            onChange={onChangeIncludeJackson}
          />
        </label>
      </li>
      <li className='flex items-center gap-1'>
        <InfoModal text='Include Marshaling serialization :'>
          <p>
            This option indicates whether the marshal and unmarshal functions would be included in the generated code or
            not
            <br />
            <br />
            the default value is false
            <br />
            <br />
            marshal - this function takes an instance of the class and return a JSON object.
            <br />
            <br />
            unmarshal - this function takes a JSON object and returns an instance of the class.
          </p>
        </InfoModal>
        <label className='flex grow cursor-pointer items-center justify-between gap-1 py-2'>
          <span className='mt-1 max-w-2xl text-sm text-gray-500'>Include Marshaling serialization</span>
          <input
            type='checkbox'
            className='form-checkbox cursor-pointer'
            name='javaIncludeMarshaling'
            checked={context?.javaIncludeMarshaling}
            onChange={onChangeIncludeMarshaling}
          />
        </label>
      </li>
      <li className='flex items-center gap-1'>
        <InfoModal text='Java array type :'>
          <p>
            This option allows you to switch between rendering collections as List type or Array.
            <br />
            <br />
            The default value is Array.
          </p>
        </InfoModal>
        <label className='flex grow cursor-pointer items-center justify-between gap-1 py-2'>
          <span className='mt-1 max-w-2xl text-sm text-gray-500'>Java array type</span>
          <Select
            options={[
              { value: 'List', text: 'List' },
              { value: 'Array', text: 'Array' }
            ]}
            value={context?.javaArrayType}
            onChange={onChangeArrayType}
            className='shadow-outline-blue cursor-pointer'
          />
        </label>
      </li>
      <li className='flex items-center gap-1'>
        <InfoModal text='Include Overwrite HashCode Support :'>
          <p>
            In Java, the &quot;hashCode()&quot; method is used to generate a unique numeric value (hash code) for an
            object. The default implementation of hashCode() in the Object class generates hash codes based on the
            memory address of the object, which may not be suitable for all classes.
            <br />
            <br />
            When you enable the &quot;Include Overwrite HashCode Support&quot; option, it means that the code generator
            will automatically generate a customized implementation of the hashCode() method for the class you are
            working with. Instead of using the default implementation.
          </p>
        </InfoModal>
        <label className='flex grow cursor-pointer items-center justify-between gap-1 py-2'>
          <span className='mt-1 max-w-2xl text-sm text-gray-500'>Include Overwrite HashCode Support</span>
          <input
            type='checkbox'
            className='form-checkbox cursor-pointer'
            name='csharpOverwriteHashcode'
            checked={context?.javaOverwriteHashcode}
            onChange={onChangeOverwriteHashCodeSupport}
          />
        </label>
      </li>
      <li className='flex items-center gap-1'>
        <InfoModal text='Include Overwrite Equal Support :'>
          <p>
            In Java, the &quot;equals()&quot; method is used to determine if two objects are equal based on their
            content rather than their memory addresses. The default implementation of equals() in the Object class
            performs a reference equality check, meaning it only returns true if the compared objects are the same
            instance in memory.
            <br />
            <br />
            When you enable the &quot;Include Overwrite Equal Support&quot; option, it means that the code generator
            will automatically generate a customized implementation of the equals() method for the class you are working
            with. Instead of using the default implementation.
          </p>
        </InfoModal>
        <label className='flex grow cursor-pointer items-center justify-between gap-1 py-2'>
          <span className='mt-1 max-w-2xl text-sm text-gray-500'>Include Overwrite Equal Support</span>
          <input
            type='checkbox'
            className='form-checkbox cursor-pointer'
            name='csharpOverwriteEqual'
            checked={context?.javaOverwriteEqual}
            onChange={onChangeOverwriteEqualSupport}
          />
        </label>
      </li>
      <li className='flex items-center gap-1'>
        <InfoModal text='Include Overwrite toString Support :'>
          <p>
            In Java, the &quot;toString()&quot; method is a built-in method defined in the Object class and inherited by
            all other classes. Its purpose is to provide a string representation of an object. By default, the
            toString() method in the Object class returns a string that includes the class name, an &quot;@&quot;
            symbol, and the hexadecimal representation of the object&apos;s hash code.
            <br />
            <br />
            When you enable the &quot;Include Overwrite toString Support&quot; option, it means that the code generator
            will automatically generate a customized implementation of the toString() method for the class you are
            working with. Instead of using the default implementation.
          </p>
        </InfoModal>
        <label className='flex grow cursor-pointer items-center justify-between gap-1 py-2'>
          <span className='mt-1 max-w-2xl text-sm text-gray-500'>Include Overwrite toString Support</span>
          <input
            type='checkbox'
            className='form-checkbox cursor-pointer'
            name='javaOverwriteToString'
            checked={context?.javaOverwriteToString}
            onChange={onChangeOverwriteToStringSupport}
          />
        </label>
      </li>
      <li className='flex items-center gap-1'>
        <InfoModal text='Include javaDocs :'>
          <p>
            Enabling this option will include the description of the properties as comments in the generated code.
            <br />
            <br />
            The default value if false.
          </p>
        </InfoModal>
        <label className='flex grow cursor-pointer items-center justify-between gap-1 py-2'>
          <span className='mt-1 max-w-2xl text-sm text-gray-500'>Include javaDocs</span>
          <input
            type='checkbox'
            className='form-checkbox cursor-pointer'
            name='javaJavaDocs'
            checked={context?.javaJavaDocs}
            onChange={onChangeJavaDocs}
          />
        </label>
      </li>
      <li className='flex items-center gap-1'>
        <InfoModal text='Include Javax validation constraints  :'>
          <p>
            By using the &apos;javax.validation.constraints&apos; annotations, you can ensure that the data in your Java
            object adheres to specific rules and constraints. This helps in validating user input, ensuring data
            integrity, and facilitating error handling and validation reporting.
          </p>
        </InfoModal>
        <label className='flex grow cursor-pointer items-center justify-between gap-1 py-2'>
          <span className='mt-1 max-w-2xl text-sm text-gray-500'>Include Javax validation constraints</span>
          <input
            type='checkbox'
            className='form-checkbox cursor-pointer'
            name='javaJavaxAnnotation'
            checked={context?.javaJavaxAnnotation}
            onChange={onChangeJavaxAnnotation}
          />
        </label>
      </li>
    </ul>
  );
};

export default JavaGeneratorOptions;
