interface YesNoProps {
    question: string;
    onYes: () => void;
    onNo: () => void;
}

export default function YesNoPop({ question, onYes, onNo }: YesNoProps) {

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
            <div className="
                flex flex-col min-w-87.5 md:min-w-125 max-w-1/3 md:h-50  
                justify-center items-center 
                bg-zinc-950 border border-red-800
                text-white px-4 py-3 rounded-lg shadow-lg animate-fade-in gap-10">
                <h2 className='text-2xl pt-5 px-5'>{question}</h2>
                <div className='flex gap-10 mb-10'>
                    <button onClick={onYes} className="mt-5 px-10 py-2 rounded-xl border-2 
                      bg-red-800 border-red-800 hover:bg-red-900 hover:border-red-900 text-white 
                      transition-all text-md font-medium
                      fit-content
                      ">Ja</button>
                    <button onClick={onNo} className="mt-5 px-10 py-2 rounded-xl border-2 
                      bg-red-800 border-red-800 hover:bg-red-900 hover:border-red-900 text-white 
                      transition-all text-md font-medium
                      fit-content
                      " >Nej</button>
                </div>
            </div>
        </div>
    );
}