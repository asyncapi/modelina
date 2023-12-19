import React, { useContext, useEffect, useState } from 'react';
import { debounce } from 'lodash';
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
      namespace: context?.cplusplusNamespace,
    }));
  }, [context?.cplusplusNamespace]);

  const debouncedSetNewConfig = debounce(setNewConfig || (() => { }), 500);

  const onChangeNamespace = (event: React.ChangeEvent<HTMLInputElement>) => {
    setState((prevState) => ({
      ...prevState,
      namespace: event.target.value,
    }));

    setNewConfig && debouncedSetNewConfig('cplusplusNamespace', event.target.value);
  };

  return (
    <ul className="flex flex-col">
      <h3 className="py-2 w-full text-left border-b-[1px] border-gray-700">
        C++ Specific options
      </h3>
      <li className='flex gap-1 items-center'>
        <InfoModal text="Namespace :">
          <p>
            In C++, a namespace is a feature that allows you to organize your code into logical groups or containers. It helps in avoiding naming conflicts between different parts of your code and provides a way to encapsulate related code.
          </p>
        </InfoModal>
        <label className="flex flex-grow gap-1 items-center py-2 justify-between cursor-pointer">
          <span className="mt-1 max-w-2xl text-sm text-gray-500">
            Namespace
          </span>
          <input
            type="text"
            className="form-input w-[90%] rounded-md border-gray-300 cursor-pointer font-regular text-md text-gray-700 hover:bg-gray-50 focus-within:text-gray-900"
            name="cplusplusNamespace"
            value={state.namespace}
            onChange={onChangeNamespace}
          />
        </label>
      </li>
    </ul>
  );
}

export default CplusplusGeneratorOptions;