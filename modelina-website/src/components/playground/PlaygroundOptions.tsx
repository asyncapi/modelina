import React, { useContext, useEffect, useState } from 'react';

import { PlaygroundGeneralConfigContext } from '../contexts/PlaygroundConfigContext';
import CplusplusGeneratorOptions from './options/CplusplusGeneratorOptions';
import CSharpGeneratorOptions from './options/CSharpGeneratorOptions';
import DartGeneratorOptions from './options/DartGeneratorOptions';
import GeneralOptions from './options/GeneralOptions';
import GoGeneratorOptions from './options/GoGeneratorOptions';
import JavaGeneratorOptions from './options/JavaGeneratorOptions';
import JavaScriptGeneratorOptions from './options/JavaScriptGeneratorOptions';
import KotlinGeneratorOptions from './options/KotlinGeneratorOptions';
import PhpGeneratorOptions from './options/PhpGeneratorOptions';
import PythonGeneratorOptions from './options/PythonGeneratorOptions';
import RustGeneratorOptions from './options/RustGeneratorOptions';
import ScalaGeneratorOptions from './options/ScalaGeneratorOptions';
import TypeScriptGeneratorOptions from './options/TypeScriptGeneratorOptions';

interface PlaygroundOptionsProps {
  setNewConfig?: (queryKey: string, queryValue: any) => void;
}

const PlaygroundOptions: React.FC<PlaygroundOptionsProps> = ({ setNewConfig }) => {
  const context = useContext(PlaygroundGeneralConfigContext);
  const [generatorOptions, setGeneratorOptions] = useState<React.ReactNode>(null);

  const handleLanguageChange = () => {
    switch (context?.language) {
      case 'typescript':
        setGeneratorOptions(() => <TypeScriptGeneratorOptions setNewConfig={setNewConfig} />);
        break;
      case 'javascript':
        setGeneratorOptions(<JavaScriptGeneratorOptions setNewConfig={setNewConfig} />);
        break;
      case 'csharp':
        setGeneratorOptions(<CSharpGeneratorOptions setNewConfig={setNewConfig} />);
        break;
      case 'dart':
        setGeneratorOptions(<DartGeneratorOptions setNewConfig={setNewConfig} />);
        break;
      case 'go':
        setGeneratorOptions(<GoGeneratorOptions setNewConfig={setNewConfig} />);
        break;
      case 'cplusplus':
        setGeneratorOptions(<CplusplusGeneratorOptions setNewConfig={setNewConfig} />);
        break;
      case 'java':
        setGeneratorOptions(<JavaGeneratorOptions setNewConfig={setNewConfig} />);
        break;
      case 'kotlin':
        setGeneratorOptions(<KotlinGeneratorOptions setNewConfig={setNewConfig} />);
        break;
      case 'rust':
        setGeneratorOptions(<RustGeneratorOptions setNewConfig={setNewConfig} />);
        break;
      case 'scala':
        setGeneratorOptions(<ScalaGeneratorOptions setNewConfig={setNewConfig} />);
        break;
      case 'python':
        setGeneratorOptions(<PythonGeneratorOptions setNewConfig={setNewConfig} />);
        break;
      case 'php':
        setGeneratorOptions(<PhpGeneratorOptions setNewConfig={setNewConfig} />);
        break;
      default:
        setGeneratorOptions(() => null);
        break;
    }
  };

  useEffect(() => {
    handleLanguageChange();
  }, []);

  useEffect(() => {
    handleLanguageChange();
  }, [context?.language, setNewConfig]);

  return (
    <div className='size-full overflow-y-auto rounded-b px-2'>
      <GeneralOptions setNewConfig={setNewConfig} />
      {generatorOptions}
    </div>
  );
};

export default PlaygroundOptions;
