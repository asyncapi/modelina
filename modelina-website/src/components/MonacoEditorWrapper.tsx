import Editor, { useMonaco } from '@monaco-editor/react';
import { debounce } from 'lodash';
// eslint-disable-next-line import/no-extraneous-dependencies
import PropTypes from 'prop-types';
import { useEffect, useRef } from 'react';

export default function MonacoEditorWrapper({
  language,
  theme = 'asyncapi-theme',
  onChange = undefined,
  value,
  options,
  editorDidMount,
  ...props
}: any) {
  const monacoInstance = useMonaco();
  const previousValue = useRef(value);
  const debouncedOnChange = debounce(onChange, 500);
  const handleEditorDidMount = (editor: any) => {
    editor.onDidChangeModelContent((ev: any) => {
      const currentValue = editor.getValue();

      if (currentValue !== previousValue.current) {
        previousValue.current = currentValue;
        const debouncedValue = debouncedOnChange(ev, currentValue);

        if (typeof debouncedValue === 'string' && currentValue !== value) {
          editor.setValue(debouncedValue);
        }
      }
    });

    editorDidMount(editor.getValue, editor);
  };

  // Alias because Modelina uses cplusplus

  if (language === 'cplusplus') {
    // eslint-disable-next-line no-param-reassign
    language = 'cpp';
  }

  useEffect(() => {
    // do conditional chaining
    monacoInstance?.languages.typescript.javascriptDefaults.setEagerModelSync(true);
    // or make sure that it exists by other ways
    if (monacoInstance) {
      monacoInstance.editor.defineTheme('asyncapi-theme', {
        base: 'vs-dark',
        inherit: true,
        colors: {
          'editor.background': '#252f3f',
          'editor.lineHighlightBackground': '#1f2a37'
        },
        rules: [{ token: '', background: '#252f3f' }]
      });
    }
  }, [monacoInstance]);

  return (
    <Editor
      onMount={handleEditorDidMount}
      language={language}
      theme={theme}
      value={value}
      options={options}
      {...props}
    />
  );
}

MonacoEditorWrapper.propTypes = {
  value: PropTypes.string,
  language: PropTypes.string,
  editorDidMount: PropTypes.func,
  onChange: PropTypes.func,
  options: PropTypes.object
};

MonacoEditorWrapper.defaultProps = {
  editorDidMount: () => {},
  onChange: () => {}
};
