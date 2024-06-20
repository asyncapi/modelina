import { usePlaygroundContext } from '../contexts/PlaygroundContext';
import InfoModal from '../InfoModal';

interface OutputProps {}

const OutputNavigation: React.FunctionComponent<OutputProps> = () => {
  const { renderModels, showGeneratorCode, setShowGeneratorCode } = usePlaygroundContext();

  return (
    <div className='flex size-full flex-col bg-[#1f2937] px-2 text-white'>
      <button
        className={`w-full p-2 text-left text-sm hover:bg-[#4b5563] ${showGeneratorCode && 'bg-[#3c4450]'}`}
        onClick={() => setShowGeneratorCode(true)}
      >
        Generator Code
      </button>

      <div className='flex w-full'>
        <InfoModal text='Generated Models: '>
          <p>This list contains all the generated models, select one to show their generated code.</p>
        </InfoModal>
        <div className={'w-full border-b border-gray-700 p-2 text-left text-sm'}>Generated Models</div>
      </div>

      {renderModels}
    </div>
  );
};

export default OutputNavigation;
