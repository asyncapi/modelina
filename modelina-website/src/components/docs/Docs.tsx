import React, { useEffect, useState } from 'react';
import { withRouter, NextRouter } from 'next/router';
import Script from 'next/script';
import { ReactMarkdown } from 'react-markdown/lib/react-markdown';
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import rehypeRaw from 'rehype-raw';
import CodeBlock from '../CodeBlock';
import GithubButton from '../buttons/GithubButton';
import DocsList from "../../../config/docs.json";

interface WithRouterProps {
  router: NextRouter;
}

interface ModelinaDocsProps extends WithRouterProps {
  source: any,
  slug: string
}

const Docs: React.FC<ModelinaDocsProps> = ({ source, slug, router }) => {
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
            className={`cursor-pointer ${isSelected && 'bg-sky-500/[.3]'} p-2`}
            onClick={() => {
              setShowMenu(false);
            }}
          >
            <a href={`/docs/${value.slug.toLowerCase()}`}>{value.title}</a>
          </li>
        );
      } else {
        headerReadme = <li key={value.slug} className={`p-2`}>{value.title}</li>;
      }
      return (
        <>
          {headerReadme}
          <li key={`${value.slug}-li`}>
            <ul key={`${value.slug}-ul`} className='border-l border-gray-200 pl-4 ml-3 mt-1'>
              {isRoot && <li key={'apidocs'} className={`cursor-pointer p-2`}><a href={'/apidocs'}>API Docs</a></li>}
              {value.subPaths.map((subPath: any) => renderMenuTree(subPath, false))}
            </ul>
          </li>
        </>
      );
    } else {
      return (
        <li
          key={value.slug}
          className={`cursor-pointer ${isSelected && 'bg-sky-500/[.3]'} p-2`}
          onClick={() => {
            setShowMenu(false);
          }}
        >
          <a href={`/docs/${value.slug}`}>{value.title}</a>
        </li>
      );
    }
  };

  const menuItems = renderMenuTree(DocsList.tree, true);
  const item = (DocsList.unwrapped as any)[slug];

  return (
    <div className="py-4 lg:py-8">
      <div className="bg-white px-4 sm:px-6 lg:px-8 w-full xl:max-w-7xl xl:mx-auto">
        {!showMenu && (
          <div className="lg:hidden">
            <button
              onClick={() => {
                setShowMenu(true);
              }}
              className="flex text-gray-500 ml-6  hover:text-gray-900 focus:outline-none"
              aria-label="Open sidebar"
            >
              <span>Open Navigation ➔</span>
            </button>
          </div>
        )}
        {showMenu && (
          <div className="z-60 lg:hidden">
            <div className="fixed inset-0 flex z-40">
              <div className="fixed inset-0">
                <div
                  className="absolute inset-0 bg-gray-600 opacity-75"
                  onClick={() => {
                    setShowMenu(false);
                  }}
                ></div>
              </div>

              <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
                <div className="absolute top-0 right-0 -mr-14 p-1">
                  <button
                    onClick={() => {
                      setShowMenu(false);
                    }}
                    className="flex items-center justify-center h-12 w-12 rounded-full focus:outline-none focus:bg-gray-600"
                    aria-label="Close sidebar"
                  >
                    <svg
                      className="h-6 w-6 text-white"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
                <div className="flex-1 h-0 pt-5 overflow-y-auto">
                  <nav className="mt-5 px-2 mb-4">
                    <ul key="rootMenuList" className='border-l border-gray-200 pl-4 ml-3 mt-1'>
                      {menuItems}
                    </ul>
                  </nav>
                </div>
              </div>
              <div className="flex-shrink-0 w-14">
                {/* Force sidebar to shrink to fit close icon */}
              </div>
            </div>
          </div>
        )}
        <div className="flex flex-row" id="main-content">
          <div className="hidden lg:flex lg:flex-shrink-0">
            <div className="flex flex-col w-64 border-r border-gray-200 bg-white py-2">
              <div className="flex-1 flex flex-col md:overflow-y-auto md:sticky md:top-20 md:max-h-(screen-14)">
                <nav className="flex-1 bg-white">{menuItems}</nav>
              </div>
            </div>
          </div>
          <div className="flex flex-col ml-6 w-0 flex-1 max-w-full lg:max-w-(screen-16) prose">
            <div className={"flex md:justify-end my-4 md:my-0"}>
              <GithubButton
                text="Edit on GitHub"
                href={`https://github.com/asyncapi/modelina/edit/master${item.relativeRootPath}`}
                inNav="true"
              />
            </div>
            <ReactMarkdown
              rehypePlugins={[rehypeSlug, rehypeRaw]}
              remarkPlugins={[remarkGfm]}
              components={{
                code({ node, inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || '')
                  if (className === 'language-mermaid') {
                    return <pre className="mermaid bg-white flex justify-center">{children}</pre>
                  }
                  return !inline && match ? (
                    <CodeBlock
                      {...props}
                      children={String(children).replace(/\n$/, '')}
                      language={match[1]}
                      PreTag="div"
                    />
                  ) : (
                    <code {...props} className={className}>
                      {children}
                    </code>
                  )
                }
              }}
            >
              {source}
            </ReactMarkdown>
            <Script
              type="module"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `
                  import mermaid from "https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.esm.min.mjs";
                  mermaid.initialize({startOnLoad: true});
                  mermaid.contentLoaded();`,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default withRouter(Docs);