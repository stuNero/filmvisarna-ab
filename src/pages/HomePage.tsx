import MovieCard from "./MovieCard.tsx";

HomePage.route = {
  path: '/',
  menuLabel: 'Home',
  index: 1
};

export default function HomePage() {
  return <div className="hero flex flex-col 
                        ">
    <section className="
                        bg-[url('/bg-image.svg')] bg-center
                        top-0 bottom-0 left-0 h-[75vh]
                        content-center justify-center
                        ">
      <div className="scale-90 mb-50 md:w-[50vw] md:ml-50 md:scale-125">
        <h1 className="text-3xl">Upplev bio som aldrig förr</h1>
        <p>
          Fördjupa dig i de senaste storfilmerna med toppmodern ljudteknik och <br /> fantastisk bild. Boka dina biljetter nu.
        </p>
      </div>
    </section>
    <section>
      <div className="mt-5">
        <h2 className="text-center text-6xl pt-2 pb-2">Visas nu</h2>
      </div>
      <MovieCard />
    </section>
  </div>;
}
