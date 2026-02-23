export default interface MovieShowings {
  title: string,
  showingId: number,
  timeSlot: number,
  venueID: number,
  name: string;
};
export interface movieWithShowings {
  title: string,
  timeSlots: string[];
}