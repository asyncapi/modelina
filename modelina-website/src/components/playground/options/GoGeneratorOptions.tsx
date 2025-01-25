import { debounce } from 'lodash';
import React, { useCallback, useContext, useEffect, useState } from 'react';

import { PlaygroundGoConfigContext } from '@/components/contexts/PlaygroundConfigContext';
import InfoModal from '@/components/InfoModal';

interface GoGeneratorOptionsProps {
  setNewConfig?: (queryKey: string, queryValue: any) => void;
}

interface GoGeneratorState {
  packageName?: string;
}

export const defaultState: GoGeneratorState = {};

const GoGeneratorOptions: React.FC<GoGeneratorOptionsProps> = ({ setNewConfig }) => {
  const context = useContext(PlaygroundGoConfigContext);
  const [state, setState] = useState<GoGeneratorState>(defaultState);

  const debouncedSetNewConfig = debounce(
    (queryKey: string, queryValue: any) => setNewConfig?.(queryKey, queryValue),
    500
  );

  useEffect(() => {
    setState({ ...state, packageName: context?.goPackageName });
  }, [context?.goPackageName]);

  const onChangePackageName = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const packageName = event.target.value;

      setState({ ...state, packageName });
      setNewConfig && debouncedSetNewConfig('goPackageName', packageName);
    },
    [setNewConfig, debouncedSetNewConfig, state]
  );

  return (
    <ul className='flex flex-col'>
      <h3 className='w-full border-b border-gray-700 py-2 text-left'>Go Specific options</h3>
      <li className='flex items-center gap-1'>
        <InfoModal text='Package Name :'>
          <p>
            In Go, a package name is used to organize code into logical groups or containers. It serves as a namespace
            for the code elements within it and helps in avoiding naming conflicts.
          </p>
        </InfoModal>
        <label className='flex grow cursor-pointer items-center justify-between gap-1 py-2'>
          <span className='mt-1 max-w-2xl text-sm text-gray-500'>Package Name</span>
          <input
            type='text'
            className='text-md form-input w-[90%] cursor-pointer rounded-md border-gray-300 font-regular text-gray-700 focus-within:text-gray-900 hover:bg-gray-50'
            name='goPackageName'
            value={state?.packageName}
            onChange={onChangePackageName}
          />
        </label>
      </li>
    </ul>
  );
};

export default GoGeneratorOptions;
