import { Link } from 'react-router-dom';
import MovieCard from '../parts/MovieCard.tsx';
import KioskInfoPage from './KioskPage.tsx';

HomePage.route = {
  path: '/'
};

export default function HomePage() {
  return (
    <div className="container mx-auto">
      <div className="flex flex-col  ">
        <section className="inline-block relative">
          <section className="
            bg-[url('/bg-image.webp')] bg-center
            bg-cover                       
            h-[75vh]
            fit-content
            ">
            <div className="
              absolute inset-0 
              bg-linear-to-t
              from-black from-20% via-black/50 via-70% to-transparent to-99%
              fit-content"/>
            <div className="
              md:flex md:flex-col
              md:items-center
              md:gap-50
              absolute container 
              px-4 mx-auto mt-10 
              text-shadow-lg
              pt-20
                          ">
              <div className="md:-translate-x-50 max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-16 min-w-xs md:relative">
                <h1 className="text-5xl md:text-7xl font-normal md:max-w-xl">
                  Upplev bio som aldrig förr
                </h1>
                <p className="text-xl font-normal py-6">
                  Fördjupa dig i de senaste storfilmerna med toppmodern
                  ljudteknik och <br /> fantastisk bild. Boka dina biljetter nu.
                </p>
              </div>
              <Link
                to={KioskInfoPage.route.path}
                className="
                md:content-center
                md:text-3xl
                md:scale-150
                md:translate-x-90
                md:-translate-y-90
                md:overflow-hidden
                md:hover:scale-155
                text-shadow-black
                text-shadow-md
                block
                w-full md:w-70 md:h-100
                -translate-y-1
                backdrop-blur
                border-t border-l border-zinc-700
                rounded-xl
                px-6 py-4
                text-center
                text-lg
                bg-[url('/snack-bar.webp')]
                bg-cover
                bg-bottom
                transition
                "
              >
                <h1>
                  Utforska vårat kiosk utbud!
                </h1>
              </Link>
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
