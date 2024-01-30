import React, { useCallback, useContext, useEffect, useState } from 'react';
import Select from '@/components/Select';
import { PlaygroundScalaConfigContext } from '@/components/contexts/PlaygroundConfigContext';
import InfoModal from '@/components/InfoModal';
import { debounce } from 'lodash';

interface ScalaGeneratorOptionsProps {
  setNewConfig?: (
    queryKey: string,
    queryValue: any,
    updateCode?: boolean
  ) => void;
}

interface ScalaGeneratorState {
  packageName?: string;
}

export const defaultState: ScalaGeneratorState = {};

const ScalaGeneratorOptions: React.FC<ScalaGeneratorOptionsProps> = ({
  setNewConfig
}) => {
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
    <ul className="flex flex-col">
      <h3 className="py-2 w-full text-left border-b-[1px] border-gray-700">
        Scala Specific options
      </h3>
      <li className="flex gap-1 items-center">
        <InfoModal text="Package Name :">
          <p>
            In Scala, a package name is a way to organize and group related
            classes, objects, and traits together. It is a naming convention
            that helps prevent naming conflicts and provides a hierarchical
            structure to the Scala codebase.
          </p>
        </InfoModal>
        <label className="flex flex-grow gap-1 items-center py-2 justify-between cursor-pointer">
          <span className="mt-1 max-w-2xl text-sm text-gray-500">
            Scala Package Name
          </span>
          <input
            type="text"
            className="form-input w-[88%] rounded-md border-gray-300 cursor-pointer font-regular text-md text-gray-700 hover:bg-gray-50 focus-within:text-gray-900"
            name="scalaPackageName"
            value={state?.packageName}
            onChange={onChangePackageName}
          />
        </label>
      </li>
      <li className="flex gap-1 items-center">
        <InfoModal text="Scala collection type: ">
          <p>
            It indicates the collection type. Its value can be either List or
            Array.
            <br /> <br />
            The default value is Array.
          </p>
        </InfoModal>
        <label className="flex flex-grow gap-1 items-center py-2 justify-between cursor-pointer">
          <span className="mt-1 max-w-2xl text-sm text-gray-500">
            Scala collection type
          </span>
          <Select
            options={[
              { value: 'array', text: 'Array' },
              { value: 'list', text: 'List' }
            ]}
            value={context?.scalaCollectionType}
            onChange={onChangeCollectionType}
            className="shadow-outline-blue cursor-pointer"
          />
        </label>
      </li>
    </ul>
  );
};

export default ScalaGeneratorOptions;
