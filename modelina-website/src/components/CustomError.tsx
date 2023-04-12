import Heading from './typography/Heading';
import Paragraph from './typography/Paragraph';
function CustomError({ statusCode }: { statusCode: number }) {
  return (
    <div className="bg-code-editor-dark text-red-400 rounded-b shadow-lg flex h-full text-center">
      <div className="m-auto">
        <Heading> Error: {statusCode} </Heading>
        <Paragraph className="mt-4 max-w-3xl mx-auto text-red-400">
          Could not generate new code!
        </Paragraph>
      </div>
    </div>
  )
}

CustomError.getInitialProps = ({ res , err }: {res: any, err: any}) => {
    const error = err ? err.statusCode : 404;
    const statusCode = res ? res.statusCode : error;
    return { statusCode }
}
  
export default CustomError;