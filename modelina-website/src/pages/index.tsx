
import Button from '@/components/buttons/Button';
import GithubButton from '@/components/buttons/GithubButton';
import CodeBlock from '@/components/CodeBlock';
import IconRocket from '@/components/icons/Rocket';
import GenericLayout from '@/components/layouts/GenericLayout';
import Heading from '@/components/typography/Heading';
import Paragraph from '@/components/typography/Paragraph';
import Image from 'next/image';

export default function Index() {
  const description =
    'Modelina is a library for generating data models based on inputs such as AsyncAPI, OpenAPI, or JSON Schema documents.';
  const image = '/img/social/modelina-card.jpg';

  return (
    <GenericLayout
      title="Modelina"
      description={description}
      image={image}
      wide
    >
      <div className="py-16 overflow-hidden lg:py-24">
        <div className="relative text-center">
          <Heading level="h1" typeStyle="heading-xl" className="mb-4">
            Generate data models for payload
          </Heading>
          <Paragraph className="mt-4 max-w-3xl mx-auto">
            {description}
          </Paragraph>
        </div>

        <div className="relative text-center mt-12">
          <Heading level="h1" typeStyle="heading-lg">
            How to get started
          </Heading>
          <Paragraph className="mt-4 max-w-3xl mx-auto">
            You can use through the AsyncAPI CLI or install it as a library.
          </Paragraph>
        </div>

        <div className='md:grid md:grid-cols-2 md:gap-8 md:items-start'>
          <div className="relative grid md:gap-8 md:items-center">
            <div className="relative hidden md:block md:mt-8 h-[300px]">
              <Image
                src={'/img/card/cli-card.jpg'}
                fill
                sizes='100%'
                alt={'CLI card'}
              />
            </div>
            <div className="relative mb-8 overflow-x-auto">
              <Heading level="h4" typeStyle="heading-md-semibold">
                AsyncAPI CLI
              </Heading>
              <Paragraph className="mt-3 md:pr-4">
                Get started immediately with Modelina through the AsyncAPI CLI or by installing it as a library.
              </Paragraph>
              <div className="mt-8">
                <CodeBlock
                  language="generator-cli"
                  showLineNumbers={false}
                  className="mt-8"
                  textSizeClassName="text-sm"
                >
                  asyncapi generate models typescript ./asyncapi.json
                </CodeBlock>
                <div className="mt-8">
                  <GithubButton
                    className="block md:mt-0 md:inline-block w-full sm:w-auto mt-8"
                    href="https://github.com/asyncapi/cli"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="relative grid md:gap-8 md:items-center">
            <div className="relative hidden md:block md:mt-8 h-[300px]">
              <Image
                src={'/img/card/modelina-card.jpg'}
                fill
                sizes='100%'
                alt={'Modelina card'}
              />
            </div>
            <div className="relative mb-8">
              <Heading level="h4" typeStyle="heading-md-semibold">
                Installation
              </Heading>
              <Paragraph className="mt-3 lg:pr-4">
                Install Modelina as a library to take full control.
              </Paragraph>
              <div className="mt-8">
                <CodeBlock
                  language="bash"
                  showLineNumbers={false}
                  className="mt-8"
                  textSizeClassName="text-sm"
                >
                  npm install @asyncapi/modelina
                </CodeBlock>
                <div className="mt-8">
                  <Button
                    className="hidden mt-2 md:mt-0 lg:inline-block md:ml-2"
                    text="Try The Playground"
                    href="/playground"
                    icon={<IconRocket className="inline-block -mt-1 w-6 h-6" />}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="relative text-center mt-12">
          <Heading level="h1" typeStyle="heading-lg">
            Usage
          </Heading>
          <Paragraph className="mt-4 max-w-3xl mx-auto">
            Modelina can be used in a wide range of scenarios, and is build to
            be apart of the core toolbox you can customize to your hearts
            desire.{' '}
            <b>Here is just a fraction of what you can do with Modelina.</b>
          </Paragraph>
        </div>

        <table className="flex flex-col mt-8 md:mt-20">
          <tbody>
            <tr className='border-b mt-6 md:mt-0 flex flex-col md:flex-row-reverse'>
              <td className="text-sm text-gray-900 font-light px-6 py-4 md:w-1/2 flex justify-center items-center">
                <b>
                  Modelina lets you generate data models from many types of{' '}
                  <a href="#inputs" className='italic underline underline-offset-2'>inputs</a>
                </b>
              </td>
              <td className="text-sm text-gray-900 font-light px-6 py-4 md:w-1/2">
                <CodeBlock
                  language="typescript"
                  showLineNumbers={false}
                  textSizeClassName="text-sm"
                >
                  {`const asyncapi = ...
const jsonschema = ...
const openapi = ...
const metamodel = ...
...
const models = await generator.generate(
  asyncapi | jsonschema | openapi | metamodel
);`}
                </CodeBlock>
              </td>
            </tr>

            <tr className='border-b mt-6 md:mt-0 flex flex-col md:flex-row'>
              <td className="text-sm text-gray-900 font-light px-6 py-4 md:w-1/2 flex justify-center items-center">
                <b>
                  Use the same inputs across a range of different{' '}
                  <a href="#outputs" className='italic underline underline-offset-2'>generators</a>
                </b>
              </td>
              <td className="text-sm text-gray-900 font-light px-6 py-4 md:w-1/2">
                <CodeBlock
                  language="typescript"
                  showLineNumbers={false}
                  textSizeClassName="text-sm"
                >
                  {`const generator = new TypeScriptGenerator();
const generator = new CsharpGenerator();
const generator = new JavaGenerator();
const generator = new RustGenerator();
...
const models = await generator.generate(input);`}
                </CodeBlock>
              </td>
            </tr>

            <tr className='border-b mt-6 md:mt-0 flex flex-col md:flex-row-reverse'>
              <td className="text-sm text-gray-900 font-light px-6 py-4 md:w-1/2 flex justify-center items-center">
                <p>
                  <b>Easily let you interact with the generated models.</b>-
                  Want to show the generated models on a website? Sure! - Want
                  to generate the models into files? Sure! - Want to combine all
                  the models into one single file? Sure! Whatever interaction
                  you need, you can create.
                </p>
              </td>
              <td className="text-sm text-gray-900 font-light px-6 py-4 md:w-1/2">
                <CodeBlock
                  language="typescript"
                  showLineNumbers={false}
                  textSizeClassName="text-sm"
                >
                  {`const models = await generator.generate(input);
for (const model in models) { 
  const generatedCode = model.result;
  const dependencies = model.dependencies;
  const modeltype = model.type;
  const modelName = model.modelName;
  ...
}`}
                </CodeBlock>
              </td>
            </tr>

            <tr className='border-b mt-6 md:mt-0 flex flex-col md:flex-row'>
              <td className="text-sm text-gray-900 font-light px-6 py-4 md:w-1/2 flex justify-center items-center">
                <b>
                  Easily modify how models are{' '}
                  <a href="./docs/constraints.md" className='italic underline underline-offset-2'>constrained</a> into the
                  output
                </b>
              </td>
              <td className="text-sm text-gray-900 font-light px-6 py-4 md:w-1/2">
                <CodeBlock
                  language="typescript"
                  showLineNumbers={false}
                  textSizeClassName="text-sm"
                >
                  {`const generator = new TypeScriptGenerator({
  constraints: {
    modelName: ({modelName}) => {
      // Implement your own constraining logic
      return modelName;
    }
  }
});`}
                </CodeBlock>
              </td>
            </tr>

            <tr className='border-b mt-6 md:mt-0 flex flex-col md:flex-row-reverse'>
              <td className="text-sm text-gray-900 font-light px-6 py-4 md:w-1/2 flex justify-center items-center">
                <b>
                  Seamlessly layer additional or replacement code{' '}
                  <a href="./docs/presets.md" className='italic underline underline-offset-2'>
                    on top of each other to customize the models
                  </a>{' '}
                  to your use-case
                </b>
              </td>
              <td className="text-sm text-gray-900 font-light px-6 py-4 md:w-1/2">
                <CodeBlock
                  language="typescript"
                  showLineNumbers={false}
                  textSizeClassName="text-sm"
                >
                  {`const generator = new TypeScriptGenerator({
  presets: [
    {
      class: {
        additionalContent({ content }) {
          return \`\${content}
public myCustomFunction(): string {
  return 'A custom function for each class';
}\`;
        },
      }
    }
  ]
});
const models = await generator.generate(input);`}
                </CodeBlock>
              </td>
            </tr>

            <tr className='border-b mt-6 md:mt-0 flex flex-col md:flex-row'>
              <td className="text-sm text-gray-900 font-light px-6 py-4 md:w-1/2 flex justify-center items-center">
                <b>
                  Seamlessly lets you{' '}
                  <a href="./docs/presets.md" className='italic underline underline-offset-2'>
                    combine multiple layers of additional or replacement code
                  </a>
                </b>
              </td>
              <td className="text-sm text-gray-900 font-light px-6 py-4 md:w-1/2">
                <CodeBlock
                  language="typescript"
                  showLineNumbers={false}
                  textSizeClassName="text-sm"
                >
                  {`const myCustomFunction1 = {
  class: {
    additionalContent({ content }) {
      return \`\${content}
public myCustomFunction(): string {
return 'A custom function for each class';
}\`;
    },
  }
};
const myCustomFunction2 = {...};
const generator = new TypeScriptGenerator({
  presets: [
    myCustomFunction1,
    myCustomFunction2
  ]
});
const models = await generator.generate(input);`}
                </CodeBlock>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </GenericLayout>
  );
}
