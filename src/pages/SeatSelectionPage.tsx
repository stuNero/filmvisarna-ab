import { useParams } from "react-router-dom";
import useFetchJson from "../utils/useFetchJson";
import type ShowingSeats from "../interfaces/ShowingSeats";
import { useState, useEffect } from "react";
import SeatType from "../parts/SeatType";
import { Mail } from "lucide-react";

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

export default function SeatSelectionPage() {
  // code for email confirmation
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  const bookingConformation = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email) {
      setEmailError("Skriv in din email först!");
      return;
    }

    try {
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email,
          //  movieName: details?.title,
        }),
      });

      if (response.ok) {
        alert(`Bokningsbekräftelse skickad till ${email}!`);
        setEmail(""); // Rensar fältet
      } else {
        alert("Något gick fel vid bokning");
      }
    } catch (error) {
      console.error("Fel:", error);
      alert("Kunde inte skicka bokning");
    }
  };

  const { id } = useParams<{ id: string }>();
  const showingId = Number(id);
  const [seats] = useFetchJson<ShowingSeats[] | null>(
    `/api/showingsAllSeats?where=id=${showingId}`,
  );
  console.log(seats);

  const [ticketCount, setTicketCount] = useState<TicketCount>({
    child: 0,
    adult: 0,
    senior: 0,
  });

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
          <h2>Detta är sidan för att reservera säten</h2>

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
                  .map((seat) => (
                    <button
                      key={seat.seatId}
                      className="px-4 py-2 text-white outline-solid rounded hover:bg-red-600"
                    >
                      {seat.seatId}
                    </button>
                  ))}
              </div>
            ))}
          </div>

          {/* Confirmation Section for sending mail - Only shows when all seats are selected */}
          <form onSubmit={bookingConformation}>
            <div className="bg-zinc-950 rounded-2xl border-2 border-green-700/30 p-8 md:p-12 mt-8">
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
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setEmail(e.target.value)
                      }
                      placeholder="din.epost@exempel.se"
                      className={`w-full bg-black border rounded-lg pl-12 pr-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 transition-all ${
                        emailError
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
