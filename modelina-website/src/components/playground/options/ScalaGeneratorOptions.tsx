import React from 'react';
import { PlaygroundScalaConfigContext } from '@/components/contexts/PlaygroundConfigContext';
import InfoModal from '@/components/InfoModal';

interface ScalaGeneratorState {
  packageName?: string;
}

export const defaultState: ScalaGeneratorState = {};

const ScalaGeneratorOptions = () => {
  return (
    <div>
      Hello
    </div>
  )
}

export default ScalaGeneratorOptions
