import Tippy, { TippyProps } from '@tippyjs/react';

export const Tooltip: React.FunctionComponent<TippyProps> = ({
  placement = 'bottom',
  arrow = true,
  animation = 'shift-away',
  className = 'text-xs text-white bg-gray-900 text-center p-[2px]',
  hideOnClick = false,
  children,
  ...rest
}) => {
  return (
    <Tippy placement={placement} arrow={arrow} animation={animation} className={className} hideOnClick={hideOnClick} {...rest}>
      {children}
    </Tippy>
  )
}