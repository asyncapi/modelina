'use client';

import { FunctionComponent } from 'react';
import { usePanelContext } from '../contexts/PlaygroundPanelContext';
interface ContentProps {}

export const Content: FunctionComponent<ContentProps> = () => {
  const { panel } = usePanelContext();

  const panelEnabled = panel !== '';
  return (
    <div className="flex flex-1 flex-col sm:flex-row relative bg-orange-200">
      <div className="flex w-full h-full">
        {panelEnabled ? (
          <div className={`bg-green-200 flex h-full w-[100%] sm:w-[20%]`}>
            Navigation
          </div>
        ) : null}
        <div
          className={`flex flex-col sm:flex-row h-full ${
            panelEnabled ? 'w-0 sm:w-full' : 'w-full'
          }`}
        >
          <div className="bg-yellow-200 h-full flex-auto">Editor</div>
          <div className="bg-blue-200 h-full flex-auto">Output</div>
        </div>
      </div>
    </div>
  );
};
