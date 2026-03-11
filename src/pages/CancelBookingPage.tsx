import { Calendar, Ticket, MapPin, Clock, Search, Mail } from 'lucide-react';
import { useState, useEffect, useRef } from "react";
import useFetchJson from "../utils/useFetchJson";
import fetchJson from '../utils/fetchJson';
import type bookingInfo from "../interfaces/BookingInfo";
import type MovieDetails from '../interfaces/MovieDetails';
import { useSearchParams } from 'react-router-dom';
import UnbookConfirmed from '../parts/UnbookConfirmed';
import YesNoPop from '../parts/YesNoPop';

CancelBookingPage.route = {
  path: '/avboka',
  menuLabel: 'Avboka Biljett'
};

export default function CancelBookingPage() {

  const [searchParams] = useSearchParams();

  // Initializing page variables
  const [bookingError, setBookingError] = useState('');
  const [bookingID, setBookingID] = useState('');
  const [email, setEmail] = useState('');
  const [switchSection, setSwitchSection] = useState(true);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [filmData, setFilmData] = useState<MovieDetails | null>(null);

  useEffect(() => {
    const searchBookingID = searchParams.get("bookingID");
    const searchEmail = searchParams.get("email");

    if (searchBookingID != null && searchEmail != null) {
      setBookingID(searchBookingID);
      setEmail(searchEmail);
    }
  });

  // Fetching data from db
  const [searchedBooking, setSearchedBooking] = useState<bookingInfo | null>(null);
  const [bookingInfo] = useFetchJson<bookingInfo[] | null>(`/api/bookingInfo`);

  // Main booking cancellation logic
  const confirmSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Resets searched booking so that next section doesnt appear
    setSearchedBooking(null);

    const result = await fetchJson(`/api/userBookings?WHERE=bookingId=${bookingID}ANDemail=${email}`);

    // Cancels search if email and booking ID doesn't correspond to table data
    // result[0] since result is an array of 1 element and we want the first
    if (result[0] == null) {
      setBookingError('Hittade ingen bokning');
      return;
    }

    // Searches all bookings for id
    for (let search of bookingInfo!) {
      if (bookingID == search.bookingId) {
        // Found booking, applies that booking as the current one
        setSearchedBooking(search);
        // Extracting film cover image
        const filmInfo = await fetchJson(`/api/films?WHERE=id=${search.filmID}`);
        setFilmData(filmInfo[0]);
        break;
      }
    }

    // Resetting messages
    setEmail('');
    setBookingID('');
  };

  async function cancelBooking() {
    if (!searchedBooking?.bookingId) { return false; }
    const result = await fetch(`/api/bookings/${searchedBooking?.bookingId}`,
      {
        method: 'DELETE'
      },
    );
    if (result.ok) {
      setSwitchSection(false);
      window.scrollTo(0, 0);
      return true;
    }
    else { return false; }
  }

  // Scroll to booking details (if found)
  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (searchedBooking) {
      setTimeout(() => {
        divRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center"
        });
      }, 10);
    }
  }, [searchedBooking]);

  // Printing to DOM
  return (
    <div className="flex flex-col items-center">
      {switchSection ? (
        <section id="cancel" className="flex flex-col items-center w-3/4">
          <form onSubmit={confirmSearch} className={`flex flex-col items-center bg-zinc-950 rounded-2xl 
          border-2 border-stone-700/30 
          p-8 md:p-12 mb-8 mt-40 md:mt-50
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
                <p className="mt-2 text-xs text-gray-500 text-center">
                  Skriv in din boknings-kod (10 karaktärer)<br />
                  Du hittar din boknings-kod på din email
                </p>
                <label
                  htmlFor="email"
                  className="block text-center mb-2 mt-3 text-gray-400"
                >
                  E-Mail <span className="text-red-500">*</span>
                </label>
                <div className='relative'>
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="email" required
                    value={email}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setEmail(e.target.value); // Ternary for logged in user?
                    }}

                    placeholder={`din.epost@exempel.com`}
                    className="w-full bg-black border rounded-lg pl-12 pr-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 transition-all "
                  />
                </div>
                <p className="mt-2 text-xs text-gray-500 text-center">
                  Bekräfta med din email som du bokat med
                </p>

                {bookingError && (
                  <p className="mt-2 text-sm text-red-500 text-center">
                    {bookingError}
                  </p>
                )}
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

            <div className={`
              flex flex-col items-center
            bg-zinc-950 rounded-2xl 
              border-2 border-stone-700/30
              p-8 md:p-12 mb-8
              w-85 md:w-1/2
              gap-5
              ${showConfirmation ? "blur-[2px]" : ""}`}
              ref={divRef}
            >
              <div className='md:flex md:flex-col md:items-center'>
                <h1 className="text-3xl px-2 py-1 pb-2">Bokningsdetaljer:</h1>
                <img src={filmData?.coverImage}
                  className='rounded-3xl md:w-50' />
              </div>
              <h2 className="text-2xl mt-5 text-red-600 text-">
                {searchedBooking.filmTitle} </h2>
              <div className="grid grid-cols-2 scale-95 gap-4">
                <div className='
                grid col-span-1 grid-cols-[repeat(10,auto)] gap-1.5
                mx-auto
                items-center
                '>
                  <Ticket className='text-red-800 scale-150' />
                  <div className='
                  bg-stone-900  rounded-2xl
                  p-2 my-1 h-15 w-22
                  text-sm
                  content-center
                  '>
                    <p className='font-bold text-red-700'>Platser:</p>
                    <p >{searchedBooking.rowNr}, {searchedBooking.columnNr}</p>
                  </div>
                </div>
                <div className='grid col-span-1 grid-cols-[repeat(10,auto)] gap-1
                mx-auto
                items-center'>
                  <Calendar className='text-red-800 scale-130' />
                  <div className='
                  bg-stone-900  rounded-2xl
                  p-2 my-1 h-15 w-22
                  text-sm
                  content-center'>
                    <p className='font-bold text-red-700'>Datum:</p>
                    <p >{searchedBooking.timeSlot.toString().slice(0, 10)}</p>
                  </div>
                </div>
                <div className='grid col-span-1 grid-cols-[repeat(10,auto)] gap-1
                mx-auto
                items-center'>
                  <Clock className='text-red-800 scale-150' />
                  <div className='
                  bg-stone-900  rounded-2xl
                  p-2 my-1 h-15 w-22
                  text-sm
                  content-center'>
                    <p className='font-bold text-red-700'>Tid:</p>
                    <p>{searchedBooking.timeSlot.toString().slice(11, 16)}</p>
                  </div>
                </div>
                <div className='grid col-span-1 grid-cols-[repeat(10,auto)] gap-1
                mx-auto
                items-center'>
                  <MapPin className='text-red-800 scale-150' />
                  <div className='
                bg-stone-900  rounded-2xl
                  p-2 my-1 h-15 w-22
                  text-sm
                  content-center
                   '>
                    <p className='font-bold text-red-700'>Salong:</p>
                    <p>{searchedBooking.venueName}</p>
                  </div>
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
            <YesNoPop 
              question = 'Är du säker du vill avboka?'
              onYes={cancelBooking}
              onNo={() => setShowConfirmation(false)}
            />
          )}

        </section>
      ) : (
        // Section when cancellation is confirmed
        <UnbookConfirmed/>
      )}
    </div>
  );
}
