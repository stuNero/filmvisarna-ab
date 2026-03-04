import MovieCard from "../parts/MovieCard.tsx";

HomePage.route = {
  path: "/",
  menuLabel: "Home",
  index: 1,
};

export default function HomePage() {
  return (
    <div
      className="hero flex flex-col 
                        "
    >
      <section className="flex inline-block relative">
        <section
          className="
                        bg-[url('/bg-image.webp')] bg-center
                        bg-cover                       
                        h-[75vh]
                        z-0
                        "
        >
          <div
            className="absolute inset-0 
                          z-10
                          bg-gradient-to-t
                        from-black from-20% via-black/50 via-50% to-transparent to-90%"
          ></div>

          <div className="absolute mt-10 z-20 text-shadow-lg">
            <h1 className="text-6xl">Upplev bio som aldrig förr</h1>
            <p className="text-2xl mt-4">
              Fördjupa dig i de senaste storfilmerna med toppmodern ljudteknik
              och <br /> fantastisk bild. Boka dina biljetter nu.
            </p>
          </div>
        </section>
      </section>

      <section>
        <div className="mt-5">
          <h2 className="text-center text-6xl pt-2 pb-2">Visas nu</h2>
        </div>
        <MovieCard />
      </section>
    </div>
  );
}
