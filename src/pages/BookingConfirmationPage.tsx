import { Link } from "react-router-dom";
import type bookingInfo from "../interfaces/BookingInfo";
import useFetchJson from "../utils/useFetchJson";
import {
  CheckCircle2,
  Calendar,
  Clock,
  Ticket,
  ChevronLeft,
  MapPin,
} from "lucide-react";

BookingConfirmationPage.route = {
  path: "/bookingconfirmation",
  menuLabel: "Booking Confirmation",
  index: 4,
};

export default function BookingConfirmationPage() {
  const [BookingInfo] = useFetchJson<bookingInfo[] | null>(
    "/api/bookingInfo?WHERE=bookingid=1",
  );

  if (!BookingInfo) {
    return (
      <div className="min-h-screen mx-auto max-w-4xl px-2 sm:px-4 flex flex-col pt-18 pb-8">
        <p className="text-white text-center mt-10">
          Ingen bokningsinformation hittades för detta bookningsnummer.
        </p>
      </div>
    );
  }

  const booking = BookingInfo[0];

  const dateObj = new Date(booking.timeSlot);
  const dateStr = dateObj.toLocaleDateString("sv-SE");
  const timeStr = dateObj.toLocaleTimeString("sv-SE", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const ticketTypeCounts = BookingInfo.reduce(
    (acc, curr) => {
      if (curr.ticketType === "child") acc.children++;
      else if (curr.ticketType === "adult") acc.regular++;
      else if (curr.ticketType === "senior") acc.seniors++;
      return acc;
    },
    { children: 0, regular: 0, seniors: 0 },
  );

  const selectedSeats = BookingInfo.map((seat) => ({
    row: seat.rowNr,
    number: seat.columnNr,
    ticketType: seat.ticketType,
  }));

  return (
    <div className="min-h-screen mx-auto max-w-4xl px-2 sm:px-4 flex flex-col pt-18 pb-8">
      <Link to="/">
        <button className="inline-flex  gap-2 text-gray-400 hover:text-white mb-8 transition-colors group">
          <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Tillbaka till filmerna
        </button>
      </Link>
      <div className="bg-zinc-950 rounded-3xl  mx-auto w-full shadow-lg border border-zinc-700 overflow-hidden ">
        <div className="bg-red-800 p-4 sm:p-6 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-4">
            <CheckCircle2 className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Bokning bekräftad!
          </h2>
          <p className="text-white/90">
            Tack för att du väljer vår bio. Dina biljetter är klara.
          </p>
        </div>
        <div className="p-4 sm:p-8 flex flex-col md:flex-row gap-4 md:gap-6">
          <div className="flex-1 flex flex-col gap-4">
            <div className="p-2 sm:p-4 flex flex-col gap-4">
              <div className="md">
                <h3 className="text-sm font-semibold text-gray-500 mb-2">
                  Filmdetaljer
                </h3>
                <h2 className="text-2xl font-bold text-white mb-2">
                  {booking.filmTitle}
                </h2>
                <div className="flex items-center gap-3 text-gray-300">
                  <Calendar className="w-5 h-5 text-red-500" />
                  <span className="capitalize">{dateStr}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <Clock className="w-5 h-5 text-red-500" />
                  <span>{timeStr}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <MapPin className="w-5 h-5 text-red-500" />
                  <span>Salong 2, Lyxsalongen</span>
                </div>
              </div>
              <div className="md border-t border-white/10">
                <h3 className="text-sm font-semibold text-gray-500 mb-2">
                  Biljettsammanfattning
                </h3>
                <div className="text-white/80 text-sm mb-1">
                  Barn: {ticketTypeCounts.children}
                </div>
                <div className="text-white/80 text-sm mb-1">
                  Vuxna: {ticketTypeCounts.regular}
                </div>
                <div className="text-white/80 text-sm mb-1">
                  Pensionärer: {ticketTypeCounts.seniors}
                </div>
                <div className="flex justify-between items-center border-t border-white/10 pt-4 mt-4">
                  <span className="text-xl font-bold text-white">
                    Totalt pris
                  </span>
                  <span className="text-2xl font-bold text-red-500">
                    {booking.totalPrice} SEK
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-black/50 rounded-lg w-full md:w-96 shadow-lg border border-white/5 flex flex-col justify-start items-center p-4 mt-4 md:mt-0">
            <div className="mb-4 w-full text-center">
              <h3 className="text-sm font-semibold text-gray-500 mb-2">
                Bokningsnummer
              </h3>
              <h2 className="text-2xl font-bold text-white mb-2">
                BC-HUNQAGOVKYRQ
              </h2>
            </div>
            <div className="w-full text-center">
              <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Ticket className="w-4 h-4" /> Valda platser
              </h2>
              <div className="flex flex-wrap gap-2 ">
                {selectedSeats.map((seat, idx) => (
                  <span
                    key={idx}
                    className="bg-zinc-700 text-white text-xs rounded px-3 py-1"
                  >
                    Rad {seat.row}, Plats {seat.number}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="bg-zinc-900/50 p-6 sm:p-6 text-center">
          <p className="text-sm text-gray-500">
            En bokningsbekräftelse har skickats till din e-post. Vänligen kom 15
            minuter före visningen börjar.
          </p>
        </div>
      </div>
    </div>
  );
}
