import { Calendar, Ticket, MapPin, Clock, Search, CheckCircle2 } from 'lucide-react';
import { useState } from "react";
import useFetchJson from "../utils/useFetchJson";
import type bookingInfo from "../interfaces/BookingInfo";
import type BookingInfo from "../interfaces/BookingInfo";
import { useNavigate } from 'react-router-dom';

CancelBookingPage.route = {
  path: '/CancelBooking',
  menuLabel: 'Avboka Biljett',
  index: 5
};
/*
- (hittat en bokning) section
  - info om bokning
    - Bild?
  - knapp för att avboka
- Bekräftelse section
  - Gå tillbaka till homepage
  
  */
export default function CancelBookingPage() {
  const navigate = useNavigate();

  const [bookingError, setBookingError] = useState('');
  const [bookingID, setBookingID] = useState('');
  const [switchSection, setSwitchSection] = useState(true);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const [searchedBooking, setSearchedBooking] = useState<bookingInfo | null>(null);

  const [bookingInfo] = useFetchJson<BookingInfo[] | null>(`/api/bookingInfo?`);

  const confirmSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    for (let search of bookingInfo!) {
      if (bookingID == search.bookingId) {
        setSearchedBooking(search);
      }
    }

    if (bookingInfo == null) {
      setBookingError("Kunde inte hitta bokning");
    }
    setBookingID('');
  };

  async function cancelBooking() {
    if (!searchedBooking?.bookingId) { return false; }
    const result = await fetch(`/api/bookings/${searchedBooking?.bookingId}`,
      {
        method: 'DELETE'
      },
    );
    if (result.ok) { setSwitchSection(false); return true; }
    else { return false; }
  }

  return (
    <div className="flex flex-col items-center">
      {switchSection ? (
        <section id="cancel" className="flex flex-col items-center w-3/4">
          <form onSubmit={confirmSearch} className={`flex flex-col items-center bg-zinc-950 rounded-2xl 
          border-2 border-stone-700/30 
          p-8 md:p-12 mb-8 mt-40 md:mt-70
          md:w-1/2 ${showConfirmation ? " blur-[2px]" : ""}`}
          >
            <h2 className="text-2xl md:text-3xl text-center mb-8">
              Sök bokning
            </h2>

            {/* Booking ID Input */}
            <div className="max-w-md mx-auto mb-8">
              <div className="relative">
                <label
                  htmlFor="email"
                  className="block text-center mb-2 text-gray-400"
                >
                  Boknings-kod <span className="text-red-500">*</span>
                </label>

                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />

                  <input
                    type="text" maxLength={10} required
                    value={bookingID}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setBookingID(e.target.value);
                      setBookingError("");
                    }}

                    placeholder="ABCDE12345"
                    className="w-full bg-black border rounded-lg pl-12 pr-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 transition-all "
                  />
                </div>
                {bookingError && (
                  <p className="mt-2 text-sm text-red-500 text-center">
                    {bookingError}
                  </p>
                )}
                <p className="mt-2 text-xs text-gray-500 text-center">
                  Skriv in din boknings-kod (10 karaktärer)
                </p>
              </div>
            </div>

            {/* Search Button */}
            <button
              type="submit"
              className="px-16 py-4 rounded-xl border-2 
                      bg-red-800 border-red-800 hover:bg-red-900 hover:border-red-900 text-white 
                      transition-all text-lg font-medium
                      fit-content
                      "
            >
              Sök bokning
            </button>
          </form>
          {searchedBooking != null ?

            <div className={`flex flex-col items-center
            bg-zinc-950 rounded-2xl 
              border-2 border-stone-700/30
              p-8 md:p-12 mb-8    
              w-content
              fit-content          
              gap-5 ${showConfirmation ? "blur-[2px]" : ""}`}
            >
              <h1 className="text-3xl">Bokningsdetaljer:</h1>
              <h2 className="text-2xl mt-5">{searchedBooking.filmTitle} </h2>
              <div className="grid grid-cols-2">
                <div className='grid grid-cols-2 col-span-1'>
                  <Ticket className='text-red-800' />
                  <p>{searchedBooking.rowNr}, {searchedBooking.columnNr}</p>
                </div>
                <div className='grid grid-cols-2 col-span-1 '>
                  <Calendar className='text-red-800' />
                  <p>{searchedBooking.timeSlot.toString().slice(0, 10)}</p>
                </div>
                <div className='grid grid-cols-2 col-span-1'>
                  <Clock className='text-red-800' />
                  <p className=''>Tid</p>
                  <p>{searchedBooking.timeSlot.toString().slice(11, 16)}</p>
                </div>
                <div className='grid grid-cols-2 col-span-1'>
                  <MapPin className='text-red-800' />
                  <p>{searchedBooking.venueName}</p>
                </div>
              </div>

              {/* Needs better styling and responsiveness from here */}

              <button
                onClick={() => setShowConfirmation(true)}
                className="mt-5 px-10 py-2 rounded-xl border-2 
                      bg-red-800 border-red-800 hover:bg-red-900 hover:border-red-900 text-white 
                      transition-all text-md font-medium
                      fit-content
                      "
              >
                Avboka
              </button>
            </div> : <></>}
          {showConfirmation && (
            <div className="flex flex-col fixed top-80 m-auto justify-center items-center w-1/3 h-50  bg-zinc-950 border border-red-800
                 text-white px-4 py-3 rounded-lg shadow-lg animate-fade-in gap-10">
              <h2 className='text-2xl pt-5 px-5'>Är du säker du vill avboka?</h2>
              <div className='flex gap-10'>
                <button onClick={cancelBooking} className="mt-5 px-10 py-2 rounded-xl border-2 
                      bg-red-800 border-red-800 hover:bg-red-900 hover:border-red-900 text-white 
                      transition-all text-md font-medium
                      fit-content
                      ">JA</button>
                <button onClick={() => setShowConfirmation(false)} className="mt-5 px-10 py-2 rounded-xl border-2 
                      bg-red-800 border-red-800 hover:bg-red-900 hover:border-red-900 text-white 
                      transition-all text-md font-medium
                      fit-content
                      " >NEJ</button>
              </div>
            </div>
          )}

        </section>
      ) : (
        // Section when cancellation is confirmed
        <section className="min-h-screen mx-auto max-w-4xl px-2 sm:px-4 flex flex-col pt-18 pb-8">
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
            <div className="p-4 sm:p-8 flex flex-col md:flex-row gap-4 md:gap-6">
              <div className="flex-1 flex flex-col gap-4">
                <div className="p-2 sm:p-4 flex flex-col gap-4">
                  <div className="flex flex-col items-center">
                    <h3 className="text-lg font-semibold text-gray-500 mb-2">
                      Boknings-kod:
                    </h3>
                    <h4 className='text-md'>
                      {searchedBooking?.bookingId}
                    </h4>
                    <h3 className='mt-10 text-lg'>
                      {searchedBooking?.filmTitle}
                    </h3>
                    <h2 className="text-2xl font-bold text-white mb-2">
                    </h2>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-zinc-900/50 p-6 sm:p-6 text-center">
              <button
                className='rounded-2xl bg-gray-800 px-7 py-2'
                onClick={() => navigate("/")}>
                Gå till hemsidan
              </button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
