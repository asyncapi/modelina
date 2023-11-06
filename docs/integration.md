# Integrations
This readme file goes into details how to integrate Modelina into various environments.

<!-- toc is generated with GitHub Actions do not remove toc markers -->

<!-- toc -->

- [Integrate Modelina in a browser](#integrate-modelina-in-a-browser)
  * [FAQ](#faq)
    + [TypeScript and Jest](#typescript-and-jest)
  * [Security NOTICE](#security-notice)
- [Integrate Modelina in an AsyncAPI generator template](#integrate-modelina-in-an-asyncapi-generator-template)
- [Integrate Modelina into Maven](#integrate-modelina-into-maven)

<!-- tocstop -->

## Integrate Modelina in a browser

Integrating Modelina into websites is is one of the core features, and each framework is different, so here are some of examples:

- [Using Modelina in React](../examples/integrate-with-react)
- [Using Modelina in Next](../examples/integrate-with-next)

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

## Integrate Modelina into Maven

There are at least two ways you can integrate Modelina into your build process for Maven projects, either with the AsyncAPI CLI or with a custom build script. Which one to choose all depends on your scenario, look below:

**Custom build script**
- DO work with other inputs then AsyncAPI
- DO work when needing extensive build options and configurations

Checkout the Maven example here: [Integrate Modelina into Maven](../examples/integrate-modelina-into-maven)

**AsyncAPI CLI**

- DO NOT work if you have other inputs then AsyncAPI
- DO NOT need extensive build options and configuration

We don't have a full example for this, but you can use similar concept as the custom build script. However, instead you just install and call the AsyncAPI CLI directly in the plugin execution when utilizing the [frontend-maven-plugin](https://github.com/eirslett/frontend-maven-plugin) and [more specifically the NPX execution](https://github.com/eirslett/frontend-maven-plugin#npx).