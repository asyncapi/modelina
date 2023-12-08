import React, { useContext, useEffect } from 'react';
import { PlaygroundGeneralConfigContext } from '../contexts/PlaygroundConfigContext';
import TypeScriptGeneratorOptions from './options/TypeScriptGeneratorOptions';
import GeneralOptions from './options/GeneralOptions';
import JavaScriptGeneratorOptions from './options/JavaScriptGeneratorOptions';
import CSharpGeneratorOptions from './options/CSharpGeneratorOptions';
import DartGeneratorOptions from './options/DartGeneratorOptions';
import GoGeneratorOptions from './options/GoGeneratorOptions';
import JavaGeneratorOptions from './options/JavaGeneratorOptions';
import KotlinGeneratorOptions from './options/KotlinGeneratorOptions';
import RustGeneratorOptions from './options/RustGeneratorOptions';
import PythonGeneratorOptions from './options/PythonGeneratorOptions';
import CplusplusGeneratorOptions from './options/CplusplusGeneratorOptions';
import PhpGeneratorOptions from './options/PhpGeneratorOptions';

interface PlaygroundOptionsProps {
  setNewConfig?: (queryKey: string, queryValue: string) => void;
}

const PlaygroundOptions: React.FC<PlaygroundOptionsProps> = ({ setNewConfig }) => {
  const context = useContext(PlaygroundGeneralConfigContext);

  let generatorOptions;
  const handleLanguageChange = () => {
    switch (context?.language) {
      case 'typescript':
        generatorOptions = <TypeScriptGeneratorOptions setNewConfig={setNewConfig} />;
        break;
      case 'javascript':
        generatorOptions = <JavaScriptGeneratorOptions setNewConfig={setNewConfig} />;
        break;
      case 'csharp':
        generatorOptions = <CSharpGeneratorOptions setNewConfig={setNewConfig} />;
        break;
      case 'dart':
        generatorOptions = <DartGeneratorOptions setNewConfig={setNewConfig} />;
        break;
      case 'go':
        generatorOptions = <GoGeneratorOptions setNewConfig={setNewConfig} />;
        break;
      case 'cplusplus':
        generatorOptions = <CplusplusGeneratorOptions setNewConfig={setNewConfig} />;
        break;
      case 'java':
        generatorOptions = <JavaGeneratorOptions setNewConfig={setNewConfig} />;
        break;
      case 'kotlin':
        generatorOptions = <KotlinGeneratorOptions setNewConfig={setNewConfig} />;
        break;
      case 'rust':
        generatorOptions = <RustGeneratorOptions setNewConfig={setNewConfig} />;
        break;
      case 'python':
        generatorOptions = <PythonGeneratorOptions setNewConfig={setNewConfig} />;
        break;
      case 'php':
        generatorOptions = <PhpGeneratorOptions setNewConfig={setNewConfig} />;
        break;
      default:
        generatorOptions = null;
        break;
    }
  }

  handleLanguageChange();

  useEffect(() => {
    handleLanguageChange();
    console.log(context?.language);
  }, [context?.language]);

  return (
    <div className="px-1 rounded-b shadow-lg overflow-y-auto">
      <GeneralOptions setNewConfig={setNewConfig} />
      {generatorOptions}
    </div>
  );
};

export default PlaygroundOptions;
