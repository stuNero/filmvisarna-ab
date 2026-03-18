import useFetchJson from '../utils/useFetchJson';
import type UserDetails from '../interfaces/UserDetails';
import type UserBooking from '../interfaces/UserBooking';
import type BookingCardInfo from '../interfaces/BookingCardInfo';
import { User } from 'lucide-react';
import BookingCard from '../parts/BookingCard';
import { useState } from 'react';
import cancelBooking from '../utils/cancelBooking';
import UnbookConfirmed from '../parts/UnbookConfirmed';
import YesNoPop from '../parts/YesNoPop';
import { Link } from 'react-router-dom';
import { useAuthContext } from '../utils/AuthProvider';

ProfilePage.route = {
  path: '/profil/'
};

export default function ProfilePage() {
  //Setup page variables
  const [switchSection, setSwitchSection] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [cancelId, setCancelId] = useState<string>('');
  const { user } = useAuthContext();

  const userId = user?.id;

  // Fetch from userId table in DB
  const [userDataRaw] = useFetchJson<UserDetails[] | null>(
    `/api/users?WHERE=id=${userId}`
  );
  //Gets first entry
  const userData = userDataRaw?.[0];

  //Get userbookings
  const [userBookings] = useFetchJson<UserBooking[] | null>(
    `/api/userBookings?WHERE=email=${userData?.email}`
  );

  //Formats all bookingId entries found in userBookings as a string
  const bookingIds = (userBookings ?? []).map((x) => x.bookingId).join(",")
  //Replaces spaces with correct formatting (%20)
  const query = encodeURIComponent(`bookingId IN (${bookingIds})`);

  //Get bookinginfo for all user's bookings in a single request
  const [bookingEntries] = useFetchJson<BookingCardInfo[] | null>(`/api/bookingCard?WHERE=${query}`
  );
  
  console.log(bookingIds)
  console.log(bookingEntries)

  async function setUnbook(bookingId: string) {
    setCancelId(bookingId);
    setShowConfirmation(true);
  }

  async function setConfirmed() {
    setSwitchSection(true);
    window.scrollTo(0, 0);
  }

  
  function displayCards(current: boolean) {
    return bookingEntries?.map((booking) => {
      //Checks to see if the booking is still active
      const active = new Date(booking.timeSlot) > new Date();
      
      //Don't return entries which don't match the desired type
      if (current !== active) return null;
      
      return (
        <li key={booking.bookingId}>
          <BookingCard
            key={booking.bookingId}
            bookingId={booking.bookingId}
            timeSlot={booking.timeSlot}
            title={booking.title}
            name={booking.name}
            coverImage={booking.coverImage}
            cost={booking.cost}
            active={active}
            onCancelButton={setUnbook}
          />
        </li>
      );
    });
  }

  return (
    <>
      {!switchSection ? (
        <div>
          <div
            className={`top-0 bottom-0 left-0 content-center justify-center md:mt-30 mt-20 ${showConfirmation ? ' blur-[2px]' : ''}`}
          >
            {/* User Banner */}
            <div className="bg-zinc-950 rounded-2xl border-2 border-white/20 p-8 mb-8">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="w-24 h-24 bg-red-800 rounded-full flex items-center justify-center shadow-lg shadow-red-800/20">
                  <User className="w-12 h-12 text-white" />
                </div>
                <div className="text-center md:text-left">
                  <h1 className="text-3xl font-bold text-white mb-2">
                    {userData?.firstName} {userData?.lastName}
                  </h1>
                  <p>{userData?.email}</p>
                </div>
              </div>
            </div>

            {/* Current Bookings */}
            <div>
              <div>
                <h2 className="text-2xl font-bold text-white">Bokningar</h2>
                {!user && (
                  <Link
                    to="/logga-in"
                    className="block text-center text-gray-400 underline hover:text-gray-200 t "
                  >
                    Logga in för att see dina bokningar
                  </Link>
                )}
              </div>

              <ul className="text-white">
                {displayCards(true)}
              </ul>
            </div>

            {/* Booking history */}
            <div>
              <div>
                <h2 className="text-2xl font-bold text-white">Bokningshistorik</h2>
              </div>
              <ul className="text-white">
                {displayCards(false)}
              </ul>
            </div>
          </div>
          {showConfirmation ? (
            <div className="flex flex-col items-center">
              <YesNoPop
                question="Är du säker du vill avboka?"
                onYes={async () => {
                  await cancelBooking(cancelId);
                  await setConfirmed();
                  setShowConfirmation(false);
                }}
                onNo={() => setShowConfirmation(false)}
              />
            </div>
          ) : (
            <></>
          )}
        </div>
      ) : (
        // Section when cancellation is confirmed
        <div className="flex flex-col items-center">
          <UnbookConfirmed />
        </div>
      )}
    </>
  );
}
