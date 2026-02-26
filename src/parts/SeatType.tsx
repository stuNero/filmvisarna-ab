interface SeatTypeProps {
    name: string;
    info: string;
    price: number;
    ticketCount: number;
    incrementTicketCount: () => void;
    decrementTicketCount: () => void;
}

export default function SeatType({ name, info, price, ticketCount, incrementTicketCount , decrementTicketCount}: SeatTypeProps) {
    return <>
        <div className="flex items-center justify-between bg-black rounded-lg p-4 border border-white/10">
            <div>
                <p>{name}</p>
                <p>{info}</p>
                <p className="text-red-500 font-medium">{price}kr</p>
            </div>
            <div className="flex items-center gap-3">
                <button className="px-4 py-2 text-white outline-solid rounded hover:bg-red-600" onClick={decrementTicketCount}>-</button>
                <p>{ticketCount}</p>
                <button className="px-4 py-2 text-white outline-solid rounded hover:bg-red-600" onClick={incrementTicketCount}>+</button>
            </div>
        </div>
    </>;
}