import useFetchJson from "./useFetchJson";
import type Seats from "../interfaces/seats";

export default async function getSeatNumber(rowNr: number, columnNr: number, venueId: number) {
    const [seats] = useFetchJson<Seats[] | null>(
        `/api/seats?where=venueId=${venueId}`
    );

    let result: number = 0;

    const maxColumnByRow = new Map<number, number>();

    seats?.forEach((seat) => {
        if (seat.rowNr <= rowNr) {
            const current = maxColumnByRow.get(seat.rowNr);
            if (current === undefined || seat.columnNr > current) {
                maxColumnByRow.set(seat.rowNr, seat.columnNr);
            }
        }
    });

    maxColumnByRow.forEach((maxColumn) => {
        result += maxColumn;
    });

    result -= columnNr

    return result;
};