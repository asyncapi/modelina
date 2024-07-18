import type { Draft, Immutable } from 'immer';
import { enableMapSet, produce } from 'immer';
import { createContext, useContext, useReducer } from 'react';
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

type ActionType = { type: 'open-option', name: string };
type Dispatch = (action: ActionType) => void;
type State = Immutable<{  open: string, sidebarItems: typeof sidebarItems }>;
type PlaygroundtProviderProps = { children: React.ReactNode };

const initialState: State = { open: 'general-options', sidebarItems };

const PlaygroundtLayoutContext = createContext<
  { state: State; dispatch: Dispatch } | undefined
>(undefined);

const playgroundLayoutReducer = produce<State, [ActionType]>((draft: Draft<State>, action) => {
  enableMapSet();

  switch (action.type) {
    case 'open-option': {
      const findOpts = draft.sidebarItems.get(action.name);

      if (!findOpts) {
        break;
      }

      if (action.name === 'input-editor' || action.name === 'output-editor') {
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
 * This component to providing Plaground Layout State.
 *
 * @param {ReactNode} children The children element of the component.
 * @returns {ReactNode} A React element that share context state.
 */
function PlaygroundLayoutProvider({ children }: PlaygroundtProviderProps) {
  const [state, dispatch] = useReducer(playgroundLayoutReducer, initialState);
  const value = { state, dispatch };

  return (
  <PlaygroundtLayoutContext.Provider value={value}>
    {children}
  </PlaygroundtLayoutContext.Provider>
);
}

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

export { PlaygroundLayoutProvider, usePlaygroundLayout };
