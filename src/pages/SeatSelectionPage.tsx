import { useParams } from "react-router-dom";
import useFetchJson from "../utils/useFetchJson";
import type ShowingSeats from "../interfaces/ShowingSeats";
import { useState, useEffect} from "react";
import SeatType from "../parts/SeatType";

SeatSelectionPage.route = {
  path: '/seatselection/:id',
  menuLabel: 'Seat Selection',
  index: 3
};


const TICKET_TEXT = {
  child: "Barn",
  adult: "Vuxen",
  senior: "Pensionär"
};

const TICKET_INFO = {
  child: "Under 12 år",
  adult: "12 - 64 år",
  senior: "Över 64 år"
};

const TICKET_PRICES = {
  child: 80,
  adult: 140,
  senior: 120,
};

const TICKET_KEYS = Object.keys(TICKET_TEXT) as Array<keyof typeof TICKET_TEXT>;
const TICKET_SIZE = TICKET_KEYS.length;

interface TicketCount {
  child: number;
  adult: number;
  senior: number;
};


export default function SeatSelectionPage() {

  const { id } = useParams<{ id: string; }>();
  const showingId = Number(id);
  const [seats] = useFetchJson<ShowingSeats[] | null>(`/api/showingsAllSeats?where=id=${showingId}`);
  console.log(seats);

  const [ticketCount, setTicketCount] = useState<TicketCount>({
    child: 0,
    adult: 0,
    senior: 0,
  });


  var rows = 0;

  function incrementTicket(type: keyof TicketCount) { setTicketCount(prev => ({ ...prev, [type]: prev[type] + 1 })); }
  function decrementTicket(type: keyof TicketCount) { setTicketCount(prev => ({ ...prev, [type]: Math.max(0, prev[type] - 1)})); }

  function CreateSeatTypes() {
    return <>
      {<SeatType 
          key={0} 
          name={TICKET_TEXT[TICKET_KEYS[0]]}
          info={TICKET_INFO[TICKET_KEYS[0]]}
          price={TICKET_PRICES[TICKET_KEYS[0]]}
          ticketCount={ticketCount.child}
          incrementTicketCount={() => incrementTicket("child")}
          decrementTicketCount={() => decrementTicket("child")}
        />}
      {<SeatType 
          key={1} 
          name={TICKET_TEXT[TICKET_KEYS[1]]}
          info={TICKET_INFO[TICKET_KEYS[1]]}
          price={TICKET_PRICES[TICKET_KEYS[1]]}
          ticketCount={ticketCount.adult}
          incrementTicketCount={() => incrementTicket("adult")}
          decrementTicketCount={() => decrementTicket("adult")}
        />}
      {<SeatType 
          key={2} 
          name={TICKET_TEXT[TICKET_KEYS[2]]}
          info={TICKET_INFO[TICKET_KEYS[2]]}
          price={TICKET_PRICES[TICKET_KEYS[2]]}
          ticketCount={ticketCount.senior}
          incrementTicketCount={() => incrementTicket("senior")}
          decrementTicketCount={() => decrementTicket("senior")}
        />}
      
    </>;
  }
  
  
  if (seats != null) {

    seats?.forEach(seat => {
      if (seat.rowNr > rows) { rows = seat.rowNr; }
    });
    
    return <>
      <div className="top-0 bottom-0 left-0 h-[100vh] content-center justify-center">
        <h2>Detta är sidan för att reservera säten</h2>

        {/* Ticket Selection */}
        <div className="bg-zinc-950 rounded-2xl border-2 border-white/20 p-8 mb-8">
          <div className="max-w-2xl mx-auto space-y-4">
            <CreateSeatTypes  />
          </div>
        </div>
        {/* Seat Selection */}
        <div className="bg-zinc-950 rounded-2xl border-2 border-white/20 p-8 mb-8">
          {Array.from({ length: rows }, (_, rowIndex) => (
            <div key={rowIndex} className="flex justify-center gap-4 mb-4">
              {seats?.filter(seat => seat.rowNr === rowIndex + 1).map((seat) => (
                <button
                  key={seat.seatId}
                  className="px-4 py-2 text-white outline-solid rounded hover:bg-red-600">
                  {seat.seatId}
                </button>
              ))}
            </div>
          ))}
        </div>
        
      </div>
    </>;
  }
};



