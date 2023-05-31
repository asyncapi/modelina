import React from 'react';
import MonacoEditorWrapper from '../MonacoEditorWrapper';
import Router, { withRouter, NextRouter } from 'next/router';
import { ParsedUrlQuery } from 'querystring';
import ExamplesList from "../../../config/examples.json";
import ExamplesReadme from "../../../config/examples_readme.json";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import ReactMarkdown from 'react-markdown';
import GithubButton from '../buttons/GithubButton';
const examplesIterator = Object.entries(ExamplesList);
interface WithRouterProps {
  router: NextRouter;
}
interface Example {
  description: string,
  displayName: string,
  code: string,
  output: string,
  language: string
}
export interface ExampleQueryOptions extends ParsedUrlQuery {
  selectedExample: string;
}

interface ModelinaExamplesProps extends WithRouterProps {
}

type ModelinaExamplesState = {
  selectedExample?: string;
  showMenu: boolean;
};

class Examples extends React.Component<
  ModelinaExamplesProps,
  ModelinaExamplesState
> {
  constructor(props: ModelinaExamplesProps) {
    super(props);
    this.state = {
      selectedExample: undefined,
      showMenu: false
    };
    this.setNewQuery = this.setNewQuery.bind(this);
  }

  /**
   * Set a query key and value or unset depending on value
   */
  setNewQuery(queryKey: string, queryValue: any) {
    const newQuery = {
      query: { ...this.props.router.query }
    };
    if (queryValue) {
      /* eslint-disable-next-line security/detect-object-injection */
      newQuery.query[queryKey] = String(queryValue);
    } else {
      delete newQuery.query[queryKey];
    }
    Router.push(newQuery, undefined, { scroll: true });
  }
  render() {
    let { selectedExample, showMenu } = this.state;

    const query = this.props.router.query as ExampleQueryOptions;
    if (query.selectedExample !== undefined) {
      selectedExample = query.selectedExample;
    }

    let example: Example | undefined;
    if (selectedExample) {
      example = (ExamplesList as any)[selectedExample];
    }

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
                        <p className="cursor-pointer p-2 font-semibold text-lg" onClick={() => {this.setState({selectedExample: undefined})}}>Examples</p>
                        <ul className='border-l border-gray-200 pl-4 ml-3 mt-1'>
                          {
                            examplesIterator.map((value) => {
                              return <li key={value[0]} className={`cursor-pointer hover:bg-sky-500/[.3] ${value[0] === selectedExample && 'bg-sky-500/[.3]'} p-2`} onClick={() => { this.setNewQuery('selectedExample', value[0]); this.setState({ showMenu: false }) }}>{value[1].displayName}</li>
                            })
                          }
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
                  <p className="cursor-pointer p-2 font-semibold text-lg" onClick={() => { this.setNewQuery('selectedExample', undefined) }}>Examples</p>
                    <ul className='border-l border-gray-200 pl-4 ml-3 mt-1'>
                      {
                        examplesIterator.map((value) => {
                          return <li key={value[0]} className={`cursor-pointer hover:bg-sky-500/[.3] ${value[0] === selectedExample && 'bg-sky-500/[.3]'} p-2`} onClick={() => { this.setNewQuery('selectedExample', value[0]) }}>{value[1].displayName}</li>
                        })
                      }
                    </ul>
                  </nav>

                </div>
              </div>
            </div>
            <div className="flex flex-col ml-6 w-0 flex-1 max-w-full lg:max-w-(screen-16)">
              {
                example ?
                  <div
                    className={`grid grid-cols-2 gap-4 mt-4`}
                  >
                    <div className={`col-span-2`}>
                      <GithubButton
                        text="See Example on GitHub"
                        href={`https://github.com/asyncapi/modelina/tree/master/examples/${selectedExample}`}
                        inNav="true"
                      />
                      <div className="prose py-6">
                        <ReactMarkdown>{example.description}</ReactMarkdown>
                        <a href={`https://github.com/asyncapi/modelina/edit/master/examples/${selectedExample}/README.md`} className="bg-blue-100 hover:bg-blue-200 text-blue-800 text-xs font-semibold p-2 rounded border border-blue-400">Edit Description</a>
                      </div>
                    </div>
                    <div className={`col-span-1`}>
                      <div
                        className="h-full bg-code-editor-dark text-white rounded-b shadow-lg font-bold"
                        style={{ height: '750px' }}
                      >
                        <MonacoEditorWrapper
                          options={{
                            readOnly: true
                          }}
                          key={selectedExample}
                          value={example.code}
                          language={"typescript"}
                        />
                      </div>
                    </div>
                    <div className={`col-span-1`}>
                      <div
                        className="h-full bg-code-editor-dark text-white rounded-b shadow-lg font-bold"
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
                  :
                  <div className="prose" style={{ maxWidth: '100%' }}>
                    <div className={"flex md:justify-end my-4 md:my-0"}>
                      <GithubButton
                        text="Edit readme on GitHub"
                        href={`https://github.com/asyncapi/modelina/edit/master/examples/README.md`}
                        inNav="true"
                      />
                    </div>
                    <ReactMarkdown rehypePlugins={[rehypeSlug]} remarkPlugins={[remarkGfm]}>{ExamplesReadme}</ReactMarkdown>
                  </div>
              }
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default withRouter(Examples);
