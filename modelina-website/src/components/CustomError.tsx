import Heading from './typography/Heading';
import Exclamation from "./icons/Exclamation";

function CustomError({ statusCode, errorMessage }: {statusCode: number, errorMessage: string}) {
  return (
    <div className="bg-code-editor-dark text-red-600 rounded-b shadow-lg flex h-full text-center">
      <div className="m-auto">
        <div className="m-auto w-28 h-28">
          <Exclamation />
        </div>
        <Heading> Error: {statusCode} </Heading>
        <p className="mt-4 mx-auto text-lg font-semibold text-red-600">
          {errorMessage}
        </p>
      </div>
    </div>
  );
}

export default CustomError;