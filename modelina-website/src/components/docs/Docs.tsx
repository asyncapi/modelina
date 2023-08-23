import React from 'react';
import Router, { withRouter, NextRouter } from 'next/router';
import { getMDXComponents } from '../MDX';
import { MDXRemote } from 'next-mdx-remote';
import DocsList from "../../../config/docs.json";
import Link from 'next/link';
import { ReactMarkdown } from 'react-markdown/lib/react-markdown';

interface WithRouterProps {
  router: NextRouter;
}

interface ModelinaDocsProps extends WithRouterProps {
  source: any, frontMatter: string, slug: string
}

type ModelinaDocsState = {
  showMenu: boolean;
};

class Docs extends React.Component<
  ModelinaDocsProps,
  ModelinaDocsState
> {
  constructor(props: ModelinaDocsProps) {
    super(props);
    this.state = {
      showMenu: true
    };
    this.renderMenuTree = this.renderMenuTree.bind(this);

  }
  renderMenuTree(value: any) {
    const isSelected = value.slug === this.props.slug;
    if(value.type === 'dir') {
      return <ul className='border-l border-gray-200 pl-4 ml-3 mt-1'>
        { value.subPaths.map(this.renderMenuTree) }
      </ul>;
    } else {
      return <li key={value.slug} className={`cursor-pointer hover:bg-sky-500/[.3] ${isSelected && 'bg-sky-500/[.3]'} p-2`} onClick={() => { this.setState({ showMenu: false }) }}><a href={value.slug}>{value.title}</a></li>;
    }
  }
  render() {
    let { showMenu } = this.state;
    console.log(this.props.source);
    const menuItems = this.renderMenuTree(DocsList.tree);

    return (
      <div className="py-4 lg:py-8">
        <div className="bg-white px-4 sm:px-6 lg:px-8 w-full xl:max-w-7xl xl:mx-auto">
          {!showMenu && (
            <div className="lg:hidden">
              <button onClick={() => { this.setState({ showMenu: true }) }} className="flex text-gray-500 ml-6  hover:text-gray-900 focus:outline-none" aria-label="Open sidebar">
                <span>Open Navigation ➔</span>
              </button>
            </div>
          )}
          {
            showMenu && (
              <div className="z-60 lg:hidden">
                <div className="fixed inset-0 flex z-40">
                  <div className="fixed inset-0">
                    <div
                      className="absolute inset-0 bg-gray-600 opacity-75"
                      onClick={() => { this.setState({ showMenu: false }) }}
                    ></div>
                  </div>

                  <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
                    <div className="absolute top-0 right-0 -mr-14 p-1">
                      <button
                        onClick={() => { this.setState({ showMenu: false }) }}
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
                        <p className="cursor-pointer p-2 font-semibold text-lg">Docs</p>
                        <ul className='border-l border-gray-200 pl-4 ml-3 mt-1'>
                          { menuItems }
                        </ul>
                      </nav>
                    </div>
                  </div>
                  <div className="flex-shrink-0 w-14">
                    {/* Force sidebar to shrink to fit close icon */}
                  </div>
                </div>
              </div>
            )
          }
          <div className="flex flex-row" id="main-content">
            <div className="hidden lg:flex lg:flex-shrink-0">
              <div className="flex flex-col w-64 border-r border-gray-200 bg-white py-2">
                <div className="flex-1 flex flex-col md:overflow-y-auto md:sticky md:top-20 md:max-h-(screen-14)">

                  <nav className="flex-1 bg-white">
                    <p className="cursor-pointer p-2 font-semibold text-lg">Docs</p>
                      { menuItems }
                  </nav>
                </div>
              </div>
            </div>
            <div className="flex flex-col ml-6 w-0 flex-1 max-w-full lg:max-w-(screen-16)">
              <ReactMarkdown>{this.props.source}</ReactMarkdown>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default withRouter(Docs);
