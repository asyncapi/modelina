import Heading from './typography/Heading';
import Paragraph from './typography/Paragraph';
import Exclamation from "./icons/Exclamation";

function CustomError({ statusCode, errorMessage }: {statusCode: number, errorMessage: string}) {
  return (
    <div className="bg-code-editor-dark text-gray-700 rounded-b shadow-lg flex h-full text-center">
      <div className="m-auto">
        <Exclamation/>
        <Heading> Error: {statusCode} </Heading>
        <Paragraph className="mt-4 max-w-3xl mx-auto">
          {errorMessage}
        </Paragraph>
      </div>
    </div>
  );
}

export default CustomError;