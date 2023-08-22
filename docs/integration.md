# Integrations
This readme file goes into details how to integrate Modelina into various environments.

<!-- toc is generated with GitHub Actions do not remove toc markers -->

<!-- toc -->

- [Integrate Modelina in a browser](#integrate-modelina-in-a-browser)
  * [Security NOTICE](#security-notice)
- [Integrate Modelina in an AsyncAPI generator template](#integrate-modelina-in-an-asyncapi-generator-template)

<!-- tocstop -->

## Integrate Modelina in a browser

Integrating Modelina into websites is is one of the core features, and each framework is different, so here are some of examples:

- [Using Modelina in React](../examples/integrate-with-react/)
- [Using Modelina in Next](../examples/integrate-with-next/)
- 
> NOTICE: Modelina only works server side and not on the client side. In the React example its always rendered on the server side, and with Next you have to utilize [data fetching techniques](https://nextjs.org/docs/basic-features/data-fetching/overview) to retrieve the generated code from the server. 

There are a few exceptions to the features Modelina support in a website environment. Those are listed here below:

- You cannot use the [file generator](./advanced.md#generate-models-to-separate-files) to write to the client's disk, instead utilize the `generateCompleteModels` function, that gives you the same generated output in memory instead of writing it to files.

### FAQ

#### TypeScript and Jest
If you ever encounter `Jest encountered an unexpected token` and something along the lines of:

```
Details:
    /Users/lagoni/Documents/github/generator-model-sdk/node_modules/@stoplight/spectral-core/node_modules/jsonpath-plus/dist/index-browser-esm.js:1103
    export { JSONPath };
    ^^^^^^
    SyntaxError: Unexpected token 'export'
```

Make sure your Jest configuration contains the following:

```
transformIgnorePatterns = [
  '/node_modules/@stoplight/spectral-core/node_modules/(!?jsonpath-plus)',
];
```

### Security NOTICE
Do NOT enable users to write their own option callbacks. This includes but not limits to preset hooks and constrain rules. The reason for this is that in some cases it will enable arbitrary code execution on your webserver (which you most probably don't want!). 

To be on the safeside, only enable the user to chose between the internal options and presets, as you can see the [playground does](https://www.asyncapi.com/tools/modelina).

## Integrate Modelina in an AsyncAPI generator template
TODO
