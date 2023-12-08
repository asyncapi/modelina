import React from "react";
import {
  PlaygroundTypeScriptConfigContext,
  PlaygroundCSharpConfigContext,
  PlaygroundDartConfigContext,
  PlaygroundGoConfigContext,
  PlaygroundJavaConfigContext,
  PlaygroundJavaScriptConfigContext,
  PlaygroundKotlinConfigContext,
  PlaygroundPythonConfigContext,
  PlaygroundRustConfigContext,
  PlaygroundCplusplusConfigContext,
  PlaygroundGeneralConfigContext,
  PlaygroundPhpConfigContext
} from '../contexts/PlaygroundConfigContext';
import { usePlaygroundContext } from "../contexts/PlaygroundContext";
import PlaygroundOptions from './PlaygroundOptions';

interface OptionsNavigationProps {
  setNewConfig: (config: string, configValue: any, updateCode?: boolean) => void;
}

export const OptionsNavigation: React.FunctionComponent<OptionsNavigationProps> = ({ setNewConfig }) => {
  const { config } = usePlaygroundContext();
  return (
    <div className="options w-full h-full overflow-y-auto">
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
                            <PlaygroundPythonConfigContext.Provider value={config}>
                              <PlaygroundOptions setNewConfig={setNewConfig} />
                            </PlaygroundPythonConfigContext.Provider>
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
  )
}
