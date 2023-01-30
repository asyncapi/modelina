import { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import Editor, { useMonaco } from '@monaco-editor/react';
import { debounce } from 'lodash';

let editor: any;
let monaco: any;

const renderHighlightedLines = (highlightedLines: number[]) => {
  return renderHighlightedRanges(highlightedLines.map(lineNumber => ({
    startLine: lineNumber,
    startCol: 0,
    endLine: lineNumber,
    endCol: 0,
    options: {
      isWholeLine: true,
    }
  })))
}

const renderHighlightedRanges = (highlightedRanges: any[]) => {
  return editor.deltaDecorations(editor.getModel().getAllDecorations(), highlightedRanges.map(range => ({
    range: new monaco.Range(range.startLine, range.startCol, range.endLine, range.endCol),
    options: {
      className: 'bg-code-editor-dark',
      marginClassName: 'bg-code-editor-dark',
      ...range.options
    },
  })))
}

export default function MonacoEditorWrapper({
  language,
  theme = 'asyncapi-theme',
  onChange = () => { },
  value,
  highlightedLines = [],
  highlightedRanges = [],
  updateHighlightOnChange = false,
  options,
  editorDidMount,
  ...props
}: any) {
  const monacoInstance = useMonaco();
  const previousValue = useRef(value);
  const debouncedOnChange = debounce(onChange, 500);

  const handleEditorDidMount = (getValue: any, ed: any) => {
    editor = ed;
    renderHighlightedLines(highlightedLines);
    renderHighlightedRanges(highlightedRanges);

    editor.onDidChangeModelContent((ev: any) => {
      const currentValue = editor.getValue()
      if (currentValue !== previousValue.current) {
        previousValue.current = currentValue
        const value = debouncedOnChange(ev, currentValue);

        if (typeof value === 'string') {
          if (currentValue !== value) {
            editor.setValue(value)
          }
        }
      }
    });

    editorDidMount(getValue, editor)
  }
  
  useEffect(() => {
    // do conditional chaining
    monaco?.languages.typescript.javascriptDefaults.setEagerModelSync(true);
    // or make sure that it exists by other ways
    if (monacoInstance) {
      console.log("here is the monaco instance:", monaco);
      monaco = monacoInstance
      monacoInstance.editor.defineTheme('asyncapi-theme', {
        base: 'vs-dark',
        inherit: true,
        colors: {
          'editor.background': '#252f3f',
          'editor.lineHighlightBackground': '#1f2a37',
        },
        rules: [{ token: '', background: '#252f3f' }],
      });
    }
  }, [monaco]);

  useEffect(() => {
    if (editor && updateHighlightOnChange) {
      renderHighlightedLines(highlightedLines)
      renderHighlightedRanges(highlightedRanges)
    }
  }, [highlightedLines, highlightedRanges]);

  return (
    <Editor
      onMount= { handleEditorDidMount }
      language = { language }
      theme = { theme }
      value = { value }
      options = { options }
      {...props }
    />
  );
}

MonacoEditorWrapper.propTypes = {
  value: PropTypes.string,
  language: PropTypes.string,
  editorDidMount: PropTypes.func,
  onChange: PropTypes.func,
};

MonacoEditorWrapper.defaultProps = {
  editorDidMount: () => { },
  onChange: () => { },
};
