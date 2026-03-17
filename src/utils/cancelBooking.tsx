import fetchJson from "./fetchJson";

export default async function cancelBooking(bookingId?: string) {
  if (!bookingId) { return false; }
  const result = await fetchJson(`/api/bookings/${bookingId}`,
    {
      method: 'DELETE'
    },
  );
  if (result.rowsAffected === 1) {
    return true;
  }
  else { return false; }
}