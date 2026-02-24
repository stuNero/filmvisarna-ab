import {
  CheckCircle2,
  Calendar,
  Clock,
  Ticket,
  ChevronLeft,
} from "lucide-react";

BookingConfirmationPage.route = {
  path: "/bookingconfirmation",
  menuLabel: "Booking Confirmation",
  index: 4,
};

const mockData = {
  movie: { title: "Dune: Part Two" },
  date: new Date().toISOString(),
  time: "20:00",
  ticketCounts: { children: 1, regular: 2, seniors: 0 },
  totalPrice: 360,
  selectedSeats: [
    { row: 4, number: 5 },
    { row: 4, number: 6 },
    { row: 4, number: 7 },
  ],
};

export default function BookingConfirmationPage() {
  return (
    <div className="min-h-screen mx-auto max-w-4xl px-2 sm:px-4 flex flex-col pt-18">
      <button className="inline-flex  gap-2 text-gray-400 hover:text-white mb-8 transition-colors group">
        <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        Tillbaka till filmerna
      </button>
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
                  {mockData.movie.title}
                </h2>
                <div className="flex items-center gap-3 text-gray-300">
                  <Calendar className="w-5 h-5 text-red-500" />
                  <span className="capitalize">
                    {mockData.date.slice(0, 10)}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <Clock className="w-5 h-5 text-red-500" />
                  <span>{mockData.time}</span>
                </div>
              </div>
              <div className="md border-t border-white/10">
                <h3 className="text-sm font-semibold text-gray-500 mb-2">
                  Biljettsammanfattning
                </h3>
                <div className="text-white/80 text-sm mb-1">
                  Barn: {mockData.ticketCounts.children}
                </div>
                <div className="text-white/80 text-sm mb-1">
                  Vuxna: {mockData.ticketCounts.regular}
                </div>
                <div className="text-white/80 text-sm mb-1">
                  Pensionärer: {mockData.ticketCounts.seniors}
                </div>
                <div className="flex justify-between items-center border-t border-white/10 pt-4 mt-4">
                  <span className="text-xl font-bold text-white">
                    Totalt pris
                  </span>
                  <span className="text-2xl font-bold text-red-500">
                    {mockData.totalPrice} SEK
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
                {mockData.selectedSeats.map((seat, idx) => (
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
