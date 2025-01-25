import { debounce } from 'lodash';
import React, { useCallback, useContext, useEffect, useState } from 'react';

import { PlaygroundScalaConfigContext } from '@/components/contexts/PlaygroundConfigContext';
import InfoModal from '@/components/InfoModal';
import Select from '@/components/Select';

interface ScalaGeneratorOptionsProps {
  setNewConfig?: (queryKey: string, queryValue: any, updateCode?: boolean) => void;
}

interface ScalaGeneratorState {
  packageName?: string;
}

export const defaultState: ScalaGeneratorState = {};

const ScalaGeneratorOptions: React.FC<ScalaGeneratorOptionsProps> = ({ setNewConfig }) => {
  const context = useContext(PlaygroundScalaConfigContext);
  const [state, setState] = useState<ScalaGeneratorState>(defaultState);

  useEffect(() => {
    setState({ ...state, packageName: context?.scalaPackageName });
  }, [context?.scalaPackageName]);

  const debouncedSetNewConfig = debounce(
    (queryKey: string, queryValue: any) => setNewConfig?.(queryKey, queryValue),
    500
  );

  const onChangeCollectionType = (collectionType: string) => {
    setNewConfig && setNewConfig('scalaCollectionType', collectionType);
  };

  const onChangePackageName = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const packageName = event.target.value;

      setState({ ...state, packageName });
      setNewConfig && debouncedSetNewConfig('scalaPackageName', packageName);
    },
    [setNewConfig, debouncedSetNewConfig, state]
  );

  return (
    <ul className='flex flex-col'>
      <h3 className='w-full border-b border-gray-700 py-2 text-left'>Scala Specific options</h3>
      <li className='flex items-center gap-1'>
        <InfoModal text='Package Name :'>
          <p>
            In Scala, a package name is a way to organize and group related classes, objects, and traits together. It is
            a naming convention that helps prevent naming conflicts and provides a hierarchical structure to the Scala
            codebase.
          </p>
        </InfoModal>
        <label className='flex grow cursor-pointer items-center justify-between gap-1 py-2'>
          <span className='mt-1 max-w-2xl text-sm text-gray-500'>Scala Package Name</span>
          <input
            type='text'
            className='text-md form-input w-[88%] cursor-pointer rounded-md border-gray-300 font-regular text-gray-700 focus-within:text-gray-900 hover:bg-gray-50'
            name='scalaPackageName'
            value={state?.packageName}
            onChange={onChangePackageName}
          />
        </label>
      </li>
      <li className='flex items-center gap-1'>
        <InfoModal text='Scala collection type: '>
          <p>
            It indicates the collection type. Its value can be either List or Array.
            <br /> <br />
            The default value is Array.
          </p>
        </InfoModal>
        <label className='flex grow cursor-pointer items-center justify-between gap-1 py-2'>
          <span className='mt-1 max-w-2xl text-sm text-gray-500'>Scala collection type</span>
          <Select
            options={[
              { value: 'array', text: 'Array' },
              { value: 'list', text: 'List' }
            ]}
            value={context?.scalaCollectionType}
            onChange={onChangeCollectionType}
            className='shadow-outline-blue cursor-pointer'
          />
        </label>
      </li>
    </ul>
  );
};

export default ScalaGeneratorOptions;
