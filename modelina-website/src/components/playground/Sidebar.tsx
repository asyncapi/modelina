import React from 'react';
import { IoOptionsOutline } from 'react-icons/io5';
import { VscListSelection } from 'react-icons/vsc';

import { usePlaygroundContext } from '../contexts/PlaygroundContext';
import { Tooltip } from './Tooltip';

interface SidebarItem {
  name: string;
  title: string;
  isActive: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  tooltip: React.ReactNode;
}

interface SidebarProps {}

export const Sidebar: React.FunctionComponent<SidebarProps> = () => {
  const { setShowOptions, setShowOutputNavigation } = usePlaygroundContext();
  const sidebarItems: SidebarItem[] = [
    // Options
    {
      name: 'options',
      title: 'Options',
      isActive: false,
      onClick: () => {
        setShowOptions((prevShowOptions) => !prevShowOptions);
      },
      icon: <IoOptionsOutline className='size-5' />,
      tooltip: 'Show or hide all the options'
    },
    // Output Explorer
    {
      name: 'outputExplorer',
      title: 'Output',
      isActive: false,
      onClick: () => {
        setShowOutputNavigation((prevShowOutputNavigation) => !prevShowOutputNavigation);
      },
      icon: <VscListSelection className='size-5' />,
      tooltip: 'Show or hide the list of output models'
    }
  ];

  return (
    <div className='flex size-full flex-col justify-start border-r border-gray-700 bg-[#1f2937] shadow-lg'>
      <div className='flex flex-col'>
        {sidebarItems.map((item) => (
          <Tooltip content={item.tooltip} placement='right' hideOnClick={true} key={item.name}>
            <button
              title={item.title}
              onClick={() => item.onClick()}
              className='border-box flex p-2 text-sm focus:outline-none'
              type='button'
            >
              <div
                className={item.isActive ? 'rounded bg-gray-900 p-2 text-white' : 'p-2 text-gray-700 hover:text-white'}
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
