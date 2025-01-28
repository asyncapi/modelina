import Link from 'next/link';

import AsyncAPILogoLight from '../icons/AsyncAPILogoLight';
import IconGithub from '../icons/Github';
import IconLinkedIn from '../icons/LinkedIn';
import IconSlack from '../icons/Slack';
import IconTwitch from '../icons/Twitch';
import IconTwitter from '../icons/Twitter';
import IconYoutubeGray from '../icons/YouTubeGray';
import Heading from '../typography/Heading';

export default function Footer() {
  return (
    <footer className='margin: 0 auto bg-dark'>
      <div className='mx-auto max-w-screen-xl divide-y divide-cool-gray overflow-hidden px-3 py-4 sm:p-6 md:py-12 lg:px-8 xl:py-16'>
        <nav className='flex flex-wrap justify-between py-4 sm:py-10'>
          <div className='mr-14 w-full md:w-auto'>
            <div className=''>
              <Link href='https://www.asyncapi.com/' className='cursor-pointer'>
                <AsyncAPILogoLight className='mt-3 h-10 w-auto' />
              </Link>
            </div>
            <div className=''>
              <Heading className='mb-14 mt-12 text-white' typeStyle='heading-sm-semibold'>
                Building the future of <br /> Event-Driven Architectures.
              </Heading>
            </div>
          </div>

          <div className='flex flex-col sm:flex-row'>
            <div className='flex'>
              <div className='mb-5 px-0 lg:ml-5 lg:px-10'>
                <div className='py-2'>
                  <div className='text-white'>
                    <Heading typeStyle='heading-sm-semibold'>The Initiative</Heading>
                  </div>
                </div>
                <ul className='justify-center'>
                  <li className='py-2'>
                    <Link
                      href='https://www.asyncapi.com/about'
                      className='text-base leading-6 text-cool-gray transition duration-300 ease-in-out hover:text-white'
                    >
                      About
                    </Link>
                  </li>
                  <li className='py-2'>
                    <Link
                      href='https://www.asyncapi.com/blog'
                      className='text-base leading-6 text-cool-gray transition duration-300 ease-in-out hover:text-white'
                    >
                      Blog
                    </Link>
                  </li>
                  <li className='py-2'>
                    <Link
                      href='/jobs'
                      className='text-base leading-6 text-cool-gray transition duration-300 ease-in-out hover:text-white'
                    >
                      Jobs
                    </Link>
                  </li>
                  <li className='py-2'>
                    <a
                      href='https://github.com/asyncapi/brand/blob/master/brand-guidelines/README.md'
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-base leading-6 text-gray-500 transition duration-300 ease-in-out hover:text-white'
                    >
                      Brand
                    </a>
                  </li>
                </ul>
              </div>

              <div className='mb-5 px-14 sm:ml-10 sm:px-8 md:ml-5'>
                <div className='py-2'>
                  <div className='text-white'>
                    <Heading typeStyle='heading-sm-semibold'>News</Heading>
                  </div>
                </div>
                <ul className='justify-center'>
                  {/* <li className="py-2">
                    <div className="text-base leading-6 text-cool-gray hover:text-white transition ease-in-out duration-300">
                      <Link href="">
                        <a>Press</a>
                      </Link>
                    </div>
                  </li> */}
                  <li className='py-2'>
                    <div className='text-base leading-6 text-cool-gray transition duration-300 ease-in-out hover:text-white'>
                      <a href='mailto:press@asyncapi.io'>Email Us</a>
                    </div>
                  </li>
                </ul>
              </div>
            </div>

            <div className='mb-5 px-0 sm:ml-5 sm:px-10'>
              <div className='hidden py-2 sm:block'>
                <div className='mr-12 text-white'>
                  <Heading typeStyle='heading-sm-semibold'>Social</Heading>
                </div>
              </div>
              <ul className='flex justify-start sm:flex-col' aria-label='AsyncAPI social media links'>
                <li className='mr-3 py-2 sm:mr-0'>
                  <a href='https://twitter.com/AsyncAPISpec' target='_blank' rel='noopener noreferrer'>
                    <div className='flex items-center text-cool-gray transition duration-300 ease-in-out hover:text-white'>
                      <span className='sr-only'>Follow AsyncAPI on Twitter</span>
                      <IconTwitter className='size-8 sm:size-6' />
                      <span className='absolute hidden pl-8 pr-5 sm:block'>Twitter</span>
                    </div>
                  </a>
                </li>
                <li className='mr-3 py-2 sm:mr-0'>
                  <a href='https://github.com/asyncapi' target='_blank' rel='noopener noreferrer'>
                    <div className='flex items-center text-cool-gray transition duration-300 ease-in-out hover:text-white'>
                      <span className='sr-only'>AsyncAPI on GitHub</span>
                      <IconGithub className='size-8 sm:size-6' />
                      <span className='absolute hidden pl-8 pr-5 sm:block'>GitHub</span>
                    </div>
                  </a>
                </li>
                <li className='mr-3 py-2 sm:mr-0'>
                  <a href='https://linkedin.com/company/asyncapi' target='_blank' rel='noopener noreferrer'>
                    <div className='flex items-center text-cool-gray transition duration-300 ease-in-out hover:text-white'>
                      <span className='sr-only'>Follow AsyncAPI on LinkedIn</span>
                      <IconLinkedIn className='ml-1 size-8 sm:size-5' />
                      <span className='absolute hidden pl-8 pr-2 sm:block'>LinkedIn</span>
                    </div>
                  </a>
                </li>
                <li className='mr-3 py-2 sm:mr-0'>
                  <a href='https://youtube.com/asyncapi' target='_blank' rel='noopener noreferrer'>
                    <div className='flex items-center text-cool-gray transition duration-300 ease-in-out hover:text-white'>
                      <span className='sr-only'>Subscribe AsyncAPI on YouTube</span>
                      <IconYoutubeGray className='size-8 sm:size-6' />
                      <span className='absolute hidden pl-8 pr-2 sm:block'>YouTube</span>
                    </div>
                  </a>
                </li>
                <li className='mr-3 py-2 sm:mr-0'>
                  <a href='https://asyncapi.com/slack-invite' target='_blank' rel='noopener noreferrer'>
                    <div className='flex items-center text-cool-gray transition duration-300 ease-in-out hover:text-white'>
                      <span className='sr-only'>Join AsyncAPI on Slack</span>
                      <IconSlack className='size-8 sm:size-6' />
                      <span className='absolute hidden px-8 sm:block'>Slack</span>
                    </div>
                  </a>
                </li>
                <li className='mr-3 py-2 sm:mr-0'>
                  <a href='https://www.twitch.tv/asyncapi' target='_blank' rel='noopener noreferrer'>
                    <div className='flex items-center text-cool-gray transition duration-300 ease-in-out hover:text-white'>
                      <span className='sr-only'>Follow AsyncAPI on Twitch</span>
                      <IconTwitch className='size-8 sm:size-6' />
                      <span className='absolute hidden pl-8 pr-6 sm:block'>Twitch</span>
                    </div>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </nav>

        <div className='justify-between py-8 sm:flex sm:py-12 xl:mt-20'>
          <div className='w-full sm:w-2/3'>
            <p className='mb-3 text-left text-base leading-6 text-cool-gray'>
              Made with <span>❤️</span> by the AsyncAPI Initiative.
            </p>
            <p className='w-full text-left text-sm leading-6 text-cool-gray sm:w-2/3'>
              Copyright &copy; AsyncAPI Project a Series of LF Projects, LLC. For web site terms of use, trademark
              policy and general project policies please see{' '}
              <a
                href='https://lfprojects.org'
                className='text-secondary-500 underline transition duration-300 ease-in-out hover:text-white'
                target='_blank'
                rel='noopener noreferrer'
              >
                https://lfprojects.org
              </a>
            </p>
          </div>
          <a href='https://www.netlify.com'>
            {' '}
            <img src='https://www.netlify.com/v3/img/components/netlify-color-bg.svg' alt='Deploys by Netlify' />{' '}
          </a>
        </div>
      </div>
    </footer>
  );
}
