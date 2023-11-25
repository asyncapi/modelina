import { FunctionComponent } from 'react';
import SplitPane from './SplitPane';
import { debounce } from '@/helpers/debounce';

interface ContentProps {}

export const Content: FunctionComponent<ContentProps> = () => {
  const explorerEnabled = true;
  const optionEnabled = true;
  const navigationEnabled = explorerEnabled || optionEnabled;
  const editorViewEnabled = true;
  const outputViewEnabled = true;

  const splitPosLeft = 'splitPos:left';
  const splitPosRight = 'splitPos:right';

  const localStorageLeftPaneSize =
    parseInt(localStorage.getItem(splitPosLeft) || '0', 10) || 220;
  const localStorageRightPaneSize =
    parseInt(localStorage.getItem(splitPosRight) || '0', 10) || '55%';

  const secondPaneSize =
    navigationEnabled && !editorViewEnabled
      ? localStorageLeftPaneSize
      : localStorageRightPaneSize;
  const secondPaneMaxSize =
    navigationEnabled && !editorViewEnabled ? 360 : '100%';

  const navigationAndEditor = (
    <SplitPane
      minSize={220}
      maxSize={360}
      pan1Style={navigationEnabled ? { overflow: 'auto' } : { width: '0px' }}
      pan2Style={editorViewEnabled ? undefined : { width: '0px' }}
      defaultSize={localStorageLeftPaneSize}
      onChange={debounce((size: string) => {
        localStorage.setItem(splitPosLeft, String(size));
      }, 100)}
    >
      <div className="bg-green-200 h-full">Navigation</div>
      <div className="bg-yellow-200 h-full">Editor</div>
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
            navigationEnabled || editorViewEnabled
              ? undefined
              : { width: '0px' }
          }
          pane2Style={
            outputViewEnabled ? { overflow: 'auto' } : { width: '0px' }
          }
          primary={outputViewEnabled ? 'first' : 'second'}
          defaultSize={localStorageRightPaneSize}
          onChange={debounce((size: string) => {
            localStorage.setItem(splitPosRight, String(size));
          }, 100)}
        >
          {navigationAndEditor}
          <div className="bg-blue-200 h-full">Output</div>
        </SplitPane>
      </div>
    </div>
  );
};
