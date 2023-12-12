import React, { useEffect, useState, useContext, useCallback } from 'react';
import { debounce } from 'lodash';
import { PlaygroundGoConfigContext } from '@/components/contexts/PlaygroundConfigContext';
import InfoModal from '@/components/InfoModal';

interface GoGeneratorOptionsProps {
  setNewConfig?: (queryKey: string, queryValue: string) => void;
}

interface GoGeneratorState {
  packageName?: string;
}

export const defaultState: GoGeneratorState = {};

const GoGeneratorOptions: React.FC<GoGeneratorOptionsProps> = ({ setNewConfig }) => {
  const context = useContext(PlaygroundGoConfigContext);
  const [state, setState] = useState<GoGeneratorState>(defaultState);

  const debouncedSetNewConfig = debounce(
    (queryKey: string, queryValue: string) => setNewConfig?.(queryKey, queryValue),
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
    <ul className="flex flex-col">
      <h3 className="py-2 w-full text-left border-b-[1px] border-gray-700">
        Go Specific options
      </h3>
      <li className='flex gap-1 items-center'>
        <InfoModal text="Package Name :">
          <p>
            In Go, a package name is used to organize code into logical groups or containers. It serves as a namespace for the code elements within it and helps in avoiding naming conflicts.
          </p>
        </InfoModal>
        <label className="flex flex-grow gap-1 items-center py-2 justify-between cursor-pointer">
          <span className="mt-1 max-w-2xl text-sm text-gray-500">
            Package Name
          </span>
          <input
            type="text"
            className="form-input w-[90%] rounded-md border-gray-300 cursor-pointer font-regular text-md text-gray-700 hover:bg-gray-50 focus-within:text-gray-900"
            name="goPackageName"
            value={state?.packageName}
            onChange={onChangePackageName}
          />
        </label>
      </li>
    </ul>
  );
};

export default GoGeneratorOptions;