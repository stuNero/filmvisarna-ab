BookingConfirmationPage.route = {
  path: '/bookingconfirmation',
  menuLabel: 'Booking Confirmation',
  index: 4
};

export default function BookingConfirmationPage() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center">
      <div className="bg-zinc-950 rounded-lg max-w-md w-full mx-4 shadow-lg border border-zinc-700 overflow-hidden">
        <div className="bg-red-800 p-6 text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Bokning bekräftad!</h2>
          <p className="text-white/90">Tack för att du väljer vår bio. Dina biljetter är klara.</p>
        </div>
        
      
        <div className="p-8">
          <div className=" md p-4 ">
            <h3 className="text-lg font-semibold text-white mb-2">Film Detaljer</h3>
            
          </div>
        </div>
      </div>
    </div>
  );
}