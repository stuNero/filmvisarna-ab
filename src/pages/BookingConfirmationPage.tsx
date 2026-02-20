BookingConfirmationPage.route = {
  path: '/bookingconfirmation',
  menuLabel: 'Booking Confirmation',
  index: 4
};

export default function BookingConfirmationPage() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center">
      <div className="bg-zinc-950 rounded-lg p-8 max-w-md w-full mx-4 shadow-lg border border-zinc-700">
        <h2 className="text-2xl font-bold text-center mb-4 text-white">Bokningsbekräftelse</h2>
        <p className="text-center text-white">Din bokning är bekräftad!</p>
        
       
      </div>
    </div>
  );
}