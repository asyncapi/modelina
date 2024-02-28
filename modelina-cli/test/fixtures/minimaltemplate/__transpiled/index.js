'use strict';

require('source-map-support/register');
var generatorReactSdk = require('@asyncapi/generator-react-sdk');
var jsxRuntime = require('react/cjs/react-jsx-runtime.production.min');

function index ({
  asyncapi,
  params
}) {
  return /*#__PURE__*/jsxRuntime.jsxs(generatorReactSdk.File, {
    name: "asyncapi.md",
    children: [/*#__PURE__*/jsxRuntime.jsx(generatorReactSdk.Text, {
      children: "This is a markdown file for my application."
    }), /*#__PURE__*/jsxRuntime.jsxs(generatorReactSdk.Text, {
      children: ["App name is: **", asyncapi.info().title(), "**"]
    }), /*#__PURE__*/jsxRuntime.jsxs(generatorReactSdk.Text, {
      children: ["Version ", params.version, " running on ", params.mode, " mode "]
    })]
  });
}

module.exports = index;
//# sourceMappingURL=index.js.map
