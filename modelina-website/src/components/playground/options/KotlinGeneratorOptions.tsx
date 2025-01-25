import { debounce } from 'lodash';
import React, { useContext, useEffect, useState } from 'react';

import { PlaygroundKotlinConfigContext } from '@/components/contexts/PlaygroundConfigContext';
import InfoModal from '@/components/InfoModal';

interface KotlinGeneratorOptionsProps {
  setNewConfig?: (queryKey: string, queryValue: any) => void;
}

interface KotlinGeneratorState {
  packageName?: string;
}

export const defaultState: KotlinGeneratorState = {};

const KotlinGeneratorOptions: React.FC<KotlinGeneratorOptionsProps> = ({ setNewConfig }) => {
  const context = useContext(PlaygroundKotlinConfigContext);
  const [state, setState] = useState<KotlinGeneratorState>(defaultState);

  const debouncedSetNewConfig = debounce(
    (queryKey: string, queryValue: any) => setNewConfig?.(queryKey, queryValue),
    500
  );

  const onChangePackageName = (event: React.ChangeEvent<HTMLInputElement>) => {
    const packageName = event.target.value;

    setState({ ...state, packageName });
    setNewConfig && debouncedSetNewConfig('kotlinPackageName', packageName);
  };

  useEffect(() => {
    setState({ ...state, packageName: context?.kotlinPackageName });
  }, [context]);

  return (
    <ul className='flex flex-col'>
      <h3 className='w-full border-b border-gray-700 py-2 text-left'>Kotlin Specific options</h3>
      <li className='flex items-center gap-1'>
        <InfoModal text='Package Name :'>
          <p>
            In Kotlin, a package name is used to organize classes, functions, and other code elements into logical
            groups or containers. It helps in avoiding naming conflicts and provides a way to structure your code.
          </p>
        </InfoModal>
        <label className='flex grow cursor-pointer items-center justify-between gap-1 py-2'>
          <span className='mt-1 max-w-2xl text-sm text-gray-500'>Package Name</span>
          <input
            type='text'
            className='text-md form-input w-[90%] cursor-pointer rounded-md border-gray-300 font-regular text-gray-700 focus-within:text-gray-900 hover:bg-gray-50'
            name='kotlinPackageName'
            value={state?.packageName}
            onChange={onChangePackageName}
          />
        </label>
      </li>
    </ul>
  );
};

export default KotlinGeneratorOptions;
