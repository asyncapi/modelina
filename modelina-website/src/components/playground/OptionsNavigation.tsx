import React from 'react';

import {
  PlaygroundCplusplusConfigContext,
  PlaygroundCSharpConfigContext,
  PlaygroundDartConfigContext,
  PlaygroundGeneralConfigContext,
  PlaygroundGoConfigContext,
  PlaygroundJavaConfigContext,
  PlaygroundJavaScriptConfigContext,
  PlaygroundKotlinConfigContext,
  PlaygroundPhpConfigContext,
  PlaygroundPythonConfigContext,
  PlaygroundRustConfigContext,
  PlaygroundScalaConfigContext,
  PlaygroundTypeScriptConfigContext
} from '../contexts/PlaygroundConfigContext';
import { usePlaygroundContext } from '../contexts/PlaygroundContext';
import PlaygroundOptions from './PlaygroundOptions';

interface OptionsNavigationProps {
  setNewConfig: (config: string, configValue: any, updateCode?: boolean) => void;
}

export const OptionsNavigation: React.FunctionComponent<OptionsNavigationProps> = ({ setNewConfig }) => {
  const { config } = usePlaygroundContext();

  return (
    <div className='options size-full overflow-y-auto'>
      <PlaygroundGeneralConfigContext.Provider value={config}>
        <PlaygroundTypeScriptConfigContext.Provider value={config}>
          <PlaygroundJavaScriptConfigContext.Provider value={config}>
            <PlaygroundCSharpConfigContext.Provider value={config}>
              <PlaygroundDartConfigContext.Provider value={config}>
                <PlaygroundGoConfigContext.Provider value={config}>
                  <PlaygroundJavaConfigContext.Provider value={config}>
                    <PlaygroundPhpConfigContext.Provider value={config}>
                      <PlaygroundCplusplusConfigContext.Provider value={config}>
                        <PlaygroundKotlinConfigContext.Provider value={config}>
                          <PlaygroundRustConfigContext.Provider value={config}>
                            <PlaygroundScalaConfigContext.Provider value={config}>
                              <PlaygroundPythonConfigContext.Provider value={config}>
                                <PlaygroundOptions setNewConfig={setNewConfig} />
                              </PlaygroundPythonConfigContext.Provider>
                            </PlaygroundScalaConfigContext.Provider>
                          </PlaygroundRustConfigContext.Provider>
                        </PlaygroundKotlinConfigContext.Provider>
                      </PlaygroundCplusplusConfigContext.Provider>
                    </PlaygroundPhpConfigContext.Provider>
                  </PlaygroundJavaConfigContext.Provider>
                </PlaygroundGoConfigContext.Provider>
              </PlaygroundDartConfigContext.Provider>
            </PlaygroundCSharpConfigContext.Provider>
          </PlaygroundJavaScriptConfigContext.Provider>
        </PlaygroundTypeScriptConfigContext.Provider>
      </PlaygroundGeneralConfigContext.Provider>
    </div>
  );
};
