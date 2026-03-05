import { Search } from "lucide-react";
import { useState } from "react";
import useFetchJson from "../utils/useFetchJson";
import type bookingInfo from "../interfaces/BookingInfo";
import type BookingInfo from "../interfaces/BookingInfo";

CancelBookingPage.route = {
  path: '/CancelBooking',
  menuLabel: 'Avboka Biljett',
  index: 5
};
/*
- (Sök bokning) form 
  - för text input och knapp
- (hittat en bokning) section
  - info om bokning
    - Datum
    - Tid
    - Sal namn
    - Platser / Seats
    - Kostnad
    - Bild?
  - knapp för att avboka
- Bekräftelse section
  - Gå tillbaka till homepage

*/
export default function CancelBookingPage() {

  const [bookingError, setBookingError] = useState('');
  const [bookingID, setBookingID] = useState('');

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

  return (
    <div className="flex flex-col items-center">
      <form onSubmit={confirmSearch} className="bg-zinc-950 rounded-2xl 
        border-2 border-stone-700/30
         p-8 md:p-12 mb-8 mt-40 md:mt-70
         w-1/2
         ">
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
        <div className="text-center">
          <button
            type="submit"
            className="px-16 py-4 rounded-xl border-2 bg-red-800 border-red-800 hover:bg-red-900 hover:border-red-900 text-white transition-all text-lg font-medium"
          >
            Sök bokning
          </button>
        </div>
      </form>
      {searchedBooking != null ?
        <div className="
        bg-zinc-950 rounded-2xl 
        border-2 border-stone-700/30
         p-8 md:p-12 mb-8
         w-1/2">
          <h1>{searchedBooking.filmTitle} </h1>
          <div className="container fit-content wrap-content">
            <p>Rad: {searchedBooking.rowNr}</p>
            <p>Kolumn: {searchedBooking.columnNr}</p>
            <p>Sal: {searchedBooking.venueName}</p>
            <p>Kostnad: {searchedBooking.totalPrice}</p>
          </div>
        </div> : <></>}
    </div>
  );
}
