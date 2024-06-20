import Button from '@/components/buttons/Button';
import GithubButton from '@/components/buttons/GithubButton';
import ModelinaLogo from '@/components/icons/ModelinaLogo';
import IconRocket from '@/components/icons/Rocket';

const Custom404 = () => {
  return (
    <div className='flex h-screen w-screen items-center justify-center'>
      <div className='flex flex-col items-center p-8'>
        <ModelinaLogo className='h-24 w-auto' />
        <h2 className='mt-2 text-3xl font-bold'>Page Not Found</h2>
        <p className='mt-2 text-center text-2xl'>The page you are looking for does not exist.</p>
        <div className='mt-4 flex flex-col gap-10 md:flex-row'>
          <GithubButton
            className='mt-4'
            href='https://github.com/asyncapi/modelina/issues/new/choose'
            text='Create an issue'
          />
          <Button
            className='mt-4 font-semibold'
            href='/'
            text='Go to Home Page'
            icon={<IconRocket height='15px' width='15px' />}
          />
        </div>
      </div>
    </div>
  );
};

export default Custom404;
