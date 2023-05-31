# Modelina Website

This website is a `Next` + TypeScript website.

The website is being deployed to Netlify along side serverless functions.

## How to run it
It uses the local version of Modelina, which means that before you run the website, make sure you build Modelina through `npm run build:modelina`.

## Playground

Here is a quick overview of where some of the functions for rendering the playground work:

- `/src/helpers/GeneratorCode` contains all the functions for creating the generator code, shown instead of the options.
- `/src/pages/api/functions` contain all the individual generators that when the frontend calls the API `/api/generate` will perform the code generation with Modelina.
- `src/components/playground/PlaygroundOptions.tsx` is the main component that renders the options based on which output is selected.
- `src/components/playground/options` contain all the individual react components for showing the output options.
- `src/components/playground/Playground.tsx` is the main playground component, and is the one rendered by the playground page.
- `src/components/playground/GeneratedModels.tsx` is the playground component responsible for rendering the generated models.