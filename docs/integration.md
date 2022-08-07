## Integrations

<!-- toc is generated with GitHub Actions do not remove toc markers -->

<!-- toc -->

- [Integrate Modelina in a website](#integrate-modelina-in-a-website)
  * [Security NOTICE](#security-notice)
- [Integrate Modelina in an AsyncAPI generator template](#integrate-modelina-in-an-asyncapi-generator-template)

<!-- tocstop -->

## Integrate Modelina in a website

Integrating Modelina into websites is is one of the core features, and each framework is different, so here are some of examples:

- [Using Modelina in React](../examples/generate-in-react/)

There are a few exceptions to the features Modelina support in a website environment. Those are listed here below:

- You cannot use the [file generator](./advanced.md#generate-models-to-separate-files) to write to the client's disk.

### Security NOTICE
Do NOT enable users to write their own option callbacks. This includes but not limits to preset hooks and constrain rules. The reason for this is that in some cases it will enable arbitrary code execution on your webserver (which you most probably don't want!). 

To be on the safeside, only enable the user to chose between the internal options and presets, as you can see the [playground does](https://www.asyncapi.com/tools/modelina).

## Integrate Modelina in an AsyncAPI generator template
TODO
