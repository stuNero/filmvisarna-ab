import MovieCard from "../parts/MovieCard.tsx";

HomePage.route = {
  path: "/",
  menuLabel: "Home",
  index: 1,
};

export default function HomePage() {
  return (
    <div className="container mx-auto px-4">
      <div className="flex flex-col  ">
        <section className="flex inline-block relative">
          <section
            className="
                        bg-[url('/bg-image.webp')] bg-center
                        bg-cover                       
                        h-[75vh]
                        "
          >
            <div
              className="absolute inset-0 
                          bg-gradient-to-t
                        from-black from-20% via-black/50 via-70% to-transparent to-99%"
            ></div>

            <div
              className="absolute container px-4 mx-auto mt-10 text-shadow-lg
                          "
            >
              <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-16 min-w-xs ">
                <h1 className="text-5xl md:text-7xl font-normal md:max-w-xl">
                  Upplev bio som aldrig förr
                </h1>
                <p className="text-xl font-normal py-6">
                  Fördjupa dig i de senaste storfilmerna med toppmodern
                  ljudteknik och <br /> fantastisk bild. Boka dina biljetter nu.
                </p>
              </div>
            </div>
          </section>
        </section>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 lg:-translate-y-40 md:-translate-y-40 sm:-translate-y-20 -translate-y-20 ">
          <h2 className="text-center text-6xl py-2 mb-5">Visas nu</h2>
          <div className="flex justify-center">
            <MovieCard />
          </div>
        </section>
      </div>
    </div>
  );
}
