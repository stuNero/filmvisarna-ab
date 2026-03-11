export default function getSeatNumber( rowNr: number, columnNr: number, seats: any[] | null ) {

    let result: number = 1;

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