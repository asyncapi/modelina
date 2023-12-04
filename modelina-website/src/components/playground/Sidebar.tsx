import React from 'react';
import { IoOptionsOutline } from 'react-icons/io5';
import { VscListSelection } from 'react-icons/vsc';
import { Tooltip } from './Tooltip';
import { usePanelContext } from '../contexts/PlaygroundPanelContext';

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
  const { panel, setPanel } = usePanelContext();
  const sidebarItems: SidebarItem[] = [
    // Options
    {
      name: 'options',
      title: 'Options',
      isActive: false,
      onClick: () => {
        setPanel(panel !== 'options' ? 'options' : '');
      },
      icon: <IoOptionsOutline className="w-5 h-5" />,
      tooltip: 'Option'
    },
    // Output Explorer
    {
      name: 'outputExplorer',
      title: 'Output',
      isActive: false,
      onClick: () => {
        setPanel(panel !== 'output' ? 'output' : '');
      },
      icon: <VscListSelection className="w-5 h-5" />,
      tooltip: 'Output'
    }
  ];

  return (
    <div className="flex flex-col h-full w-[40px] bg-[#1f2937] shadow-lg border-r border-gray-700 justify-start">
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
