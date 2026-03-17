import useFetchJson from '../utils/useFetchJson';
import type UserDetails from '../interfaces/UserDetails';
import type UserBooking from '../interfaces/UserBooking';
import { User } from 'lucide-react';
import BookingCard from '../parts/BookingCard';
import { useState } from 'react';
import cancelBooking from '../utils/cancelBooking';
import UnbookConfirmed from '../parts/UnbookConfirmed';
import YesNoPop from '../parts/YesNoPop';
import { useAuth } from './AuthProvider';
import { Link } from 'react-router-dom';

ProfilePage.route = {
  path: '/profil/'
};

export default function ProfilePage() {
  //Setup page variables
  const [switchSection, setSwitchSection] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [cancelId, setCancelId] = useState<string>('');
  const { user } = useAuth();

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

  async function setUnbook(bookingId: string) {
    setCancelId(bookingId);
    setShowConfirmation(true);
  }

  async function setConfirmed() {
    setSwitchSection(true);
    window.scrollTo(0, 0);
  }

  return (
    <>
      {!switchSection ? (
        <div>
          <div
<<<<<<< feat/connecting-profilepage-to-loginpage
            className={`top-0 bottom-0 left-0 content-center justify-center md:mt-30 mt-20 ${showConfirmation ? ' blur-[2px]' : ''}`}
          >
=======
            className={`top-0 bottom-0 left-0 content-center justify-center md:mt-30 mt-20 ${showConfirmation ? " blur-[2px]" : ""}`}>
>>>>>>> main
            {/* User Banner */}
            <div className="bg-zinc-950 rounded-2xl border-2 border-white/20 p-8 mb-8">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="w-24 h-24 bg-red-800 rounded-full flex items-center justify-center shadow-lg shadow-red-800/20">
                  <User className="w-12 h-12 text-white" />
                </div>
                <div className="text-center md:text-left">
<<<<<<< feat/connecting-profilepage-to-loginpage
                  <h1 className="text-3xl font-bold text-white mb-2">
                    {userData?.firstName} {userData?.lastName}
                  </h1>
=======
                  <h1 className="text-3xl font-bold text-white mb-2">{userData?.firstName} {userData?.lastName}</h1>
>>>>>>> main
                  <p>{userData?.email}</p>
                </div>
              </div>
            </div>

            {/* Booking history */}
            <div>
<<<<<<< feat/connecting-profilepage-to-loginpage
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

=======
              <h2 className="text-2xl font-bold text-white">Bokningar</h2>
>>>>>>> main
              <ul className="text-white">
                {userBookings?.map((booking) => (
                  <li key={booking.bookingId}>
                    <BookingCard
                      key={booking.bookingId}
                      bookingId={booking.bookingId}
                      onCancelButton={setUnbook}
                    />
                  </li>
                ))}
              </ul>
            </div>
          </div>
          {showConfirmation ? (
            <div className="flex flex-col items-center">
              <YesNoPop
<<<<<<< feat/connecting-profilepage-to-loginpage
                question="Är du säker du vill avboka?"
=======
                question='Är du säker du vill avboka?'
>>>>>>> main
                onYes={async () => {
                  await cancelBooking(cancelId);
                  await setConfirmed();
                  setShowConfirmation(false);
                }}
                onNo={() => setShowConfirmation(false)}
              />
            </div>
<<<<<<< feat/connecting-profilepage-to-loginpage
          ) : (
            <></>
          )}
=======
          ) : (<></>)}

>>>>>>> main
        </div>
      ) : (
        // Section when cancellation is confirmed
        <div className="flex flex-col items-center">
          <UnbookConfirmed />
        </div>
      )}
<<<<<<< feat/connecting-profilepage-to-loginpage
=======

>>>>>>> main
    </>
  );
}
