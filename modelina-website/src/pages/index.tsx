import Button from '@/components/buttons/Button';
import GithubButton from '@/components/buttons/GithubButton';
import IconRocket from '@/components/icons/Rocket';
import GenericLayout from '@/components/layouts/GenericLayout';
import MonacoEditorWrapper from '@/components/MonacoEditorWrapper';
import Heading from '@/components/typography/Heading';
import Paragraph from '@/components/typography/Paragraph';

export default function Index() {
  const description = 'Sometimes you just want to generate data models for your payload. Modelina is a library for generating data models based on inputs such as AsyncAPI, OpenAPI, or JSON Schema documents.';
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
            <Heading level="h1" typeStyle="heading-lg">
              Modelina
            </Heading>
            <Paragraph className="mt-4 max-w-3xl mx-auto">
              {description}
            </Paragraph>
          </div>

          <div className="relative mt-12 lg:mt-20 lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center">
            <div className="relative mb-8 lg:mt-8">
              <Heading level="h4" typeStyle="heading-md-semibold">
                  Installation & Usage
              </Heading>
              <Paragraph className="mt-3 lg:pr-4">
                Start using Modelina really quickly. Select one of the available languages we offer and start generating models from your AsyncAPI document in a few seconds.
              </Paragraph>
              <div className="mt-8">
                <MonacoEditorWrapper language={"bash"} value={"npm install @asyncapi/modelina"} />
                <div className="mt-8">
                  <GithubButton
                    className="block mt-2 md:mt-0 md:inline-block w-full sm:w-auto mt-8"
                    href="https://www.github.com/asyncapi/modelina"
                  />
                  <Button 
                    className="hidden mt-2 md:mt-0 lg:inline-block md:ml-2" 
                    text="Try it now"
                    href="/playground"
                    icon={<IconRocket className="inline-block -mt-1 w-6 h-6" />}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </GenericLayout>
  );
}
