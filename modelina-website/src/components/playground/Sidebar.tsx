import clsx from 'clsx';
import React, { useCallback } from 'react';

import { usePlaygroundLayout } from '../contexts/PlaygroundLayoutContext';
import { Tooltip } from './Tooltip';

export const Sidebar: React.FunctionComponent = () => {
  const { state, dispatch } = usePlaygroundLayout();

  const sidebarItems = Array.from(state.sidebarItems.values());

  const handleClick = useCallback(({ name }: { name: string }) => { dispatch({ type: 'open-option', name }); }, []);

  return (
    <div className='flex size-full flex-col justify-start border-r border-gray-700 bg-[#1f2937] shadow-lg'>
      <div className='flex flex-col'>
        {sidebarItems.map((item) => (
          <Tooltip content={item.tooltip} placement='right' hideOnClick={true} key={item.name}>
            <button
              title={item.title}
              onClick={() => handleClick({ name: item.name })}
              className={clsx('border-box flex p-2 text-sm focus:outline-none disabled:opacity-25', {
                'md:hidden': item.devices === 'mobile'
              })}
              disabled={item.name === 'output-options' && state.open === 'general-options' && state.device === 'mobile'}
              type='button'
            >
              <div
                className={item.isOpen ? 'rounded bg-slate-200/25 p-2 text-white' : 'p-2 text-gray-700 hover:text-white'}
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
