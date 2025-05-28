import { debounce } from 'lodash';
import React, { useCallback, useContext, useEffect, useState } from 'react';

import { PlaygroundPythonConfigContext } from '@/components/contexts/PlaygroundConfigContext';
import InfoModal from '@/components/InfoModal';

interface PythonGeneratorOptionsProps {
  setNewConfig?: (queryKey: string, queryValue: any) => void;
}

interface PythonGeneratorState {
  packageName?: string;
}

export const defaultState: PythonGeneratorState = {};

const PythonGeneratorOptions: React.FC<PythonGeneratorOptionsProps> = ({ setNewConfig }) => {
  const context = useContext(PlaygroundPythonConfigContext);
  const [state, setState] = useState<PythonGeneratorState>(defaultState);

  const debouncedSetNewConfig = debounce(
    (queryKey: string, queryValue: any) => setNewConfig?.(queryKey, queryValue),
    500
  );

  useEffect(() => {
    setState({ ...state, packageName: context?.pythonPackageName });
  }, [context?.pythonPackageName]);

  const onChangePackageName = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const packageName = event.target.value;

      setState({ ...state, packageName });
      setNewConfig && debouncedSetNewConfig('pythonPackageName', packageName);
    },
    [setNewConfig, debouncedSetNewConfig, state]
  );

  return (
    <ul className='flex flex-col'>
      <h3 className='w-full border-b border-gray-700 py-2 text-left'>Python Specific options</h3>
      <li className='flex items-center gap-1'>
        <InfoModal text='Package Name :'>
          <p>
            In Python, a package name is used to organize code into logical groups or containers. It serves as a namespace
            for the code elements within it and helps in avoiding naming conflicts.
          </p>
        </InfoModal>
        <label className='flex grow cursor-pointer items-center justify-between gap-1 py-2'>
          <span className='mt-1 max-w-2xl text-sm text-gray-500'>Package Name</span>
          <input
            type='text'
            className='text-md form-input w-[90%] cursor-pointer rounded-md border-gray-300 font-regular text-gray-700 focus-within:text-gray-900 hover:bg-gray-50'
            name='pythonPackageName'
            value={state?.packageName}
            onChange={onChangePackageName}
          />
        </label>
      </li>
    </ul>
  );
};

export default PythonGeneratorOptions;
