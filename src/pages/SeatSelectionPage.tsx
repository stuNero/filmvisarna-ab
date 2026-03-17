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
  const [ticketCost, setTicketCost] = useState(0);


  let bookingID = '';

  const { id } = useParams<{ id: string; }>();
  const showingId = Number(id);
  // Fetch from showingId view in DB
  const [showingsData] = useFetchJson<MovieShowings[] | null>(
    `/api/movieShowings?where=showingId=${showingId}`
  );

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
    e.preventDefault();
    // Variable to count the amount of tickets
    const ticketAmount =
      ticketCount.adult + ticketCount.child + ticketCount.senior;

    bookingID = '';
    // Generates the random booking ID code
    bookingID = generateBookingID();


    // Aborts if email isn't input
    if (!email) {
      setEmailError('Skriv in din email först.');
      return;
    }

    try {
      // Collects all tickets into a string array
      const tickets = [];
      for (let i = 0; i < ticketCount.adult; i++) {
        tickets.push('adult');
      }
      for (let i = 0; i < ticketCount.child; i++) {
        tickets.push('child');
      }
      for (let i = 0; i < ticketCount.senior; i++) {
        tickets.push('senior');
      }

      // Zips tickets and seats together into one array based on index
      // (assumes arrays are of same length)
      const seatsWithTypes: { seatId: number, ticketType: string; }[] =
        tickets.map(function (type, i) {
          return {
            seatId: selectedSeats[i],
            ticketType: type
          };
        });

      const res = await CreateBooking(seatsWithTypes);
      if (!res.ok) {
        alert("Request failed: " + res.status);
        return;
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

  async function CreateBooking(seatsWithTypes: { seatId: number, ticketType: string; }[]) {
    return fetch('/api/create-booking', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: bookingID,
        cost: ticketCost,
        createdAt:
          new Date(Date.now()).toLocaleDateString('sv-SE').slice(0, 10) +
          ' ' +
          new Date(Date.now()).toLocaleTimeString('sv-SE'),
        showingId: showingId.toString(),
        email: email,
        seats: seatsWithTypes
      })
    });
  }

  var rows = 0;

  function incrementTicket(type: keyof TicketCount) {
    // prevents incrementation above 8 tickets
    if (ticketCount.child + ticketCount.adult + ticketCount.senior < 8) {
      setTicketCount((prev) => ({ ...prev, [type]: prev[type] + 1 }));
      setTicketCost(prev => prev + TICKET_PRICES[type]);
    }
  }
  function decrementTicket(type: keyof TicketCount) {
    // Removes the last selected seat when the ticket count decreases
    selectedSeats.pop();
    setTicketCount((prev) => ({
      ...prev,
      [type]: Math.max(0, prev[type] - 1)
    }));
    setTicketCost(prev => prev - TICKET_PRICES[type]);
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
        <div className="top-0 bottom-0 left-0 content-center justify-center md:mt-30 mt-20 ">
          {/* Ticket Selection */}
          <div className="flex flex-col items-center bg-zinc-950 rounded-2xl border-y-2 md:border-2  border-white/20 p-8 mb-8">
            <div className="max-w-2xl md:min-w-2xl w-full md:mx-auto space-y-4">
              <CreateSeatTypes />
            </div>
            {totalTickets > 0 ?
              <div className="flex flex-col items-center gap-10 px-10 bg-zinc-950 rounded-2xl border-2 border-white/20 mt-10 p-2 mb-8">
                <div className='flex flex-row gap-2'>
                  <div
                    id="ticket-section">
                    <h1 className='font-semibold mb-1 pl-5 pb-3 text-2xl'>Biljettyp:</h1>
                    <div className='flex flex-row border-2 border-solid border-white/10 rounded-2xl pb-2 pl-5 md:px-10 max-w-2xl md:w-170 justify-between text-lg'>
                      <div className='pr-5'>
                        <p>Barn: </p>
                        <p>Vuxen:  </p>
                        <p>Pensionär: </p>
                      </div>
                      <div className='md:w-30 w-25'>
                        <p className='text-white/50 pl-2'>{ticketCount.child} x {TICKET_PRICES.child} kr</p>
                        <p className='text-white/50 pl-2'>{ticketCount.adult} x {TICKET_PRICES.adult} kr</p>
                        <p className='text-white/50 pl-2'>{ticketCount.senior} x {TICKET_PRICES.senior} kr</p>
                      </div>
                    </div>
                  </div>

                </div>
                <div
                  id="total-cost-section"
                  className='flex flex-col md:flex-row border-t-2 border-white/20 md:w-170 md:justify-between p-5'>
                  <h1 className='font-bold text-2xl text-red-800 pr-10 md:pr-0'>Totalpris:</h1>
                  <p className='text-xl'>{ticketCost} :-</p>
                </div>
              </div> : <></>}
          </div>

          {/* Seat Selection */}
          {totalTickets > 0 ?

            <div className="
            flex flex-col
            bg-zinc-950
            border-y-2
            rounded-2xl md:border-2 border-white/20
            p-8 mb-8
            items-center overflow-x-scroll snap-x snap-mandatory md:overflow-x-hidden">
              {/*           Cinema Screen         */}
              <h1 className='text-center text-sm italic text-stone-300/50 snap-center translate-x-9'>Bioduk</h1>
              <div className='flex bg-stone-600 h-3 w-70 md:w-140 mb-5 rounded-full  snap-center translate-x-9' />
              {/*             S E A T S           */}
              {Array.from({ length: rows }, (_, rowIndex) => (
                <div key={rowIndex} className="flex justify-center gap-2.5 md:gap-4 mb-4  snap-center translate-x-9">
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
                            px-3 py-1.5  h-6
                            md:px-4 md:py-2 md:h-8
                          
                          text-white rounded
                            transition-all duration-200
                          ${isSelected
                                ? "bg-green-600 md:hover:bg-green-700 outline-solid outline-green-700"
                                : "md:hover:bg-green-800 bg-stone-700 md:hover:outline-green-900 outline-solid outline-stone-600"
                              }
                        `}
                          >
                          </button>
                      );
                    })}
                </div>
              ))}
              <div
                id="seat-section"
                className='flex flex-col min-w-40 translate-x-10 items-center'>
                <h1 className='font-semibold pb-1'>Stolsnummer:</h1>
                {selectedSeats.length > 0 ?
                  <div className='grid grid-cols-4 gap-2 py-2 px-3 border-2 border-solid border-white/20 rounded-2xl min-h-21'>
                    {selectedSeats.map((seat) => <p className='text-center px-0.5 border border-solid rounded border-white/10 bg-gray-900 h-fit'>
                      {seat}
                    </p>)}
                  </div> : <></>}
              </div>
            </div> : <></>}

          {/* Confirmation Section for sending mail - Only shows when all seats are selected */}
          {selectedSeats.length === totalTickets &&
            totalTickets > 0 ?
            <form onSubmit={bookingConfirmation} ref={formRef}>
              <div className="bg-zinc-950 rounded-2xl border-y-2 md:border-2 border-green-700/30 p-8 md:p-12 mt-8 mb-8">
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