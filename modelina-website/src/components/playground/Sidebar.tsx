import React from 'react';
import { IoOptionsOutline } from 'react-icons/io5';
import { VscListSelection } from 'react-icons/vsc';
import { Tooltip } from './Tooltip';
import { usePlaygroundContext } from '../contexts/PlaygroundContext';

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
      icon: <IoOptionsOutline className="w-5 h-5" />,
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
      icon: <VscListSelection className="w-5 h-5" />,
      tooltip: 'Show or hide the list of output models'
    }
  ];

  return (
    <div className="flex flex-col h-full w-full bg-[#1f2937] shadow-lg border-r border-gray-700 justify-start">
      <div className="flex flex-col">
        {sidebarItems.map((item) => (
          <Tooltip
            content={item.tooltip}
            placement="right"
            hideOnClick={true}
            key={item.name}
          >
            <button
              title={item.title}
              onClick={() => item.onClick()}
              className="flex text-sm focus:outline-none border-box p-2"
              type="button"
            >
              <div
                className={
                  item.isActive
                    ? 'bg-gray-900 p-2 rounded text-white'
                    : 'p-2 text-gray-700 hover:text-white'
                }
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
