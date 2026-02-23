import { useParams } from "react-router-dom";
import useFetchJson from "../utils/useFetchJson";
import type ShowingSeats from "../interfaces/ShowingSeats";
import { useState, useEffect} from "react";

SeatSelectionPage.route = {
  path: '/seatselection/:id',
  menuLabel: 'Seat Selection',
  index: 3
};

const TICKET_PRICES = {
  children: 80,
  regular: 140,
  seniors: 120,
};

interface TicketCount {
  children: number;
  regular: number;
  seniors: number;
}

export default function SeatSelectionPage() {

  const { id } = useParams<{ id: string; }>();
  const showingId = Number(id);
  const [seats] = useFetchJson<ShowingSeats[] | null>(`/api/showingsAllSeats?where=id=${showingId}`);
  console.log(seats);

  const [ticketCount, setTicketCount] = useState<TicketCount>({
    children: 0,
    regular: 0,
    seniors: 0,
  });

  var rows = 0;
  var cols = 0;

  if (seats != null) {

    seats?.forEach(seat => {
      if (seat.columnNr > cols) { cols = seat.columnNr; }
      if (seat.rowNr > rows) { rows = seat.rowNr; }
    });


    return <>
      <div className="top-0 bottom-0 left-0 h-[75vh] content-center justify-center">
        <h2>Detta är sidan för att reservera säten</h2>

        <div className="p-8 max-w-full mx-auto">
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