import { useParams } from "react-router-dom";
import useFetchJson from "../utils/useFetchJson";
import type ShowingSeats from "../interfaces/ShowingSeats";
import { useState, useEffect } from "react";
import SeatType from "../parts/SeatType";
import { Mail } from "lucide-react";
import type MovieShowings from "../interfaces/MovieShowings";

SeatSelectionPage.route = {
  path: "/seatselection/:id",
  menuLabel: "Seat Selection",
  index: 3,
};

const TICKET_TEXT = {
  child: "Barn",
  adult: "Vuxen",
  senior: "Pensionär",
};

const TICKET_INFO = {
  child: "Under 12 år",
  adult: "12 - 64 år",
  senior: "Över 64 år",
};

const TICKET_PRICES = {
  child: 80,
  adult: 140,
  senior: 120,
};

const TICKET_KEYS = Object.keys(TICKET_TEXT) as Array<keyof typeof TICKET_TEXT>;

interface TicketCount {
  child: number;
  adult: number;
  senior: number;
}
function generateBookingID() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const array = new Uint8Array(10);
  crypto.getRandomValues(array);

  const newID = Array.from(array, x => chars[x % chars.length]).join("");
  return newID;
}
export default function SeatSelectionPage() {

  // code for email confirmation
  const [email, setEmail] = useState("");

  const [emailError, setEmailError] = useState("");


  const { id } = useParams<{ id: string; }>();
  const showingId = Number(id);
  const [showingsData] = useFetchJson<MovieShowings[] | null>(
    `/api/movieShowings?where=showingId=${showingId}`,
  );

  // Extract first result from array
  const showing = showingsData?.[0];
  const bookingConfirmation = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();


    // Aborts if no ticket types are selected
    if ((ticketCount.adult + ticketCount.child + ticketCount.senior) == 0) {
      setEmailError("Du måste välja biljettyper.");
      return;
    }
    // Aborts if no seats are selected
    else if (selectedSeats.length == 0) {
      setEmailError("Du måste välja säten.");
      return;
    }
    // Aborts if email isn't input
    else if (!email) {
      setEmailError("Skriv in din email först.");
      return;
    }

    try {
      await createBooking();
      const requestBody = {
        email: email,
        movieName: showing?.title,
        selectedSeats: selectedSeats.join(", "),
        childCount: ticketCount.child,
        adultCount: ticketCount.adult,
        seniorCount: ticketCount.senior,
        totalTickets: ticketCount.child + ticketCount.adult + ticketCount.senior,
        date: new Date(showing!.date).toLocaleDateString(),
        time: showing?.time,
        venue: showing?.name,
      };
      try {
        const response = await fetch("/api/send-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody),
        });

        if (response.ok) {
          alert(`Bokningsbekräftelse skickad till ${email}!`);
          setEmail(""); // remove the mail from field when email is sent
        } else {
          alert("Något gick fel vid bokning");
        }
      }
      catch (error) {
        console.error("Fel:", error);
        alert("Kunde inte skicka bokning");
      }
    }
    catch (error) {
      console.error("Fel:", error);
      alert("Kunde inte skicka bokning");
      return;
    }

  };

  const [seats] = useFetchJson<ShowingSeats[] | null>(
    `/api/showingsAllSeats?where=id=${showingId}`,
  );
  // Array with seat id
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);

  const [ticketCount, setTicketCount] = useState<TicketCount>({
    child: 0,
    adult: 0,
    senior: 0,
  });

  const toggleSeat = (seatId: number) => {
    setSelectedSeats((seat) => {
      if (seat.includes(seatId)) {
        // if the seat is already selected, remove selection
        return seat.filter((id) => id !== seatId);
      } else {
        // if it is not selected, select it
        return [...seat, seatId];
      }
    });
  };

  async function createBooking() {

    const res = await fetch("/api/send-confirm/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: generateBookingID(),
        cost: 360,
        createdAt: new Date(Date.now()).toLocaleDateString("sv-SE").slice(0, 10) + " " + new Date(Date.now()).toLocaleTimeString('sv-SE'),
        showingId: showingId.toString(),
      }),
    });
    const data = await res.json();
    alert(JSON.stringify(data, null, 2));
  }

  async function createbookedSeat(seatNr: number) {
    const res = await fetch("/api/bookedSeat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        seatId: seatNr,
        bookingId: 2,
        ticketType: 1,
      }),
    });

    const data = await res.json();
    // alert(JSON.stringify(data, null, 2));
  }

  var rows = 0;

  function incrementTicket(type: keyof TicketCount) {
    setTicketCount((prev) => ({ ...prev, [type]: prev[type] + 1 }));
  }
  function decrementTicket(type: keyof TicketCount) {
    setTicketCount((prev) => ({
      ...prev,
      [type]: Math.max(0, prev[type] - 1),
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
            incrementTicketCount={() => incrementTicket("child")}
            decrementTicketCount={() => decrementTicket("child")}
          />
        }
        {
          <SeatType
            key={1}
            name={TICKET_TEXT[TICKET_KEYS[1]]}
            info={TICKET_INFO[TICKET_KEYS[1]]}
            price={TICKET_PRICES[TICKET_KEYS[1]]}
            ticketCount={ticketCount.adult}
            incrementTicketCount={() => incrementTicket("adult")}
            decrementTicketCount={() => decrementTicket("adult")}
          />
        }
        {
          <SeatType
            key={2}
            name={TICKET_TEXT[TICKET_KEYS[2]]}
            info={TICKET_INFO[TICKET_KEYS[2]]}
            price={TICKET_PRICES[TICKET_KEYS[2]]}
            ticketCount={ticketCount.senior}
            incrementTicketCount={() => incrementTicket("senior")}
            decrementTicketCount={() => decrementTicket("senior")}
          />
        }
      </>
    );
  }

  if (seats != null) {
    seats?.forEach((seat) => {
      if (seat.rowNr > rows) {
        rows = seat.rowNr;
      }
    });

    return (
      <>
        <div className="top-0 bottom-0 left-0 content-center justify-center">
          {/* Ticket Selection */}
          <div className="bg-zinc-950 rounded-2xl border-2 border-white/20 p-8 mb-8">
            <div className="max-w-2xl mx-auto space-y-4">
              <CreateSeatTypes />
            </div>
          </div>
          {/* Seat Selection */}
          <div className="bg-zinc-950 rounded-2xl border-2 border-white/20 p-8 mb-8">
            {Array.from({ length: rows }, (_, rowIndex) => (
              <div key={rowIndex} className="flex justify-center gap-4 mb-4">
                {seats
                  ?.filter((seat) => seat.rowNr === rowIndex + 1)
                  .map((seat) => {
                    const isSelected = selectedSeats.includes(seat.seatId);

                    return (
                      <button
                        key={seat.seatId}
                        onClick={() => toggleSeat(seat.seatId)}
                        className={`
                          px-4 py-2 text-white outline-solid rounded 
                          transition-all duration-200
                          ${isSelected
                            ? "bg-green-600 hover:bg-green-700 "
                            : "hover:bg-red-600"
                          }
                        `}
                      >
                        {seat.seatId}
                      </button>
                    );
                  })}
              </div>
            ))}
          </div>

          {/* Confirmation Section for sending mail - Only shows when all seats are selected */}
          <form onSubmit={bookingConfirmation}>
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
          </form>
        </div>
      </>
    );
  }
}
