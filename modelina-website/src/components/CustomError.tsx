import Exclamation from './icons/Exclamation';
import Heading from './typography/Heading';

function CustomError({
  statusCode,
  errorMessage
}: {
  statusCode: number;
  errorMessage: string;
}) {
  return (
    <div className='flex h-full rounded-b bg-code-editor-dark text-center text-red-600 shadow-lg'>
      <div className='m-auto'>
        <div className='m-auto size-28'>
          <Exclamation />
        </div>
        <Heading> Error: {statusCode} </Heading>
        <p className='mx-auto mt-4 text-lg font-semibold text-red-600'>
          {errorMessage}
        </p>
      </div>
    </div>
  );
}

export default CustomError;
