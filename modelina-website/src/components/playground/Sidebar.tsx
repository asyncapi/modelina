import React from 'react';
import { IoOptionsOutline } from "react-icons/io5";
import { VscListSelection } from "react-icons/vsc";
import { Tooltip } from './Tooltip';

interface SidebarItem {
  name: string;
  title: string;
  isActive: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  tooltip: React.ReactNode;
}

interface SidebarProps { }

export const Sidebar: React.FunctionComponent<SidebarProps> = () => {

  const sidebarItems: SidebarItem[] = [
    // Options
    {
      name: 'options',
      title: 'Options',
      isActive: false,
      onClick: () => { },
      icon: <IoOptionsOutline className='w-5 h-5' />,
      tooltip: 'Option'
    },
    // Output Navigation
    {
      name: 'outputNavigation',
      title: 'Output',
      isActive: false,
      onClick: () => { },
      icon: <VscListSelection className='w-5 h-5' />,
      tooltip: 'Output'
    },
  ]

  return (
    <div className='flex flex-col h-full w-[40px] bg-gray-200 shadow-lg border-r border-gray-700 justify-start'>
      <div className='flex flex-col'>
        {
          sidebarItems.map((item) => (
            <Tooltip content={item.tooltip} placement='right' hideOnClick={true} key={item.name}>
              <button title={item.title} onClick={() => item.onClick()} className='flex text-sm focus:outline-none border-box p-2' type='button'>
                <div className={item.isActive ? 'bg-gray-900 p-2 rounded text-white' : 'p-2 text-gray-700 hover:text-gray-900'}>
                  {item.icon}
                </div>
              </button>
            </Tooltip>
          ))
        }
      </div>
    </div>
  )
}