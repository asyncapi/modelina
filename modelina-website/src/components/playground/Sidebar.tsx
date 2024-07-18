import clsx from 'clsx';
import React, { useCallback } from 'react';

import { usePlaygroundLayout } from '../contexts/PlaygroundLayoutContext';
import { Tooltip } from './Tooltip';

// interface SidebarItem {
//   name: string;
//   title: string;
//   isActive: boolean;
//   isShow: boolean;
//   mobileOnly: boolean;
//   onClick: () => void;
//   icon: React.ReactNode;
//   tooltip: React.ReactNode;
// }

export const Sidebar: React.FunctionComponent = () => {
  // const { setShowOptions, setShowOutputNavigation, setShowInputEditor, showInputEditor, showOptions } =
  //   usePlaygroundContext();
  // const sidebarItems: SidebarItem[] = [
  //   // Input/Output Editor
  //   {
  //     name: 'input-editor',
  //     title: 'Input Editor',
  //     isActive: false,
  //     isShow: true,
  //     mobileOnly: true,
  //     onClick: () => {
  //       setShowInputEditor((prevShowOptions) => !prevShowOptions);
  //       setShowOutputNavigation(false);
  //       setShowOptions(false);
  //     },
  //     icon: showInputEditor ? <LuFileInput className='size-5' /> : <LuFileOutput className='size-5' />,
  //     tooltip: `Show ${showInputEditor ? 'Input Editor' : 'Output Editor'}`
  //   },
  //   // Options
  //   {
  //     name: 'options',
  //     title: 'Options',
  //     isActive: showOptions,
  //     isShow: true,
  //     mobileOnly: false,
  //     onClick: () => {
  //       setShowOptions((prevShowOptions) => !prevShowOptions);
  //       setShowOutputNavigation(false);
  //     },
  //     icon: <IoOptionsOutline className='size-5' />,
  //     tooltip: 'Show or hide all the options'
  //   },
  //   // Output Explorer
  //   {
  //     name: 'outputExplorer',
  //     title: 'Output',
  //     isActive: false,
  //     isShow: showInputEditor,
  //     mobileOnly: false,
  //     onClick: () => {
  //       setShowOutputNavigation((prevShowOutputNavigation) => !prevShowOutputNavigation);
  //       setShowOptions(false);
  //     },
  //     icon: <VscListSelection className='size-5' />,
  //     tooltip: 'Show or hide the list of output models'
  //   }
  // ];
  const { state, dispatch } = usePlaygroundLayout();

  const sidebarItems = Array.from(state.sidebarItems.values());

  const handleClick = useCallback(({ name }: { name: string }) => { dispatch({ type: 'open-option', name }); }, []);

  return (
    <div className='flex size-full flex-col justify-start border-r border-gray-700 bg-[#1f2937] shadow-lg'>
      <div className='flex flex-col'>
        {/* {sidebarItems.map((item) => (
          <Tooltip content={item.tooltip} placement='right' hideOnClick={true} key={item.name}>
            <button
              title={item.title}
              onClick={() => item.onClick()}
              className={clsx('border-box flex p-2 text-sm focus:outline-none', {
                'md:hidden': item.mobileOnly,
                'hidden md:block': !item.isShow
              })}
              type='button'
            >
              <div
                className={item.isActive ? 'rounded bg-gray-900 p-2 text-white' : 'p-2 text-gray-700 hover:text-white'}
              >
                {item.icon}
              </div>
            </button>
          </Tooltip>
        ))} */}
        {sidebarItems.map((item) => (
          <Tooltip content={item.tooltip} placement='right' hideOnClick={true} key={item.name}>
            <button
              title={item.title}
              onClick={() => handleClick({ name: item.name })}
              className={clsx('border-box flex p-2 text-sm focus:outline-none', {
                'md:hidden': item.devices === 'mobile'
                // 'hidden md:block': !item.isShow
              })}
              disabled={item.name === 'output-options' && state.open === 'general-options'}
              type='button'
            >
              <div
                className={item.isOpen ? 'rounded bg-gray-900 p-2 text-white' : 'p-2 text-gray-700 hover:text-white'}
              >
                {item.icon}
              </div>
            </button>
          </Tooltip>
        ))}
      </div>
    </div>
  );
};
