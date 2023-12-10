import { usePlaygroundContext } from "../contexts/PlaygroundContext";
import InfoModal from "../InfoModal";

interface OutputProps { }

const OutputNavigation: React.FunctionComponent<OutputProps> = () => {
  const { renderModels, showGeneratorCode, setShowGeneratorCode } = usePlaygroundContext();
  return (
    <div className="px-2 h-full w-full flex flex-col bg-[#1f2937] text-white">
      <button className={`px-2 py-2 w-full text-left hover:bg-[#4b5563] text-sm ${showGeneratorCode && 'bg-[#3c4450]'}`} onClick={() => setShowGeneratorCode(true)}>Generator Code</button>

      <div className="flex w-full">
        <InfoModal text="Generated Models: ">
          <p>
            This list contains all the generated models, select one to show their generated code.
          </p>
        </InfoModal>
        <div className={`px-2 py-2 w-full text-left border-b-[1px] border-gray-700 text-sm`}>Generated Models</div>
      </div>

      {renderModels}
    </div>
  )
}

export default OutputNavigation;