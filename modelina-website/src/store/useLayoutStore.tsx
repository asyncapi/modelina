import type { Draft, Immutable } from 'immer';
import { enableMapSet, produce } from 'immer';
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
    isOpen: false,
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

export type ActionType = { type: 'open-option', name: string } | { type: 'update-device', payload: IDeviceType } | { type: 'resizable-size', total: number } | { type: '' };
export type Dispatch = (action: ActionType) => void;
export type State = Immutable<{  open: string, editorSize: number, device: IDeviceType, sidebarItems: typeof sidebarItems }>;

export const initialState: State = { open: 'general-options', device: 'desktop', editorSize: 0.5,  sidebarItems };

export const playgroundLayoutReducer = produce<State, [ActionType]>((draft: Draft<State>, action) => {
enableMapSet();

switch (action.type) {
    case 'update-device': {
    // eslint-disable-next-line no-param-reassign
    draft.device = action.payload;
    break;
    }
    case 'resizable-size': {
    // eslint-disable-next-line no-param-reassign
    draft.editorSize = action.total;
    break;
    }
    case 'open-option': {
    const findOpts = draft.sidebarItems.get(action.name);

    const alwaysOpen = ['input-editor', 'output-editor', 'general-options'];
    const isMobile = draft.device === 'mobile';

    if (!findOpts) {
        break;
    }

    if (isMobile && alwaysOpen.includes(action.name)) {
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

    if (isMobile && action.name === 'output-options' && !findOpts.isOpen) {
        // eslint-disable-next-line no-param-reassign
        draft.open = findOpts.name ?? draft.open;
        break;
    }

    if (isMobile && action.name === 'output-options' && findOpts.isOpen) {
        draft.sidebarItems.forEach((value, key) => {
        if (value.isOpen) {
            // eslint-disable-next-line no-param-reassign
            draft.open = key;
        }
        });
        break;
    }

    if (draft.open !== findOpts.name) {
        const findOne = draft.sidebarItems.get(draft.open);

        if (findOne) {
            draft.sidebarItems.set(draft.open, {
            ...findOne,
            isOpen: false
            }
        );
        }

        if (isMobile && draft.open === 'output-options') {
        draft.sidebarItems.forEach((value, key) => {
            if (value.isOpen && key !== action.name) {
            draft.sidebarItems.set(key, {
                ...value,
                isOpen: false
            }
            );
            }
        });
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
