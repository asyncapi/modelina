import { TypeScriptGenerator } from '../../../';
import { React, useState, useEffect } from 'react';

export default function App() {
  const [models, setModels] = useState('');

  useEffect(() => {
    (async () => {
      const generator = new TypeScriptGenerator();
      const input = {
        $schema: 'http://json-schema.org/draft-07/schema#',
        type: 'object',
        additionalProperties: false,
        properties: {
          email: {
            type: 'string',
            format: 'email'
          }
        }
      };
      const models = await generator.generate(input);
      const modelsCode = models.map((model) => model.result).join('\n');
      setModels(modelsCode);
    })();
  }, []);

  return (
    <div className="App" data-testid="App">
      {models || 'Model generation is processed. Please wait...'}
    </div>
  );
}
