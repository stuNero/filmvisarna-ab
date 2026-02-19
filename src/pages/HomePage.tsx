import MovieCard from "./MovieCard.tsx";

HomePage.route = {
  path: '/',
  menuLabel: 'Home',
  index: 1
};

export default function HomePage() {
  return <>
    <section id="hero" className="flex flex-col">
      <div className="mt-24">
        <h1 className="">Upplev bio som aldrig förr</h1>
        <pre>
          Fördjupa dig i de senaste storfilmerna med toppmodern ljudteknik och fantastisk
          bild. Boka dina biljetter nu.
        </pre>
      </div>
    </section>
    <section>
      <div className="mt-5">
        <h2 className="text-center text-6xl pt-2 pb-2">Visas nu</h2>
      </div>
      <MovieCard />
    </section>
  </>;
}
