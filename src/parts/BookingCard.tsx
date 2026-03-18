import { Calendar, Ticket, MapPin, Clock, ChevronRight } from 'lucide-react';
import useFetchJson from "../utils/useFetchJson";
import getSeatNumber from '../utils/getSeatNumber';
import type Seats from '../interfaces/Seats';
import { Link } from 'react-router-dom';

interface BookingCardProps {
    bookingId: string;
    timeSlot: number;
    title: string;
    name: string;
    coverImage: string;
    cost: number;
    active: boolean
    onCancelButton: (bookingId: string) => void;
}

export default function BookingCard({bookingId, timeSlot, title, name, coverImage, cost, active, onCancelButton}: BookingCardProps) {

    const [seats] = useFetchJson<Seats[] | null>(
        `/api/seatsByBooking?WHERE=bookingid=${bookingId}`
    );

    //Get booked seats
    const [bookedSeats] = useFetchJson<{
        seatId: number,
        bookingId: string,
        ticketType: string,
        showingId: number,
        rowNr: number,
        columnNr: number;
    }[] | null>(
        `/api/bookedSeatsWithShowings?WHERE=bookingId=${bookingId}`
    );
    const firstSeat = bookedSeats?.[0] ?? { rowNr: 0, columnNr: 0};


    //Gets date and time strings
    const dateStr = timeSlot ? new Date(timeSlot).toLocaleDateString('sv-SE') : '';
    const timeStr = timeSlot ? new Date(timeSlot).toLocaleTimeString('sv-SE', {
        hour: '2-digit',
        minute: '2-digit'
    }) : '';

    return <>
        <div className="bg-zinc-950 rounded-2xl border-2 border-white/20 p-8 mb-8 flex flex-wrap gap-3">
            <div
                className="w-32 h-48 rounded-xl overflow-hidden flex-shrink-0">
                    <img src={coverImage}
                    className="aspect-2/3"
                    />
            </div>
            <div className="flex-1 flex flex-col justify-between max-h-50">
                <p className="text-2xl font-bold text-white truncate overflow-hidden max-w-60 md:max-w-none">{title}</p>
                <p className="text-gray-500 text-sm">Bokningsnummer: <span className="text-gray-300 font-mono">{bookingId}</span></p>
                <div className="h-28 grid grid-cols-2 md:grid-cols-4 gap-y-6 gap-x-20">
                    <div className="flex items-center gap-3">
                        <Calendar className="w-6 h-6 min-w-6 min-h-6 shrink-0 text-red-500"/>
                        <div>
                            <p className="text-[10px] text-gray-500 uppercase tracking-wider">Datum</p>
                            <p className="text-sm text-white">{dateStr}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Clock className="w-6 h-6 min-w-6 min-h-6 shrink-0 text-red-500"/>
                        <div>
                            <p className="text-[10px] text-gray-500 uppercase tracking-wider">Tid</p>
                            <p className="text-sm text-white">{timeStr}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <MapPin className="w-6 h-6 min-w-6 min-h-6 shrink-0 text-red-500"/>
                        <div>
                            <p className="text-[10px] text-gray-500 uppercase tracking-wider">Salong</p>
                            <p className="text-sm text-white">{name}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Ticket className="w-6 h-6 min-w-6 min-h-6 shrink-0 text-red-500"/>
                        <div>
                            <p className="text-[10px] text-gray-500 uppercase tracking-wider">Platser</p>
                            <p className="text-sm text-white truncate">{getSeatNumber(firstSeat?.rowNr, firstSeat?.columnNr, seats)}</p>
                        </div>
                    </div>
                </div>
                <p className="text-gray-500 text-sm">Totalbelopp: <span className="text-white font-bold ml-1">{cost} SEK</span></p>
            </div>
            <div className="ml-auto flex flex-row sm:flex-col items-end gap-4 sm:gap-32">
                {active ? (
                    <button
                        onClick={() => onCancelButton(bookingId)}
                        className="flex items-center gap-2 h-10 px-4 bg-red-800/10 hover:bg-red-800/20 hover:text-red-400 text-red-500 border border-red-700/20 rounded-xl transition-all text-sm font-medium"
                    >
                        Avboka
                    </button>
                ) : (
                    <></>
                )}
                <Link to={"/bekraftelse/" + bookingId}>
                    <button
                        className="flex items-center gap-2 h-10 px-4 text-red-500 hover:text-red-400 text-sm font-medium transition-colors"
                        onClick={() => onCancelButton(bookingId)}
                    >
                        Bekräftelse <ChevronRight className="w-4 h-4" />
                    </button>
                </Link>
            </div>
        </div>
    </>;
}