import { useNavigate, useParams } from 'react-router-dom';
import useFetchJson from '../utils/useFetchJson';
import type ShowingSeats from '../interfaces/ShowingSeats';
import { useEffect, useRef, useState } from 'react';
import SeatType from '../parts/SeatType';
import { Mail } from 'lucide-react';
import type MovieShowings from '../interfaces/MovieShowings';

SeatSelectionPage.route = {
  path: '/boka/:id'
};

const TICKET_TEXT = {
  child: 'Barn',
  adult: 'Vuxen',
  senior: 'Pensionär'
};

const TICKET_INFO = {
  child: 'Under 12 år',
  adult: '12 - 64 år',
  senior: 'Över 64 år'
};

const TICKET_PRICES = {
  child: 80,
  adult: 140,
  senior: 120
};

const TICKET_KEYS = Object.keys(TICKET_TEXT) as Array<keyof typeof TICKET_TEXT>;

interface TicketCount {
  child: number;
  adult: number;
  senior: number;
}

// Generates random booking
function generateBookingID() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  // Creating a bit array of length 10
  const array = new Uint8Array(10);
  crypto.getRandomValues(array);

  const newID = Array.from(array, (x) => chars[x % chars.length]).join('');
  return newID;
}

export default function SeatSelectionPage() {
  const navigate = useNavigate();
  // code for email confirmation
  const [email, setEmail] = useState('');

  const [emailError, setEmailError] = useState('');

  let bookingID = '';

  const { id } = useParams<{ id: string; }>();
  const showingId = Number(id);
  // Fetch from showingId view in DB
  const [showingsData] = useFetchJson<MovieShowings[] | null>(
    `/api/movieShowings?where=showingId=${showingId}`
  );

  //  --- Live updates logic ---

  // Omit the need to set keys in lists
  useAutoKeys();

  // Our state/context
  const s = useStates("main", {
    bookedSeats: [],
    newBookedSeat: { seatId: '', bokingId: '' }
  });

  // Start an SSE Listener
  useEffect(() => {
    // Avoid getting double event sources in React Strict mode
    globalThis.eventSourceSSE && globalThis.eventSourceSSE.close();
    // New event source
    globalThis.eventSourceSSE = new EventSource('/api/book-sse');
    // Listen to SSE events
    globalThis.eventSourceSSE.onmessage = doOnSseEvent;
  }, []);

  function doOnSseEvent({ data }) {
    s.bookedSeats.push(JSON.parse(data));
  }


  // Fetching from view
  const [bookedSeatsRaw] = useFetchJson<{
    seatId: number,
    bookingId: string,
    ticketType: string,
    showingId: number,
    rowNr: number,
    columnNr: number;
  }[] | null>(`/api/bookedSeatsWithShowings?WHERE=showingId=${showingId}`);

  // Extracts seatID from fetch array
  const bookedSeats = bookedSeatsRaw?.map((x) => x.seatId);

  // Extract first result from array
  const showing = showingsData?.[0];

  // STARTS FINAL BOOKING LOGIC
  const bookingConfirmation = async (e: React.FormEvent<HTMLFormElement>) => {
    // Variable to count the amount of tickets
    const ticketAmount =
      ticketCount.adult + ticketCount.child + ticketCount.senior;

    bookingID = '';
    e.preventDefault();

    // Generates the random booking ID code
    bookingID = generateBookingID();

    // Aborts if email isn't input
    if (!email) {
      setEmailError('Skriv in din email först.');
      return;
    }
    // Aborts if no ticket types are selected
    else if (ticketAmount == 0) {
      setEmailError('Du måste välja biljettyper.');
      return;
    }
    // Aborts if incorrect amount of seats are chosen
    else if (ticketAmount != selectedSeats.length) {
      const diff = ticketAmount - selectedSeats.length;
      setEmailError(
        `Du måste välja ${diff} ${diff > 2 ? 'säten' : 'säte'} till`
      );
      return;
    }

    try {
      let totalPrice = 0;
      // Collects all tickets into a string array
      // and calculates total price
      const tickets = [];
      for (let i = 0; i < ticketCount.adult; i++) {
        tickets.push('adult');
        totalPrice += 140;
      }
      for (let i = 0; i < ticketCount.child; i++) {
        tickets.push('child');
        totalPrice += 80;
      }
      for (let i = 0; i < ticketCount.senior; i++) {
        tickets.push('senior');
        totalPrice += 120;
      }

      // Zips tickets and seats together into one array based on index
      // (assumes arrays are of same length)
      const seatsWithTypes = tickets.map(function (type, i) {
        return [type, selectedSeats[i]];
      });

      await createBooking(totalPrice);
      await createEmailBooking();

      // Calls the function for DB insert for each booked seat
      for (let seat of seatsWithTypes) {
        createbookedSeat(String(seat[0]), Number(seat[1]));
      }

      const requestBody = {
        email: email,
        movieName: showing?.title,
        selectedSeats: selectedSeats.join(', '),
        childCount: ticketCount.child,
        adultCount: ticketCount.adult,
        seniorCount: ticketCount.senior,
        totalTickets: ticketAmount,
        bookingID: bookingID,
        date: new Date(showing!.date).toLocaleDateString('sv-SE'),
        time: showing?.time.toString().slice(0, 5),
        venue: showing?.venueName
      };
      try {
        const response = await fetch('/api/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestBody)
        });

        if (response.ok) {
          // alert(`Bokningsbekräftelse skickad till ${email}!`);
          setEmail(''); // remove the mail from field when email is sent
        } else {
          alert('Något gick fel vid bokning');
        }
      } catch (error) {
        console.error('Fel:', error);
        alert('Kunde inte skicka boknings email');
      }

      navigate(`/bekraftelse/${bookingID}`);
    } catch (error) {
      console.error('Fel:', error);
      alert('Kunde inte skicka bokning');
      return;
    }
  };

  const [seats] = useFetchJson<ShowingSeats[] | null>(
    `/api/showingsAllSeats?where=id=${showingId}`
  );
  // Array with seat id
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);

  const [ticketCount, setTicketCount] = useState<TicketCount>({
    child: 0,
    adult: 0,
    senior: 0
  });

  const toggleSeat = (seatId: number) => {
    const totalTickets =
      ticketCount.adult + ticketCount.child + ticketCount.senior;
    setSelectedSeats((seat) => {
      if (seat.includes(seatId)) {
        // if the seat is already selected, remove selection
        return seat.filter((id) => id !== seatId);
        // prevents seats being selected above ticket amount
      } else if (seat.length < totalTickets) {
        // if it is not selected, select it
        return [...seat, seatId];
      } else {
        return seat;
      }
    });
  };

  async function createBooking(totalPrice: number) {
    /* const res = */ await fetch('/api/send-confirm/bookings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      id: bookingID,
      cost: totalPrice,
      createdAt:
        new Date(Date.now()).toLocaleDateString('sv-SE').slice(0, 10) +
        ' ' +
        new Date(Date.now()).toLocaleTimeString('sv-SE'),
      showingId: showingId.toString()
    })
  });
    // const data = await res.json();
    // alert(JSON.stringify(data, null, 2));
  }
  async function createEmailBooking() {
    // Inserts row into userBookings table
    await fetch('/api/userBookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        bookingId: bookingID,
        email: email
      })
    });
  }

  async function createbookedSeat(type: string, seatNr: number) {
    /* const res =*/ await fetch('/api/bookedSeat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      seatId: seatNr,
      bookingId: bookingID,
      ticketType: type
    })
  });
    // const data = await res.json();
    // alert(JSON.stringify(data, null, 2));

    // SSE logic
    await fetch('/api/booked-seat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(s.newBookedSeat)
    });
    s.seatId = '';
    s.showingId = '';
  }

  var rows = 0;

  function incrementTicket(type: keyof TicketCount) {
    // prevents incrementation above 8 tickets
    if (ticketCount.child + ticketCount.adult + ticketCount.senior < 8) {
      setTicketCount((prev) => ({ ...prev, [type]: prev[type] + 1 }));
    }
  }
  function decrementTicket(type: keyof TicketCount) {
    // Removes the last selected seat when the ticket count decreases
    selectedSeats.pop();
    setTicketCount((prev) => ({
      ...prev,
      [type]: Math.max(0, prev[type] - 1)
    }));
  }

  function CreateSeatTypes() {
    return (
      <>
        {
          <SeatType
            key={0}
            name={TICKET_TEXT[TICKET_KEYS[0]]}
            info={TICKET_INFO[TICKET_KEYS[0]]}
            price={TICKET_PRICES[TICKET_KEYS[0]]}
            ticketCount={ticketCount.child}
            incrementTicketCount={() => incrementTicket('child')}
            decrementTicketCount={() => decrementTicket('child')}
          />
        }
        {
          <SeatType
            key={1}
            name={TICKET_TEXT[TICKET_KEYS[1]]}
            info={TICKET_INFO[TICKET_KEYS[1]]}
            price={TICKET_PRICES[TICKET_KEYS[1]]}
            ticketCount={ticketCount.adult}
            incrementTicketCount={() => incrementTicket('adult')}
            decrementTicketCount={() => decrementTicket('adult')}
          />
        }
        {
          <SeatType
            key={2}
            name={TICKET_TEXT[TICKET_KEYS[2]]}
            info={TICKET_INFO[TICKET_KEYS[2]]}
            price={TICKET_PRICES[TICKET_KEYS[2]]}
            ticketCount={ticketCount.senior}
            incrementTicketCount={() => incrementTicket('senior')}
            decrementTicketCount={() => decrementTicket('senior')}
          />
        }
      </>
    );
  }

  // Variable to check the amount of tickets
  const totalTickets = ticketCount.adult + ticketCount.child + ticketCount.senior;
  // Variable to stablish the amount of tickets when the useEffect is triggered
  const totalTicketsPrevValue = useRef(totalTickets);
  // Reference to the element that we want to scroll to (email input)
  const formRef = useRef<HTMLFormElement>(null);

  // UseEffect runs on first render and when the dependencies (selectedSeats and totalTickets) values changes
  useEffect(() => {
    // Checks if the amount of tickets have decreased
    if (totalTickets < totalTicketsPrevValue.current) {
      // if so, set the previous value to the current, and return (so it doesn't go throgh the next check)
      totalTicketsPrevValue.current = totalTickets;
      return;
    }
    // Checkes the length of selectedSeats is equal to the amount of tickets
    // and if said amount is greather than 0
    if (selectedSeats.length === totalTickets && totalTickets > 0) {
      // Sets 10 milliseconds timeout (so the component have time to load) 
      setTimeout(() => {
        // And scrolls to the form element (where the email input is)
        formRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center"
        });
      }, 10);
    }
    // We update the previous value so it's coherent with the current.
    totalTicketsPrevValue.current = totalTickets;
  }, [selectedSeats, totalTickets]);


  if (seats != null) {
    seats?.forEach((seat) => {
      if (seat.rowNr > rows) {
        rows = seat.rowNr;
      }
    });

    return (
      <>
        <div className="top-0 bottom-0 left-0 content-center justify-center md:mt-30 mt-20">
          {/* Ticket Selection */}
          <div className="bg-zinc-950 rounded-2xl border-2 border-white/20 p-8 mb-8">
            <div className="max-w-2xl mx-auto space-y-4">
              <CreateSeatTypes />
            </div>
          </div>

          {/* Seat Selection */}
          {totalTickets > 0 ?
            <div className="bg-zinc-950 rounded-2xl border-2 border-white/20 p-8 mb-8">
              {Array.from({ length: rows }, (_, rowIndex) => (
                <div key={rowIndex} className="flex justify-center gap-4 mb-4">
                  {seats
                    ?.filter((seat) => seat.rowNr === rowIndex + 1)
                    .map((seat) => {
                      const isSelected = selectedSeats.includes(seat.seatId);

                      return (

                        bookedSeats?.includes(seat.seatId) ? <button
                          key={seat.seatId}

                          className={`hover:bg-[url('/ban-red.webp')] bg-center bg-cover
                          px-4 py-2 rounded outline-solid outline-stone-700 bg-stone-800 h-8`}
                        >
                        </button> :
                          <button
                            key={seat.seatId}
                            onClick={() => toggleSeat(seat.seatId)}
                            className={`
                          px-4 py-2 text-white rounded
                          transition-all duration-200 h-8
                          ${isSelected
                                ? "bg-green-600 hover:bg-green-700 outline-solid outline-green-700"
                                : "hover:bg-green-800 bg-stone-700 hover:outline-green-900 outline-solid outline-stone-600"
                              }
                        `}
                          >
                          </button>
                      );
                    })}
                </div>
              ))}
            </div> : <></>}

          {/* Confirmation Section for sending mail - Only shows when all seats are selected */}
          {selectedSeats.length === totalTickets &&
            totalTickets > 0 ?
            <form onSubmit={bookingConfirmation} ref={formRef}>
              <div className="bg-zinc-950 rounded-2xl border-2 border-green-700/30 p-8 md:p-12 mt-8 mb-8">
                <h2 className="text-2xl md:text-3xl text-center mb-8">
                  Slutför bokningen
                </h2>

                {/* Email Input */}
                <div className="max-w-md mx-auto mb-8">
                  <div className="relative">
                    <label
                      htmlFor="email"
                      className="block text-center mb-2 text-gray-400"
                    >
                      E-postadress <span className="text-red-500">*</span>
                    </label>

                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />

                      <input
                        type="email"
                        required
                        id="email"
                        value={email}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          setEmail(e.target.value);
                          setEmailError("");
                        }}
                        placeholder="din.epost@exempel.se"
                        className={`w-full bg-black border rounded-lg pl-12 pr-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 transition-all ${emailError
                          ? "border-red-700 focus:ring-red-700/50"
                          : "border-white/20 focus:ring-red-800/50 focus:border-red-800"
                          }`}
                      />
                    </div>
                    {emailError && (
                      <p className="mt-2 text-sm text-red-500 text-center">
                        {emailError}
                      </p>
                    )}
                    <p className="mt-2 text-xs text-gray-500 text-center">
                      Din bokningsbekräftelse skickas till denna e-post
                    </p>
                  </div>
                </div>

                {/* Confirm Button */}
                <div className="text-center">
                  <button
                    type="submit"
                    className="px-16 py-4 rounded-xl border-2 bg-red-800 border-red-800 hover:bg-red-900 hover:border-red-900 text-white transition-all text-lg font-medium"
                  >
                    Bekräfta bokning
                  </button>
                </div>
              </div>
            </form> : <></>}
        </div>
      </>
    );
  }
}

function useAutoKeys() {
  throw new Error('Function not implemented.');
}
