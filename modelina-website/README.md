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

## Contributors flow

1. Fork the repository by clicking on `Fork` option on top right of the main repository.

2. Open Command Prompt on your local computer.

3. Clone the forked repository by adding your own GitHub username in place of `<username>`.
   For multiple contributions it is recommended to have [proper configuration of forked repo](https://github.com/asyncapi/community/blob/master/git-workflow.md).

```bash
    git clone https://github.com/<username>/website/
```

4. Navigate to the website directory.

```bash
    cd website
```

5. Install all website dependencies. 

```bash
    npm install
```

6. Run the website locally.

```bash
    npm run dev
```

7. Access the live development server at [localhost:3000](http://localhost:3000).

You'll be able to access the development server and you can contribute accordingly.