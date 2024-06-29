import type { NextRouter } from 'next/router';
import Router, { withRouter } from 'next/router';
import type { ParsedUrlQuery } from 'querystring';
import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';

import ExamplesList from '../../../config/examples.json';
import ExamplesReadme from '../../../config/examples_readme.json';
import GithubButton from '../buttons/GithubButton';
import MonacoEditorWrapper from '../MonacoEditorWrapper';

const examplesIterator = Object.entries(ExamplesList);

interface WithRouterProps {
  router: NextRouter;
}

interface Example {
  description: string;
  displayName: string;
  code: string;
  output: string;
  language: string;
}

export interface ExampleQueryOptions extends ParsedUrlQuery {
  selectedExample: string;
}

interface ModelinaExamplesProps extends WithRouterProps {}

const Examples: React.FC<ModelinaExamplesProps> = ({ router }) => {
  const [selectedExample, setSelectedExample] = useState<string | undefined>(undefined);
  const [showMenu, setShowMenu] = useState<boolean>(false);

  const setNewQuery = (queryKey: string, queryValue: any) => {
    const newQuery = {
      query: { ...router.query }
    };

    if (queryValue) {
      newQuery.query[queryKey] = String(queryValue);
    } else {
      delete newQuery.query[queryKey];
    }
    Router.push(newQuery, undefined, { scroll: true });
  };

  useEffect(() => {
    const query = router.query as ExampleQueryOptions;

    if (query.selectedExample !== undefined) {
      setSelectedExample(query.selectedExample);
    }
  }, [router.query]);

  let example: Example | undefined;

  if (selectedExample) {
    example = (ExamplesList as any)[selectedExample];
  }

  return (
    <div className='py-4 lg:py-8'>
      <div className='w-full bg-white px-4 sm:px-6 lg:px-8 xl:mx-auto xl:max-w-7xl'>
        {!showMenu && (
          <div className='lg:hidden'>
            <button
              onClick={() => {
                setShowMenu(true);
              }}
              className='ml-6 flex text-gray-500  hover:text-gray-900 focus:outline-none'
              aria-label='Open sidebar'
            >
              <span>Open Navigation ➔</span>
            </button>
          </div>
        )}
        {showMenu && (
          <div className='z-60 lg:hidden'>
            <div className='fixed inset-0 z-40 flex'>
              <div className='fixed inset-0'>
                <div
                  className='absolute inset-0 bg-gray-600 opacity-75'
                  onClick={() => {
                    setShowMenu(false);
                  }}
                ></div>
              </div>

              <div className='relative flex w-full max-w-xs flex-1 flex-col bg-white'>
                <div className='absolute right-0 top-0 -mr-14 p-1'>
                  <button
                    onClick={() => {
                      setShowMenu(false);
                    }}
                    className='flex size-12 items-center justify-center rounded-full focus:bg-gray-600 focus:outline-none'
                    aria-label='Close sidebar'
                  >
                    <svg className='size-6 text-white' stroke='currentColor' fill='none' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M6 18L18 6M6 6l12 12' />
                    </svg>
                  </button>
                </div>
                <div className='h-0 flex-1 overflow-y-auto pt-5'>
                  <nav className='mb-4 mt-5 px-2'>
                    <p
                      className='cursor-pointer p-2 text-lg font-semibold'
                      onClick={() => {
                        setSelectedExample(undefined);
                      }}
                    >
                      Examples
                    </p>
                    <ul className='ml-3 mt-1 border-l border-gray-200 pl-4'>
                      {examplesIterator.map((value) => (
                        <li
                          key={value[0]}
                          className={`cursor-pointer hover:bg-sky-500/[.3] ${
                            value[0] === selectedExample && 'bg-sky-500/[.3]'
                          } p-2`}
                          onClick={() => {
                            setNewQuery('selectedExample', value[0]);
                            setShowMenu(false);
                          }}
                        >
                          {value[1].displayName}
                        </li>
                      ))}
                    </ul>
                  </nav>
                </div>
              </div>
              <div className='w-14 shrink-0'>{/* Force sidebar to shrink to fit close icon */}</div>
            </div>
          </div>
        )}

        <div className='flex flex-row' id='main-content'>
          <div className='hidden lg:flex lg:shrink-0'>
            <div className='flex w-64 flex-col border-r border-gray-200 bg-white py-2'>
              <div className='flex flex-1 flex-col md:sticky md:top-20 md:max-h-(screen-14) md:overflow-y-auto'>
                <nav className='flex-1 bg-white'>
                  <p
                    className='cursor-pointer p-2 text-lg font-semibold'
                    onClick={() => {
                      setNewQuery('selectedExample', undefined);
                    }}
                  >
                    Examples
                  </p>
                  <ul className='ml-3 mt-1 border-l border-gray-200 pl-4'>
                    {examplesIterator.map((value) => (
                      <li
                        key={value[0]}
                        className={`cursor-pointer hover:bg-sky-500/[.3] ${
                          value[0] === selectedExample && 'bg-sky-500/[.3]'
                        } p-2`}
                        onClick={() => {
                          setNewQuery('selectedExample', value[0]);
                        }}
                      >
                        {value[1].displayName}
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
            </div>
          </div>
          <div className='ml-6 flex w-0 max-w-full flex-1 flex-col lg:max-w-(screen-16)'>
            {example ? (
              <div className={'mt-4 grid grid-cols-2 gap-4'}>
                <div className={'col-span-2'}>
                  <GithubButton
                    text='See Example on GitHub'
                    href={`https://github.com/asyncapi/modelina/tree/master/examples/${selectedExample}`}
                    inNav='true'
                  />
                  <div className='prose py-6'>
                    <ReactMarkdown>{example.description}</ReactMarkdown>
                    <a
                      href={`https://github.com/asyncapi/modelina/edit/master/examples/${selectedExample}/README.md`}
                      className='rounded border border-blue-400 bg-blue-100 p-2 text-xs font-semibold text-blue-800 hover:bg-blue-200'
                    >
                      Edit Description
                    </a>
                  </div>
                </div>
                <div className={'col-span-1'}>
                  <div
                    className='h-full rounded-b bg-code-editor-dark font-bold text-white shadow-lg'
                    style={{ height: '750px' }}
                  >
                    <MonacoEditorWrapper
                      options={{
                        readOnly: true
                      }}
                      key={selectedExample}
                      value={example.code}
                      language={'typescript'}
                    />
                  </div>
                </div>
                <div className={'col-span-1'}>
                  <div
                    className='h-full rounded-b bg-code-editor-dark font-bold text-white shadow-lg'
                    style={{ height: '750px' }}
                  >
                    <MonacoEditorWrapper
                      options={{
                        readOnly: true
                      }}
                      key={selectedExample}
                      value={example.output}
                      language={example.language}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className='prose' style={{ maxWidth: '100%' }}>
                <div className={'my-4 flex md:my-0 md:justify-end'}>
                  <GithubButton
                    text='Edit readme on GitHub'
                    href={'https://github.com/asyncapi/modelina/edit/master/examples/README.md'}
                    inNav='true'
                  />
                </div>
                <ReactMarkdown rehypePlugins={[rehypeSlug]} remarkPlugins={[remarkGfm]}>
                  {ExamplesReadme}
                </ReactMarkdown>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default withRouter(Examples);
