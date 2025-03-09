import type { NextRouter } from 'next/router';
import { withRouter } from 'next/router';
import React, { useState, useEffect } from 'react';
import { ReactMarkdown } from 'react-markdown/lib/react-markdown';
import rehypeRaw from 'rehype-raw';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';
import { useTheme } from '../contexts/ThemeContext';

import DocsList from '../../../config/docs.json';
import GithubButton from '../buttons/GithubButton';
import CodeBlock from '../CodeBlock';
import DocsNavigation from './DocsNavigation';

interface WithRouterProps {
  router: NextRouter;
}

interface ModelinaDocsProps extends WithRouterProps {
  source: string;
  slug: string;
  frontMatter?: {
    title?: string;
    description?: string;
    [key: string]: any;
  };
}

interface MenuTreeItem {
  slug: string;
  title: string;
  type?: 'dir';
  content: string | null;
  subPaths?: MenuTreeItem[];
  relativeRootPath?: string;
}

const Docs: React.FC<ModelinaDocsProps> = ({ source, slug, frontMatter }) => {
  const [showMenu, setShowMenu] = useState(false);
  const { isDark } = useTheme();

  // Initialize Mermaid when component mounts and theme changes
  useEffect(() => {
    const initializeMermaid = async () => {
      if (typeof window !== 'undefined') {
        const mermaid = (window as any).mermaid;
        if (mermaid) {
          mermaid.initialize({ 
            startOnLoad: true,
            theme: isDark ? 'dark' : 'default'
          });
          await mermaid.contentLoaded();
        }
      }
    };
    
    initializeMermaid();
  }, [isDark, source]); // Re-run when source changes to handle new diagrams

  const renderMenuTree = (value: MenuTreeItem, isRoot: boolean) => {
    const isSelected = value.slug === `${slug}`;
    const itemClasses = `cursor-pointer p-2 dark:text-gray-200 ${
      isSelected ? 'bg-sky-500/[.3]' : 'hover:bg-sky-500/[.3] dark:hover:bg-sky-500/[.2]'
    }`;

    if (value.type === 'dir') {
      const hasRootReadme = value.content !== null;
      
      return (
        <>
          {hasRootReadme ? (
            <li key={value.slug} className={itemClasses} onClick={() => setShowMenu(false)}>
              <a href={`/docs/${value.slug.toLowerCase()}`}>{value.title}</a>
            </li>
          ) : (
            <li key={value.slug} className="p-2 dark:text-gray-200">
              {value.title}
            </li>
          )}
          <li key={`${value.slug}-li`}>
            <ul className="ml-3 mt-1 border-l border-gray-200 dark:border-gray-700 pl-4">
              {isRoot && (
                <li className="cursor-pointer p-2 dark:text-gray-200">
                  <a href="/apidocs">API Docs</a>
                </li>
              )}
              {value.subPaths?.map(subPath => renderMenuTree(subPath, false))}
            </ul>
          </li>
        </>
      );
    }

    return (
      <li key={value.slug} className={itemClasses} onClick={() => setShowMenu(false)}>
        <a href={`/docs/${value.slug}`}>{value.title}</a>
      </li>
    );
  };

  const menuItems = renderMenuTree(DocsList.tree as MenuTreeItem, true);
  const item = (DocsList.unwrapped as Record<string, MenuTreeItem>)[slug];

  return (
    <div className="py-4 lg:py-8">
      <div className="w-full bg-white dark:bg-dark px-4 sm:px-6 lg:px-8 xl:mx-auto xl:max-w-7xl">
        {/* Mobile menu button */}
        {!showMenu && (
          <div className="lg:hidden">
            <button
              onClick={() => setShowMenu(true)}
              className="ml-6 flex text-gray-500 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white focus:outline-none"
              aria-label="Open sidebar"
            >
              <span>Open Navigation ➔</span>
            </button>
          </div>
        )}

        {/* Mobile menu overlay */}
        {showMenu && (
          <DocsNavigation
            onClose={() => setShowMenu(false)}
            menuItems={menuItems}
          />
        )}

        <div className="flex flex-row" id="main-content">
          {/* Desktop sidebar */}
          <div className="hidden lg:flex lg:shrink-0">
            <div className="flex w-64 flex-col border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-dark py-2">
              <div className="flex flex-1 flex-col md:sticky md:top-20 md:max-h-(screen-14) md:overflow-y-auto">
                <nav className="flex-1 bg-white dark:bg-dark">
                  {menuItems}
                </nav>
              </div>
            </div>
          </div>

          {/* Main content */}
          <div className="prose dark:prose-invert ml-6 flex w-0 max-w-full flex-1 flex-col lg:max-w-(screen-16)">
            {/* Edit on GitHub button */}
            <div className="my-4 flex md:my-0 md:justify-end">
              <GithubButton
                text="Edit on GitHub"
                href={`https://github.com/asyncapi/modelina/edit/master${item.relativeRootPath}`}
                inNav="true"
              />
            </div>

            {/* Markdown content */}
            <ReactMarkdown
              rehypePlugins={[rehypeSlug, rehypeRaw]}
              remarkPlugins={[remarkGfm]}
              components={{
                code({ inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || '');

                  if (className === 'language-mermaid') {
                    return (
                      <pre className="mermaid flex justify-center bg-white dark:bg-gray-800">
                        {children}
                      </pre>
                    );
                  }

                  return !inline && match ? (
                    <CodeBlock
                      {...props}
                      language={match[1]}
                      PreTag="div"
                    >
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default withRouter(Docs);