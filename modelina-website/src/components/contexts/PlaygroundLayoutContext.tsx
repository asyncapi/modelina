'use client';

import { useMeasure } from '@uidotdev/usehooks';
import { createContext, useContext, useEffect, useReducer } from 'react';

import type { Dispatch, State } from '@/store/useLayoutStore';
import { initialState, playgroundLayoutReducer } from '@/store/useLayoutStore';

type PlaygroundtProviderProps = { children: React.ReactNode };

const PlaygroundtLayoutContext = createContext<
  { state: State; dispatch: Dispatch } | undefined
>(undefined);

/**
 * This component to consume Plaground Layout State.
 *
 * @returns {ReactNode} A React element that return state and update the state.
 */
function usePlaygroundLayout() {
  const context = useContext(PlaygroundtLayoutContext);

  if (context === undefined) {
    throw new Error('usePlaygroundLayout must be used within a PlaygroundLayoutProvider');
  }

  return context;
}

/**
 * This component to providing Plaground Layout State.
 *
 * @param {ReactNode} children The children element of the component.
 * @returns {ReactNode} A React element that share context state.
 */
function PlaygroundLayoutProvider({ children }: PlaygroundtProviderProps) {
  const [state, dispatch] = useReducer(playgroundLayoutReducer, initialState);
  const value = { state, dispatch };

  const [ref, { width }] = useMeasure();

  useEffect(() => {
    if (width  !== null) {
      if (width < 768) {
        dispatch({ type: 'update-device', payload: 'mobile' });
      } else if (width <= 1024) {
        dispatch({ type: 'update-device', payload: 'tablet' });
      } else if (width <= 1280) {
        dispatch({ type: 'update-device', payload: 'notebook' });
      } else {
        dispatch({ type: 'update-device', payload: 'desktop' });
      }
    }
  }, [width]);

  return (
  <PlaygroundtLayoutContext.Provider value={value}>
    <div ref={ref}>
      {children}
    </div>
  </PlaygroundtLayoutContext.Provider>
);
}

export { PlaygroundLayoutProvider, usePlaygroundLayout };
