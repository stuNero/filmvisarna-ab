import { Calendar, Ticket, MapPin, Clock } from 'lucide-react';
import useFetchJson from "../utils/useFetchJson";
import type BookingCardInfo from '../interfaces/BookingCardInfo';
import getSeatNumber from '../utils/getSeatNumber';
import type Seats from '../interfaces/Seats';

interface BookingCardProps {
    bookingId: string;
    onCancelButton: (bookingId: string) => void;
}

export default function BookingCard({bookingId, onCancelButton}: BookingCardProps) {

    //Get bookinginfo
    const [bookings] = useFetchJson<BookingCardInfo[] | null>(
        `/api/bookingCard?WHERE=bookingId=${bookingId}`
    );
    const booking = bookings?.[0];

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
      }[] | null>
      (
        `/api/bookedSeatsWithShowings?WHERE=bookingId=${bookingId}`
    );
    const firstSeat = bookedSeats?.[0] ?? { rowNr: 0, columnNr: 0};

    return <>
        <div className="bg-zinc-950 rounded-2xl border-2 border-white/20 p-8 mb-8 flex gap-3">
            <div
                className="w-32 h-44 md:h-auto rounded-xl overflow-hidden flex-shrink-0">
                    <img src={booking?.coverImage}>
                    </img>
            </div>
            <div>
                <div className="flex-1 flex flex-col justify-between">
                    <p className="text-2xl font-bold text-white">{booking?.title}</p>
                    <p className="text-gray-500 text-sm">Bokningsnummer: <span className="text-gray-300 font-mono">{booking?.bookingId}</span></p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <div className="flex items-center gap-3">
                            <Calendar className="w-4 h-4 text-red-500"/>
                            <div>
                                <p className="text-[10px] text-gray-500 uppercase tracking-wider">Datum</p>
                                <p className="text-sm text-white">{booking?.timeSlot}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Clock className="w-4 h-4 text-red-500"/>
                            <div>
                                <p className="text-[10px] text-gray-500 uppercase tracking-wider">Tid</p>
                                <p className="text-sm text-white">{booking?.timeSlot}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <MapPin className="w-4 h-4 text-red-500"/>
                            <div>
                                <p className="text-[10px] text-gray-500 uppercase tracking-wider">Salong</p>
                                <p className="text-sm text-white">{booking?.name}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Ticket className="w-4 h-4 text-red-500"/>
                            <div>
                                <p className="text-[10px] text-gray-500 uppercase tracking-wider">Platser</p>
                                <p className="text-sm text-white">{getSeatNumber(firstSeat?.rowNr, firstSeat?.columnNr, seats)}</p>
                            </div>
                        </div>
                    </div>
                    <p className="text-gray-500 text-sm">Totalbelopp: <span className="text-white font-bold ml-1">{booking?.cost} SEK</span></p>
                </div>
            </div>
            <div>
                <button
                    onClick={() => onCancelButton(bookingId)}
                    className={
                        'flex items-center gap-2 px-4 py-2 bg-red-800/10 hover:bg-red-800/20 text-red-700 border border-red-700/20 rounded-xl transition-all text-sm font-medium'
                    }
                >
                    Avboka
                </button>
            </div>
        </div>
    </>;
}