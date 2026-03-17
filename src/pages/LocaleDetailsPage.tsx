import { Clock } from "lucide-react";
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

  // const [venueSeats] = useFetchJson<
  //   {
  //     id: number;
  //   }[]
  // >(`/api/seats?WHERE=venueId=${venue?.[0].id}`);

  return (
    <>
      <section>
        {/* Hero Section */}
        <div className="relative h-96 mb-16 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black z-10" />
          <img
            src="https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?auto=format&fit=crop&q=80&w=1920"
            alt="Cinema Interior"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-4">
            <p className="text-5xl md:text-7xl font-bold mb-6">Om CineSharp</p>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl">
              Din moderna biograf med den senaste teknologin och högsta
              komforten
            </p>
          </div>
        </div>
      </section>

      <section>
        <div className="max-w-7xl mx-auto py-8 px-16">
          <div className="flex flex-col items-center justify-center max-w-5xl mx-auto text-center">
            <h2 className="text-3xl font-bold ">Vår vision</h2>
            <p className="mt-6 text-xl">
              CineSharp grundades 2026 med en vision att skapa den ultimata
              bioupplevelsen. Vi kombinerar banbrytande teknik med exceptionell
              service och komfort för att ge våra gäster minnesvärda stunder.
            </p>
          </div>
        </div>
      </section>

      <section>
        <div className="max-w-7xl mx-auto py-8 px-16">
          <h2 className="text-3xl font-bold mb-4">Våra Salar</h2>
          <div className="h-1 w-24 border-4 rounded-lg border-red-800 " />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            <div className="border border-white/5 rounded-3xl hover:border-white/20 duration-150 ease-in group">
              <div className="relative h-64 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&q=80&w=800"
                  className="bg-zinc-950 border border-white/5 object-cover w-full h-full rounded-3xl group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 to-transparent">
                  <div className="absolute bottom-2 p-6 text-white">
                    <h3 className="text-2xl font-semibold ">
                      {venue?.[0].info}
                    </h3>
                  </div>
                </div>
              </div>
              <div className="pt-6 px-8">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-700">Kapacitet</p>
                    <p className="text-white/100 mb-4 right-0">80 platser</p>
                  </div>
                  <div>
                    <p className="text-gray-700">Duk</p>
                    <p className="text-white/100">15x8 meter</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="border border-white/5 rounded-3xl hover:border-white/20 duration-150 ease-in group">
              <div className="relative h-64 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&q=80&w=800"
                  className="bg-zinc-950 border border-white/5 object-cover w-full h-full rounded-3xl group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 to-transparent">
                  <div className="absolute bottom-2 p-6 text-white">
                    <h3 className="text-2xl font-semibold ">
                      {venue?.[1].info}
                    </h3>
                  </div>
                </div>
              </div>
              <div className="pt-6 px-8">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-700">Kapacitet</p>
                    <p className="text-white/100 mb-4 right-0">80 platser</p>
                  </div>
                  <div>
                    <p className="text-gray-700">Duk</p>
                    <p className="text-white/100">15x8 meter</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="border border-red-800 rounded-3xl bg-red-800/10 mt-12 p-8 ">
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
