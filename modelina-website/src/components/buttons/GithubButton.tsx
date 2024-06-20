import IconGithub from '../icons/Github';
import Button from './Button';

export default function GithubButton({
  text = 'View on Github',
  href = 'https://github.com/asyncapi',
  target = '_blank',
  iconPosition = 'left',
  className,
  inNav = 'false'
}: any) {
  return (
    <Button
      text={text}
      icon={<IconGithub className='-mt-1 inline-block size-6' />}
      href={href}
      iconPosition={iconPosition}
      target={target}
      className={className}
      bgClassName='bg-gray-800 hover:bg-gray-700'
      buttonSize={inNav === 'true' ? 'small' : 'default'}
    />
  );
}
