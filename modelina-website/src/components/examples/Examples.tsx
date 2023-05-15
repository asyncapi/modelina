import React from 'react';
import MonacoEditorWrapper from '../MonacoEditorWrapper';
import Router, { withRouter, NextRouter } from 'next/router';
import { ParsedUrlQuery } from 'querystring';
import ExamplesList from "../../../config/examples.json";
import ReactMarkdown from 'react-markdown';
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
   * Set a query key and value
   */
  setNewQuery(queryKey: string, queryValue: any) {
    const newQuery = {
      query: { ...this.props.router.query }
    };
    /* eslint-disable-next-line security/detect-object-injection */
    newQuery.query[queryKey] = String(queryValue);
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
    } else {
      example = ExamplesList['adapting-input-and-output'];
    }
    
    return (
      <div className="py-4 lg:py-8">
        <div>

        </div>
        <div
          className={`grid grid-cols-4 gap-4 mt-4`}
        >
          <div className={`col-span-1`}>
            {
              examplesIterator.map((value) => {
                return <div className={`hover:bg-sky-500/[.3] ${value[0] === selectedExample && 'bg-sky-500/[.3]'}`} onClick={() => {this.setNewQuery('selectedExample', value[0])}}>{value[1].displayName}</div>
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
                  <div className="prose">
                    <ReactMarkdown>{example.description}</ReactMarkdown>
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
              <div></div>
            }
          </div>
        </div>
      </div>
    );
  }
}
export default withRouter(Examples);
