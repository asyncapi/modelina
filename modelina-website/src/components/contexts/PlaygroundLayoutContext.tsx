'use client';

import { useMeasure } from '@uidotdev/usehooks';
import type { Draft, Immutable } from 'immer';
import { enableMapSet, produce } from 'immer';
import { createContext, useContext, useEffect, useReducer } from 'react';
import { IoOptionsOutline } from 'react-icons/io5';
import { LuFileInput, LuFileOutput } from 'react-icons/lu';
import { VscListSelection } from 'react-icons/vsc';

interface ISidebarItem {
  name: string;
  title: string;
  isOpen: boolean;
  devices: 'mobile' | 'tablet' | 'desktop' | 'all' ;
  icon: React.ReactNode;
  tooltip: string;
}

const sidebarItems: Map<string, ISidebarItem> = new Map([
  [
    'input-editor', {
      name: 'input-editor',
      title: 'Input Editor',
      isOpen: true,
      devices: 'mobile',
      icon: <LuFileInput className='size-5' />,
      tooltip: 'Show Input Editor'
    }
  ],
  [
    'output-editor',   {
      name: 'output-editor',
      title: 'Output Editor',
      isOpen: false,
      devices: 'mobile',
      icon: <LuFileOutput className='size-5' />,
      tooltip: 'Show Output Editor'
    }
  ],
  [
    'general-options',    {
      name: 'general-options',
      title: 'Options',
      isOpen: true,
      devices: 'all',
      icon: <IoOptionsOutline className='size-5' />,
      tooltip: 'Show or hide all the options'
    }
  ],
  [
    'output-options', {
      name: 'output-options',
      title: 'Output',
      isOpen: false,
      devices: 'all',
      icon: <VscListSelection className='size-5' />,
      tooltip: 'Show or hide the list of output models'
    }
  ]
]);

type IDeviceType = 'mobile' | 'tablet' | 'notebook' | 'desktop';

type ActionType = { type: 'open-option', name: string } | { type: 'update-device', payload: IDeviceType } | { type: '' };
type Dispatch = (action: ActionType) => void;
type State = Immutable<{  open: string, device: IDeviceType, sidebarItems: typeof sidebarItems }>;
type PlaygroundtProviderProps = { children: React.ReactNode };

const initialState: State = { open: 'general-options', device: 'desktop', sidebarItems };

const PlaygroundtLayoutContext = createContext<
  { state: State; dispatch: Dispatch } | undefined
>(undefined);

const playgroundLayoutReducer = produce<State, [ActionType]>((draft: Draft<State>, action) => {
  enableMapSet();

  switch (action.type) {
    case 'update-device': {
      // eslint-disable-next-line no-param-reassign
      draft.device = action.payload;
      break;
    }
    case 'open-option': {
      const findOpts = draft.sidebarItems.get(action.name);

      const alwaysOpen = ['input-editor', 'output-editor', 'general-options'];
      const isMobile = draft.device === 'mobile';

      if (!findOpts) {
        break;
      }

      if (alwaysOpen.includes(action.name) && isMobile) {
        if (draft.open === action.name) {
        // eslint-disable-next-line no-param-reassign
          draft.open = findOpts.name ?? draft.open;
          break;
        }
      }

      draft.sidebarItems.set(action.name, {
        ...findOpts,
        isOpen: !findOpts.isOpen
      });

      if (draft.open !== findOpts.name) {
        const findOne = draft.sidebarItems.get(draft.open);

        if (findOne) {
          draft.sidebarItems.set(draft.open, {
            ...findOne,
            isOpen: false
          }
        );
        }
      }

      // eslint-disable-next-line no-param-reassign
      draft.open = findOpts.name ?? draft.open;

      break;
    }
  default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
});

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
  <PlaygroundtLayoutContext.Provider  value={value}>
    <div ref={ref}>
      {children}
    </div>
  </PlaygroundtLayoutContext.Provider>
);
}

export { PlaygroundLayoutProvider, usePlaygroundLayout };
