export default interface BookedSeatsWithShowings {
  seatId: number,
  bookingId: number,
  ticketType: string,
  showingId: number,
  rowNr: number,
  columnNr: number;
}