import { debounce } from 'lodash';
import React, { useContext, useEffect, useState } from 'react';

import { PlaygroundCplusplusConfigContext } from '@/components/contexts/PlaygroundConfigContext';
import InfoModal from '@/components/InfoModal';

interface CplusplusGeneratorOptionsProps {
  setNewConfig?: (queryKey: string, queryValue: any) => void;
}

interface CplusplusGeneratorState {
  namespace?: string;
}

export const defaultState: CplusplusGeneratorState = {};

const CplusplusGeneratorOptions: React.FC<CplusplusGeneratorOptionsProps> = ({ setNewConfig }) => {
  const context = useContext(PlaygroundCplusplusConfigContext);
  const [state, setState] = useState<CplusplusGeneratorState>(defaultState);

  useEffect(() => {
    setState((prevState) => ({
      ...prevState,
      namespace: context?.cplusplusNamespace
    }));
  }, [context?.cplusplusNamespace]);

  const debouncedSetNewConfig = debounce(setNewConfig || (() => {}), 500);

  const onChangeNamespace = (event: React.ChangeEvent<HTMLInputElement>) => {
    setState((prevState) => ({
      ...prevState,
      namespace: event.target.value
    }));

    setNewConfig && debouncedSetNewConfig('cplusplusNamespace', event.target.value);
  };

  return (
    <ul className='flex flex-col'>
      <h3 className='w-full border-b border-gray-700 py-2 text-left'>C++ Specific options</h3>
      <li className='flex items-center gap-1'>
        <InfoModal text='Namespace :'>
          <p>
            In C++, a namespace is a feature that allows you to organize your code into logical groups or containers. It
            helps in avoiding naming conflicts between different parts of your code and provides a way to encapsulate
            related code.
          </p>
        </InfoModal>
        <label className='flex grow cursor-pointer items-center justify-between gap-1 py-2'>
          <span className='mt-1 max-w-2xl text-sm text-gray-500'>Namespace</span>
          <input
            type='text'
            className='text-md form-input w-[90%] cursor-pointer rounded-md border-gray-300 font-regular text-gray-700 focus-within:text-gray-900 hover:bg-gray-50'
            name='cplusplusNamespace'
            value={state.namespace}
            onChange={onChangeNamespace}
          />
        </label>
      </li>
    </ul>
  );
};

export default CplusplusGeneratorOptions;
