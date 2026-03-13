import { CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function UnbookConfirmed() {

    const navigate = useNavigate();

    return (
        <section className="
        mt-30 min-h-screen
        w-1/2
        px-2 sm:px-4
        flex flex-col
        pt-18 pb-8">
          <div className="bg-zinc-950 rounded-3xl  mx-auto w-full shadow-lg border border-zinc-700 overflow-hidden">
            <div className="bg-green-800 p-4 sm:p-6 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-4">
                <CheckCircle2 className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">
                Avbokning bekräftad!
              </h2>
              <p className="text-white/90">
                Tack för att du väljer vår bio.
              </p>
            </div>

            <div className="bg-zinc-900/50 p-6 sm:p-6 text-center">
              <button
                className='rounded-2xl bg-gray-800 px-7 py-2 hover:bg-gray-900 scale-130'
                onClick={() => navigate("/")}>
                Gå till hemsidan
              </button>
            </div>
          </div>
        </section>
    );
}