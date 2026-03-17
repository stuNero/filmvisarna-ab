import { Clock, TvMinimal, Volume2, Film } from "lucide-react";
import useFetchJson from "../utils/useFetchJson";

LocaleDetailsPage.route = {
  path: "/om-oss",
  menuLabel: "Om Oss",
};

export default function LocaleDetailsPage() {
  const [venue] = useFetchJson<
    {
      id: number;
      name: string;
      info: string;
    }[]
  >(`/api/venues`);

  const [seats] = useFetchJson<
    {
      id: number;
      venueId?: number;
    }[]
  >(`/api/seats`);

  const seatsPerVenue = (seats ?? []).reduce<Record<number, number[]>>(
    (acc, seat) => {
      const venueKey = seat.venueId;
      if (venueKey == null) return acc;

      if (!acc[venueKey]) acc[venueKey] = [];
      acc[venueKey].push(seat.id);
      return acc;
    },
    {},
  );
  type BookingInfoRow = {
    timeSlot: string;
  };

  const [bookingInfo] = useFetchJson<BookingInfoRow[] | null>(
    "/api/bookingInfo",
  );

  const visitorsPerYear = (bookingInfo ?? []).reduce<Record<number, number>>(
    (acc, row) => {
      const year = new Date(row.timeSlot).getFullYear();
      acc[year] = (acc[year] ?? 0) + 1;
      return acc;
    },
    {},
  );

  const thisYear = new Date().getFullYear();
  const visitorsThisYear = visitorsPerYear[thisYear] ?? 0;

  const [showingInfo] = useFetchJson<
    {
      timeSlot: string;
      filmId: number;
    }[]
  >("/api/showings");

  const uniqueMoviesPerMonth = (showingInfo ?? []).reduce<
    Record<number, Set<number>>
  >((acc, row) => {
    const month = new Date(row.timeSlot).getMonth();
    if (!acc[month]) acc[month] = new Set<number>();
    acc[month].add(row.filmId);
    return acc;
  }, {});

  const thisMonth = new Date().getMonth();
  const moviesThisMonth = uniqueMoviesPerMonth[thisMonth]?.size ?? 0;

  return (
    <>
      <section>
        {/* Hero Section */}
        <div className="relative h-[24rem] md:h-96 mb-12 md:mb-16 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black z-10" />
          <img
            src="https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?auto=format&fit=crop&q=80&w=1920"
            alt="Cinema Interior"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-4">
            <p className="text-4xl sm:text-5xl md:text-7xl font-bold mb-4 md:mb-6">
              Om CineSharp
            </p>
            <p className="text-lg sm:text-xl md:text-2xl text-gray-300 max-w-3xl">
              Din moderna biograf med den senaste teknologin och högsta
              komforten
            </p>
          </div>
        </div>
      </section>

      <section>
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-16">
          <div className="flex flex-col items-center justify-center max-w-5xl mx-auto text-center mb-12 md:mb-24">
            <h2 className="text-3xl font-bold ">Vår vision</h2>
            <p className="mt-6 text-base sm:text-lg md:text-xl mb-5">
              CineSharp grundades 2026 med en vision att skapa den ultimata
              bioupplevelsen. Vi kombinerar banbrytande teknik med exceptionell
              service och komfort för att ge våra gäster minnesvärda stunder.
            </p>
            <p className="text-base sm:text-lg md:text-xl">
              Varje detalj är noggrant utvald - från de senaste
              laserprojektorerna till våra bekväma stolar och förstklassiga
              ljudsystem. Vi strävar efter att göra varje besök till något
              alldeles extra.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4  gap-4">
            <div className="border-1 border-white/20 rounded-2xl">
              <div className="m-4 md:m-8 text-center">
                <h1 className="text-2xl md:text-4xl text-red-600 font-bold">
                  {venue?.length}
                </h1>
                <h1 className=" text-md md:text-lg text-white/30">SALAR</h1>
              </div>
            </div>
            <div className="border-1 border-white/20 rounded-2xl">
              <div className="m-4 md:m-8 text-center">
                <h1 className="text-2xl md:text-4xl text-red-600 font-bold">
                  {seats?.length}
                </h1>
                <h1 className="text-md md:text-lg text-white/30">
                  SITTPLATSER
                </h1>
              </div>
            </div>
            <div className="border-1 border-white/20 rounded-2xl">
              <div className="m-4 md:m-8 text-center">
                <h1 className="text-2xl md:text-4xl text-red-600 font-bold">
                  {moviesThisMonth}
                </h1>
                <h1 className="text-md md:text-lg text-white/30">
                  FILMER/MÅNAD
                </h1>
              </div>
            </div>
            <div className="border-1 border-white/20 rounded-2xl">
              <div className="m-4 md:m-8 text-center">
                <h1 className="text-2xl md:text-4xl text-red-600 font-bold">
                  {visitorsThisYear}
                </h1>
                <h1 className="text-md md:text-lg text-white/30">
                  BESÖKARE I ÅR
                </h1>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-16">
          <h2 className="text-3xl font-bold mb-4">Vår Facilitet</h2>
          <div className="border-4 border-red-800 h-1 w-24 rounded-lg" />
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mt-8">
            <div className="border border-white/20 rounded-2xl p-6">
              <div className="mb-4 rounded-lg bg-red-800/20 w-12 h-12 items-center justify-center flex">
                <TvMinimal className="w-8 h-8 text-red-600" />
              </div>
              <div>
                <h2 className="text-xl md:text-2xl">Laser-projektion</h2>
              </div>
              <div className="mt-4">
                <p className="text-md text-white/60">
                  Våra salar är utrustade med den senaste
                  laserprojektionsteknologin för kristallklara bilder med
                  perfekt färgåtergivning.
                </p>
              </div>
            </div>

            <div className="border border-white/20 rounded-2xl p-6">
              <div className="mb-4 rounded-lg bg-red-800/20 w-12 h-12 items-center justify-center flex">
                <Volume2 className="w-8 h-8 text-red-600" />
              </div>
              <div>
                <h2 className="text-xl md:text-2xl">Dolby Atmos</h2>
              </div>
              <div className="mt-4">
                <p className="text-md text-white/60">
                  Immersivt 3D-ljud som flyttar sig runt dig i tre dimensioner
                  för en otrolig ljudupplevelse.
                </p>
              </div>
            </div>

            <div className="border border-white/20 rounded-2xl p-6">
              <div className="mb-4 rounded-lg bg-red-800/20 w-12 h-12 items-center justify-center flex">
                <Film className="w-8 h-8 text-red-600" />
              </div>
              <div>
                <h2 className="text-xl md:text-2xl">4K Ultra HD</h2>
              </div>
              <div className="mt-4">
                <p className="text-md text-white/60">
                  Alla våra skärmar visar filmer i 4K Ultra HD-upplösning för
                  maximal skärpa och detaljer.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-16">
          <h2 className="text-3xl font-bold mb-4">Våra Salar</h2>
          <div className="h-1 w-24 border-4 rounded-lg border-red-800 " />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            <div className="border border-white/5 rounded-3xl overflow-hidden hover:border-white/20 duration-150 ease-in group">
              <div className="relative h-64 overflow-hidden rounded-t-3xl">
                <img
                  src="https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&q=80&w=800"
                  className="bg-zinc-950 border border-white/5 object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 to-transparent">
                  <div className="absolute bottom-2 p-6 text-white">
                    <h3 className="text-2xl font-semibold ">
                      {venue?.[0].info}
                    </h3>
                  </div>
                </div>
              </div>
              <div className="pt-6 px-6 md:px-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-700">Kapacitet</p>
                    <p className="text-white/100 mb-4 right-0">
                      {venue?.[0]?.id != null
                        ? (seatsPerVenue[venue[0].id]?.length ?? 0)
                        : 0}{" "}
                      platser
                    </p>
                  </div>
                  <div className="mb-4">
                    <p className="text-gray-700">Duk</p>
                    <p className="text-white/100">15x8 meter</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="border border-white/5 rounded-3xl overflow-hidden hover:border-white/20 duration-150 ease-in group">
              <div className="relative h-64 overflow-hidden rounded-t-3xl">
                <img
                  src="https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&q=80&w=800"
                  className="bg-zinc-950 border border-white/5 object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 to-transparent">
                  <div className="absolute bottom-2 p-6 text-white">
                    <h3 className="text-2xl font-semibold ">
                      {venue?.[1].info}
                    </h3>
                  </div>
                </div>
              </div>
              <div className="pt-6 px-6 md:px-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-700">Kapacitet</p>
                    <p className="text-white/100 mb-4 right-0">
                      {venue?.[1]?.id != null
                        ? (seatsPerVenue[venue[1].id]?.length ?? 0)
                        : 0}{" "}
                      platser
                    </p>
                  </div>
                  <div className="mb-4">
                    <p className="text-gray-700">Duk</p>
                    <p className="text-white/100">15x8 meter</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="border border-red-800 rounded-3xl bg-red-800/10 mt-12 p-6 md:p-8">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-shrink-0">
                <div className="w-20 h-20 bg-red-800 rounded-2xl flex items-center justify-center">
                  <Clock className="w-10 h-10 text-white" />
                </div>
              </div>

              <div className="flex-1 text-center md:text-left">
                <h3 className="text-3xl font-bold text-white mb-4">
                  Öppettider
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-300">
                  <div>
                    <p className="font-semibold text-white">
                      Måndag - Torsdag:
                    </p>
                    <p>12:00 - 23:00</p>
                  </div>
                  <div>
                    <p className="font-semibold text-white">Fredag:</p>
                    <p>12:00 - 01:00</p>
                  </div>
                  <div>
                    <p className="font-semibold text-white">Lördag:</p>
                    <p>11:00 - 01:00</p>
                  </div>
                  <div>
                    <p className="font-semibold text-white">Söndag:</p>
                    <p>11:00 - 23:00</p>
                  </div>
                </div>
              </div>

              <div className="flex-shrink-0 text-center md:text-right">
                <div className="text-sm text-gray-400 mb-2">Kontakta oss</div>
                <div className="text-white font-semibold mb-1">
                  info@cinesharp.se
                </div>
                <div className="text-white font-semibold">08-123 456 78</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
