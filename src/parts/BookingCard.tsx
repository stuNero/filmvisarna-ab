import useFetchJson from "../utils/useFetchJson";
import type BookingCardInfo from '../interfaces/BookingCardInfo';

interface BookingCardProps {
    bookingId: string;
}

export default function BookingCard({bookingId}: BookingCardProps) {

    //Get bookinginfo
    const [bookings] = useFetchJson<BookingCardInfo[] | null>(
        `/api/bookingCard?WHERE=bookingId=${bookingId}`
    );
    const booking = bookings?.[0];

    return <>
        <div className="bg-zinc-950 rounded-2xl border-2 border-white/20 p-8 mb-8">
            <section
                className="rounded-lg 
                     overflow-hidden
                     relative
                     w-full
                     aspect-2/3                    
                     "
            >
                <img
                    src={booking?.coverImage}
                >
                </img>
                <p>title:{booking?.title}</p>
            </section>
        </div>
    </>;
}