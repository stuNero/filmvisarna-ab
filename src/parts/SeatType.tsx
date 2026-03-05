
interface SeatTypeProps {
  name: string;
  info: string;
  price: number;
  ticketCount: number;
  incrementTicketCount: () => void;
  decrementTicketCount: () => void;
}

let totalTickets = 0;

export default function SeatType({ name, info, price, ticketCount, incrementTicketCount, decrementTicketCount }: SeatTypeProps) {

  function incrementTicket() {
    if (ticketCount < 8) {
      incrementTicketCount();
    }
    if (totalTickets < 8) { totalTickets++; }
  }
  function decrementTicket() {
    if (ticketCount > 0) {
      decrementTicketCount();
    }
    if (totalTickets > 0) { totalTickets--; }
  }

  return <>
    <div className="flex items-center justify-between bg-black rounded-lg p-4 border border-white/10">
      <div>
        <p>{name}</p>
        <p>{info}</p>
        <p className="text-red-500 font-medium">{price}kr</p>
      </div>
      <div className="flex items-center gap-3">
        <button className={totalTickets > 0 && ticketCount > 0 ? `px-4 py-2 font-extrabold size-10 text-stone-500 outline-solid rounded hover:bg-red-600`
          : `px-4 py-2 font-extrabold size-10 text-stone-800 outline-solid rounded`
        } onClick={decrementTicket}>-</button>
        <p>{ticketCount}</p>
        <button className={totalTickets < 8 ? `px-4 py-2 font-extrabold size-10 text-stone-500 outline-solid rounded hover:bg-red-600`
          : `px-4 py-2 font-extrabold size-10 text-stone-800 outline-solid rounded`
        } onClick={incrementTicket}>+</button>
      </div>
    </div>
  </>;
}
