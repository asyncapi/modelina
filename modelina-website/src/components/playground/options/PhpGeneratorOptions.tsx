import React, { useState, useContext, useEffect, useCallback } from 'react';
import { debounce } from 'lodash';
import { PlaygroundPhpConfigContext } from '@/components/contexts/PlaygroundConfigContext';
import InfoModal from '@/components/InfoModal';

interface PhpGeneratorOptionsProps {
  setNewConfig?: (queryKey: string, queryValue: any) => void;
}

interface PhpGeneratorState {
  namespace?: string;
}

export const defaultState: PhpGeneratorState = {};

const PhpGeneratorOptions: React.FC<PhpGeneratorOptionsProps> = ({ setNewConfig }) => {
  const context = useContext(PlaygroundPhpConfigContext);
  const [state, setState] = useState<PhpGeneratorState>(defaultState);

  const debouncedSetNewConfig = debounce(
    (queryKey: string, queryValue: any) => setNewConfig?.(queryKey, queryValue),
    500
  );

  const onChangeIncludeDescriptions = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setNewConfig?.('phpIncludeDescriptions', event.target.checked);
    },
    [setNewConfig]
  );

  const onChangeNamespace = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const namespace = event.target.value;
      setState({ ...state, namespace });
      setNewConfig && debouncedSetNewConfig('phpNamespace', namespace);
    },
    [setNewConfig, debouncedSetNewConfig, state]
  );

  useEffect(() => {
    setState({ ...state, namespace: context?.phpNamespace });
  }, [context?.phpNamespace]);

  return (
    <ul className="flex flex-col">
      <h3 className="py-2 w-full text-left border-b-[1px] border-gray-700">
        PHP Specific options
      </h3>
      <li className='flex gap-1 items-center'>
        <InfoModal text="PHP namespace to use for generated models" >
          <p>
            In PHP namespaces are used to organize code into logical groups. It helps to avoid naming conflicts and allows using the same class names in different namespaces.
          </p>
        </InfoModal>
        <label className="flex flex-grow gap-1 items-center py-2 justify-between cursor-pointer">
          <span className="mt-1 max-w-2xl text-sm text-gray-500">
            Namespace
          </span>
          <input
            type="text"
            className="form-input w-[90%] rounded-md border-gray-300 cursor-pointer font-regular text-md text-gray-700 hover:bg-gray-50 focus-within:text-gray-900"
            name="phpNamespace"
            value={state?.namespace}
            onChange={onChangeNamespace}
          />
        </label>
      </li>
      <li className='flex gap-1 items-center'>
        <InfoModal text="Include descriptions in generated models" >
          <p>
            It indicates whether the descriptions should be included in the generated code.
            <br /> <br />
            The default value is false.
          </p>
        </InfoModal>
        <label className="flex flex-grow gap-1 items-center py-2 justify-between cursor-pointer">
          <span className="mt-1 max-w-2xl text-sm text-gray-500">
            Include Descriptions
          </span>
          <input
            type="checkbox"
            className="form-checkbox cursor-pointer"
            name="includeDescriptions"
            checked={context?.phpIncludeDescriptions}
            onChange={onChangeIncludeDescriptions}
          />
        </label>
      </li>
    </ul>
  );
};

export default PhpGeneratorOptions;
