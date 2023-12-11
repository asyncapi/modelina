import React from 'react';
import Tippy, { TippyProps } from '@tippyjs/react';

export const Tooltip: React.FunctionComponent<TippyProps> = ({
  placement = 'bottom',
  animation = 'shift-away',
  className = 'text-xs text-white bg-gray-700 text-center px-1 py-[3px]',
  hideOnClick = false,
  children,
  ...rest
}) => {
  return (
    <Tippy
      placement={placement}
      animation={animation}
      className={className}
      hideOnClick={hideOnClick}
      {...rest}
    >
      {children}
    </Tippy>
  );
};
