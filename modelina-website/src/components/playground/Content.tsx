'use client';

import { FunctionComponent } from 'react';
import SplitPane from './SplitPane';
import { debounce } from '@/helpers/debounce';
import { usePanelContext } from '../contexts/PlaygroundPanelContext';
interface ContentProps {}

export const Content: FunctionComponent<ContentProps> = () => {
  const splitPosLeft = 'splitPos:left';
  const splitPosRight = 'splitPos:right';

  // const localStorageLeftPaneSize =
  //   parseInt(localStorage.getItem(splitPosLeft) || '0', 10) || 220;
  // const localStorageRightPaneSize =
  //   parseInt(localStorage.getItem(splitPosRight) || '0', 10) || '55%';

  const localStorageLeftPaneSize = 220;
  const localStorageRightPaneSize = '55%';

  const { panel } = usePanelContext();

  const panelEnabled = panel !== '';
  const editorViewEnabled = true;
  const outputViewEnabled = true;

  const secondPaneSize =
    panelEnabled && !editorViewEnabled
      ? localStorageLeftPaneSize
      : localStorageRightPaneSize;
  const secondPaneMaxSize = panelEnabled && !editorViewEnabled ? 360 : '100%';

  const handleLeftPaneChange = debounce((size: string) => {
    localStorage.setItem(splitPosLeft, String(size));
  }, 100);

  const handleRightPaneChange = debounce((size: string) => {
    localStorage.setItem(splitPosRight, String(size));
  }, 100);

  const navigationAndEditor =
    panel === '' ? (
      <div className="bg-yellow-200 w-full h-full">Editor</div>
    ) : (
      <SplitPane
        minSize={220}
        maxSize={360}
        pan1Style={panelEnabled ? { overflow: 'auto' } : { width: '0px' }}
        pan2Style={editorViewEnabled ? undefined : { width: '0px' }}
        defaultSize={localStorageLeftPaneSize}
        onChange={handleLeftPaneChange}
      >
        {panel !== '' ? (
          <div className={`bg-green-200 h-full`}>Navigation</div>
        ) : null}
        <div className="bg-yellow-200 w-full h-full">Editor</div>
      </SplitPane>
    );
  return (
    <div className="flex flex-1 flex-row relative">
      <div className="flex flex-1 flex-row relative">
        <SplitPane
          size={outputViewEnabled ? secondPaneSize : 0}
          minSize={0}
          maxSize={secondPaneMaxSize}
          pane1Style={
            panelEnabled || editorViewEnabled ? undefined : { width: '0px' }
          }
          pane2Style={
            outputViewEnabled ? { overflow: 'auto' } : { width: '0px' }
          }
          primary={outputViewEnabled ? 'first' : 'second'}
          defaultSize={localStorageRightPaneSize}
          onChange={handleRightPaneChange}
        >
          {navigationAndEditor}
          <div className="bg-blue-200 h-full">Output</div>
        </SplitPane>
      </div>
    </div>
  );
};
