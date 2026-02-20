BookingConfirmationPage.route = {
  path: '/bookingconfirmation',
  menuLabel: 'Booking Confirmation',
  index: 4
};

export default function BookingConfirmationPage() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center">
      <div className="bg-zinc-950 rounded-lg max-w-3xl w-full shadow-lg border border-zinc-700 overflow-hidden flex flex-col">
        <div className="bg-red-800 p-6 text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Bokning bekräftad!</h2>
          <p className="text-white/90">Tack för att du väljer vår bio. Dina biljetter är klara.</p>
        </div>
        <div className="p-8 flex flex-row gap-6">
          <div className="flex-1 flex flex-col gap-4">
            <div className="md p-4 ">
              <h3 className="text-sm font-semibold text-gray-500 mb-2">Filmdetaljer</h3>
              <h2 className="text-2xl font-bold text-white mb-2">Dune 2</h2>
            </div>
            <div className="md p-4 ">
              <h3 className="text-sm font-semibold text-gray-500 mb-2">Biljettsammanfattning</h3>  
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
                <span className="bg-zinc-700 text-white text-xs rounded px-3 py-1">Rad 5, Plats 6</span>
                <span className="bg-zinc-700 text-white text-xs rounded px-3 py-1">Rad 5, Plats 7</span>
                <span className="bg-zinc-700 text-white text-xs rounded px-3 py-1">Rad 5, Plats 8</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}