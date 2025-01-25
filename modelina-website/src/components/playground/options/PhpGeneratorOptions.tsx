import { debounce } from 'lodash';
import React, { useCallback, useContext, useEffect, useState } from 'react';

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
    <ul className='flex flex-col'>
      <h3 className='w-full border-b border-gray-700 py-2 text-left'>PHP Specific options</h3>
      <li className='flex items-center gap-1'>
        <InfoModal text='PHP namespace to use for generated models'>
          <p>
            In PHP namespaces are used to organize code into logical groups. It helps to avoid naming conflicts and
            allows using the same class names in different namespaces.
          </p>
        </InfoModal>
        <label className='flex grow cursor-pointer items-center justify-between gap-1 py-2'>
          <span className='mt-1 max-w-2xl text-sm text-gray-500'>Namespace</span>
          <input
            type='text'
            className='text-md form-input w-[90%] cursor-pointer rounded-md border-gray-300 font-regular text-gray-700 focus-within:text-gray-900 hover:bg-gray-50'
            name='phpNamespace'
            value={state?.namespace}
            onChange={onChangeNamespace}
          />
        </label>
      </li>
      <li className='flex items-center gap-1'>
        <InfoModal text='Include descriptions in generated models'>
          <p>
            It indicates whether the descriptions should be included in the generated code.
            <br /> <br />
            The default value is false.
          </p>
        </InfoModal>
        <label className='flex grow cursor-pointer items-center justify-between gap-1 py-2'>
          <span className='mt-1 max-w-2xl text-sm text-gray-500'>Include Descriptions</span>
          <input
            type='checkbox'
            className='form-checkbox cursor-pointer'
            name='includeDescriptions'
            checked={context?.phpIncludeDescriptions}
            onChange={onChangeIncludeDescriptions}
          />
        </label>
      </li>
    </ul>
  );
};

export default PhpGeneratorOptions;
