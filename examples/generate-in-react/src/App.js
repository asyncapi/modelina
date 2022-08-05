
function App() {
  const generator = new JavaScriptGenerator();
  const jsonSchemaDraft7 = {
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
  const models = await generator.generate(jsonSchemaDraft7);
  const modelsCode = models.map((model) => model.result);
  return (
    <div className="App">
      {modelsCode}
    </div>
  );
}

export default App;
