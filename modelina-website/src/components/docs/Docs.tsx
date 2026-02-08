import type { NextRouter } from 'next/router';
import { withRouter } from 'next/router';
import Link from 'next/link';
import Script from 'next/script';
import React, { useState } from 'react';
import { ReactMarkdown } from 'react-markdown/lib/react-markdown';
import rehypeRaw from 'rehype-raw';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';

import DocsList from '../../../config/docs.json';
import GithubButton from '../buttons/GithubButton';
import CodeBlock from '../CodeBlock';

interface WithRouterProps {
  router: NextRouter;
}

interface ModelinaDocsProps extends WithRouterProps {
  source: any;
  slug: string;
}

const Docs: React.FC<ModelinaDocsProps> = ({ source, slug }) => {
  const [showMenu, setShowMenu] = useState(true);

  /**
   * Render the menu items dynamically in a depth first approach
   */
  const renderMenuTree = (value: any, isRoot: boolean) => {
    const isSelected = value.slug === `${slug}`;

    if (value.type === 'dir') {
      const hasRootReadme = value.content !== null;
      let headerReadme;

      if (hasRootReadme) {
        headerReadme = (
          <li
            key={value.slug}
            className={`cursor-pointer hover:bg-sky-500/[.3] ${isSelected && 'bg-sky-500/[.3]'} p-2`}
          >
            <li className="p-2">
              <Link href={`/docs/${value.slug.toLowerCase()}`} className="block w-full">{value.title}</Link>
            </li>
          </li>
        );
      } else {
        headerReadme = (
          <li key={value.slug} className={'p-2'}>
            {value.title}
          </li>
        );
      }

      return (
        <>
          {headerReadme}
          <li key={`${value.slug}-li`}>
            <ul key={`${value.slug}-ul`} className='ml-3 mt-1 border-l border-gray-200 pl-4'>
              {isRoot && (
                <li key={'apidocs'} className={'cursor-pointer p-2'}>
                  <li className="p-2">
                    <Link href={'/apidocs'} className="block w-full">API Docs</Link>
                  </li>
                </li>
              )}
              {value.subPaths.map((subPath: any) => renderMenuTree(subPath, false))}
            </ul>
          </li>
        </>
      );
    }

    return (
      <li
        key={value.slug}
        className={`cursor-pointer hover:bg-sky-500/[.3] ${isSelected && 'bg-sky-500/[.3]'} p-2`}
      >
        <li className="p-2">
          <Link href={`/docs/${value.slug}`} className="block w-full">{value.title}</Link>
        </li>
      </li>
    );
  };

  const menuItems = renderMenuTree(DocsList.tree, true);
  const item = (DocsList.unwrapped as any)[slug];

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
                    <ul key='rootMenuList' className='ml-3 mt-1 border-l border-gray-200 pl-4'>
                      {menuItems}
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
                <nav className='flex-1 bg-white'>{menuItems}</nav>
              </div>
            </div>
          </div>
          <div className='prose ml-6 flex w-0 max-w-full flex-1 flex-col lg:max-w-(screen-16)'>
            <div className={'my-4 flex md:my-0 md:justify-end'}>
              <GithubButton
                text='Edit on GitHub'
                href={`https://github.com/asyncapi/modelina/edit/master${item.relativeRootPath}`}
                inNav='true'
              />
            </div>
            <ReactMarkdown
              rehypePlugins={[rehypeSlug, rehypeRaw]}
              remarkPlugins={[remarkGfm]}
              components={{
                code({ inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || '');

                  if (className === 'language-mermaid') {
                    return <pre className='mermaid flex justify-center bg-white'>{children}</pre>;
                  }

                  return !inline && match ? (
                    <CodeBlock {...props} language={match[1]} PreTag='div'>
                      {String(children).replace(/\n$/, '')}
                    </CodeBlock>
                  ) : (
                    <code {...props} className={className}>
                      {children}
                    </code>
                  );
                }
              }}
            >
              {source}
            </ReactMarkdown>
            <Script
              type='module'
              id='mermaid-script'
              strategy='afterInteractive'
              dangerouslySetInnerHTML={{
                __html: `
                  import mermaid from "https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.esm.min.mjs";
                  mermaid.initialize({startOnLoad: true});
                  mermaid.contentLoaded();`
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default withRouter(Docs);
