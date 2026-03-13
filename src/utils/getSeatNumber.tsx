export default function getSeatNumber( rowNr: number, columnNr: number, seats: any[] | null ) {

    let result: number = 1;

    //Create an array, and populate it with the highest numbered seat of each row
    const maxColumnByRow = new Map<number, number>();
    seats?.forEach((seat) => {
        if (seat.rowNr <= rowNr) {
            const current = maxColumnByRow.get(seat.rowNr);
            if (current === undefined || seat.columnNr > current) {
                maxColumnByRow.set(seat.rowNr, seat.columnNr);
            }
        }
    });

    //Add the column number of each entry in maxColumnByRow to the results variable
    maxColumnByRow.forEach((maxColumn) => {
        result += maxColumn;
    });

    //Subtract the columnNr of the seat being calculated from results (needs to be subtracted since we render the seats left to right, as opposed to specifications)
    result -= columnNr

    return result;
};