import { CheckCircle2 } from "lucide-react";

BookingConfirmationPage.route = {
  path: '/bookingconfirmation',
  menuLabel: 'Booking Confirmation',
  index: 4

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
    { row: 4, number: 7 }
  ]
};

export default function BookingConfirmationPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-zinc-950 rounded-lg max-w-4xl mx-auto w-full shadow-lg border border-zinc-700 overflow-hidden flex flex-col">
        <div className="bg-red-800 p-6 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-4">
              <CheckCircle2 className="w-10 h-10 text-white" />
            </div>
          <h2 className="text-2xl font-bold text-white mb-2">Bokning bekräftad!</h2>
          <p className="text-white/90">Tack för att du väljer vår bio. Dina biljetter är klara.</p>
        </div>
        <div className="p-8 flex flex-row gap-6">
          <div className="flex-1 flex flex-col gap-4">
            <div className=" p-4 flex flex-col gap-4">
              <div className="md">
                <h3 className="text-sm font-semibold text-gray-500 mb-2">Filmdetaljer</h3>
                <h2 className="text-2xl font-bold text-white mb-2">{mockData.movie.title}</h2>
                <div className="text-white/80 text-sm mb-1">Datum: {mockData.date.slice(0, 10)}</div>
                <div className="text-white/80 text-sm mb-1">Tid: {mockData.time}</div>
              </div>
              <div className="md">
                <h3 className="text-sm font-semibold text-gray-500 mb-2">Biljettsammanfattning</h3>
                <div className="text-white/80 text-sm mb-1">Barn: {mockData.ticketCounts.children}</div>
                <div className="text-white/80 text-sm mb-1">Vuxna: {mockData.ticketCounts.regular}</div>
                <div className="text-white/80 text-sm mb-1">Pensionärer: {mockData.ticketCounts.seniors}</div>
                <div className="text-white/80 text-sm mb-1 font-bold">Totalt pris: {mockData.totalPrice} kr</div>
              </div>
            </div>
          </div>
          <div className="bg-zinc-800 rounded-lg w-64 shadow-lg border border-zinc-700 flex flex-col justify-start items-center p-4">
            <div className="mb-4 w-full text-center">
              <h3 className="text-sm font-semibold text-gray-500 mb-2">Bokningsnummer</h3>
              <h2 className="text-2xl font-bold text-white mb-2">BC-HUNQAGOVKYRQ</h2>
            </div>
            <div className="w-full text-center">
              <h3 className="text-sm font-semibold text-gray-500 mb-2">Valda platser</h3>
              <div className="flex flex-wrap gap-2 justify-center">
                {mockData.selectedSeats.map((seat, idx) => (
                  <span key={idx} className="bg-zinc-700 text-white text-xs rounded px-3 py-1">
                    Rad {seat.row}, Plats {seat.number}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}