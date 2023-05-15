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
};

class Examples extends React.Component<
  ModelinaExamplesProps,
  ModelinaExamplesState
> {
  hasLoadedQuery: boolean = false;
  constructor(props: ModelinaExamplesProps) {
    super(props);
    this.state = {
      selectedExample: undefined
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
    if(queryValue) {
      /* eslint-disable-next-line security/detect-object-injection */
      newQuery.query[queryKey] = String(queryValue);
    } else {
      delete newQuery.query[queryKey];
    }
    Router.push(newQuery, undefined, { scroll: true });
  }
  render() {
    let { selectedExample } = this.state;

    const query = this.props.router.query as ExampleQueryOptions;
    if (query.selectedExample !== undefined) {
      selectedExample = query.selectedExample;
    }

    let example: Example | undefined;
    if(selectedExample) {
      example = (ExamplesList as any)[selectedExample];
    }
    
    return (
      <div className="py-4 lg:py-8">
        <div
          className={`grid grid-cols-4 gap-4 mt-4`}
        >
          <div className={`col-span-1`}>
            {
              examplesIterator.map((value) => {
                return <div className={`hover:bg-sky-500/[.3] ${value[0] === selectedExample && 'bg-sky-500/[.3]'} p-2`} onClick={() => {this.setNewQuery('selectedExample', value[0])}}>{value[1].displayName}</div>
              })
            }
          </div>
          <div className={`col-span-3`}>
            {
              example ? 
              <div
                className={`grid grid-cols-2 gap-4 mt-4`}
              >
                <div className={`col-span-1`}>
                  <GithubButton
                    text="See Example on GitHub"
                    href={`https://github.com/asyncapi/modelina/tree/master/examples/${selectedExample}`}
                    inNav="true"
                  />
                  <div className="prose p-6">
                    <ReactMarkdown>{example.description}</ReactMarkdown>
                    <a href={`https://github.com/asyncapi/modelina/tree/master/examples/${selectedExample}/README.md`} className="bg-blue-100 hover:bg-blue-200 text-blue-800 text-xs font-semibold p-2 rounded border border-blue-400">Edit Description</a>
                  </div>

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
              <div>
                <div className="prose">
                  <div className={"flex justify-end"}>
                    <GithubButton
                      text="Edit readme on GitHub"
                      href={`https://github.com/asyncapi/modelina/tree/master/examples/README.md`}
                      inNav="true"
                    />
                  </div>
                  <ReactMarkdown rehypePlugins={[rehypeSlug]} remarkPlugins={[remarkGfm]}>{ExamplesReadme}</ReactMarkdown>
                </div>
              </div>
            }
          </div>
        </div>
      </div>
    );
  }
}
export default withRouter(Examples);
