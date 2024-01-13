import React, { useContext, useEffect, useState } from 'react';
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
import ScalaGeneratorOptions from './options/ScalaGeneratorOptions';

interface PlaygroundOptionsProps {
  setNewConfig?: (queryKey: string, queryValue: any) => void;
}

const PlaygroundOptions: React.FC<PlaygroundOptionsProps> = ({
  setNewConfig
}) => {
  const context = useContext(PlaygroundGeneralConfigContext);
  const [generatorOptions, setGeneratorOptions] =
    useState<React.ReactNode>(null);

  const handleLanguageChange = () => {
    switch (context?.language) {
      case 'typescript':
        setGeneratorOptions((prevOptions) => (
          <TypeScriptGeneratorOptions setNewConfig={setNewConfig} />
        ));
        break;
      case 'javascript':
        setGeneratorOptions(
          <JavaScriptGeneratorOptions setNewConfig={setNewConfig} />
        );
        break;
      case 'csharp':
        setGeneratorOptions(
          <CSharpGeneratorOptions setNewConfig={setNewConfig} />
        );
        break;
      case 'dart':
        setGeneratorOptions(
          <DartGeneratorOptions setNewConfig={setNewConfig} />
        );
        break;
      case 'go':
        setGeneratorOptions(<GoGeneratorOptions setNewConfig={setNewConfig} />);
        break;
      case 'cplusplus':
        setGeneratorOptions(
          <CplusplusGeneratorOptions setNewConfig={setNewConfig} />
        );
        break;
      case 'java':
        setGeneratorOptions(
          <JavaGeneratorOptions setNewConfig={setNewConfig} />
        );
        break;
      case 'kotlin':
        setGeneratorOptions(
          <KotlinGeneratorOptions setNewConfig={setNewConfig} />
        );
        break;
      case 'rust':
        setGeneratorOptions(
          <RustGeneratorOptions setNewConfig={setNewConfig} />
        );
        break;
      case 'python':
        setGeneratorOptions(
          <PythonGeneratorOptions setNewConfig={setNewConfig} />
        );
        break;
      case 'php':
        setGeneratorOptions(
          <PhpGeneratorOptions setNewConfig={setNewConfig} />
        );
        break;
      case 'scala':
        setGeneratorOptions(
          <ScalaGeneratorOptions setNewConfig={setNewConfig} />
        );
        break;
      default:
        setGeneratorOptions((prevOptions) => null);
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
    <div className="w-full h-full px-2 rounded-b overflow-y-auto">
      <GeneralOptions setNewConfig={setNewConfig} />
      {generatorOptions}
    </div>
  );
};

export default PlaygroundOptions;
