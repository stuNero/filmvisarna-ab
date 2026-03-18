import { Link } from 'react-router-dom';
import MovieCard from '../parts/MovieCard.tsx';
import KioskInfoPage from './KioskPage.tsx';
import { useState, useEffect, useMemo } from 'react';
import useFetchJson from '../utils/useFetchJson.ts';
import { Funnel } from 'lucide-react';

HomePage.route = {
  path: '/'
};

export default function HomePage() {
  const [date, setDate] = useState("");
  const [age, setAge] = useState<number | "">("");

  const agesRaw = useFetchJson<{ ageRating: number; }[]>('/api/ageRatings');

  const ages =
    useMemo(() => {
      return agesRaw[0]?.sort((a, b) => b.ageRating - a.ageRating).map((age) => age.ageRating);
    }, [agesRaw]);
  useEffect(() => {
    if (ages?.length && age === undefined) {
      setAge(ages[0]);
    }
  }, [ages]);

  return (
    <div className="container mx-auto">
      <div className="flex flex-col  ">
        <section className="inline-block relative md:mb-20">
          <section className="
            bg-[url('/bg-image.webp')] bg-center
            bg-cover                       
            h-[50vh]
            fit-content
            md:-translate-y-5
            lg:translate-y-0
            -translate-y-5
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
              <div className="
              max-w-7xl mx-auto
              px-4 sm:px-6 md:px-8 lg:px-16 min-w-xs
              md:scale-80 lg:scale-100
              sm:-translate-y-10 lg:-translate-x-40">
                <h1 className="text-5xl md:text-7xl font-semibold md:max-w-xl">
                  Upplev bio som aldrig förr
                </h1>
                <p className="text-xl font-normal py-6">
                  Fördjupa dig i de senaste storfilmerna med toppmodern
                  ljudteknik och <br className='hidden md:block' />fantastisk bild.
                  <br className='-' />
                  Boka dina biljetter nu!
                </p>
              </div>
              <Link
                to={KioskInfoPage.route.path}
                className="
                lg:content-center
                lg:scale-130
                translate-y-2 sm:-translate-y-10 md:-translate-y-60 lg:translate-x-90 lg:-translate-y-110
                max-w-70 w-full py-4 h-20 md:max-w-150 md:h-20 lg:w-70 lg:h-70
                lg:overflow-hidden lg:hover:scale-140 md:hover:scale-110
                lg:opacity-85
                text-shadow-black text-shadow-md text-center text-lg lg:text-3xl
                block
                backdrop-blur bg-[url('/snack-bar.webp')] bg-cover bg-bottom
                rounded-full
                transition
                "
              >
                <h1 className='md:backdrop-blur-xs text-2xl'>
                  Utforska vårt kioskutbud!
                </h1>
              </Link>
            </div>
          </section>
        </section>

        <section className="
        flex flex-col
        max-w-7xl mx-auto
        px-4 sm:px-6 lg:px-8
        mt-10 md:mt-20 lg:mt-32
        inset-0 z-50
        ">
          <div className='
          md:flex md:flex-row md:justify-between          
          '>
            <h2 className="
            text-center text-3xl font-semibold
            py-2 mb-5 md:ml-5
            ">Visas nu</h2>
            <section
              id="filters"
              className='
              flex justify-end
              items-end
              gap-1
              mx-4 mb-5 md:ml-0 md:mr-6'>
              <div className="relative px-3 py-1 bg-white/5 border border-stone-700 rounded-2xl hover-red hover:scale-105">
                <select
                  value={age ?? ""}
                  onChange={(event: any) => setAge(Number(event.target.value))}
                  className="w-full bg-transparent cursor-pointer outline-none appearance-none pr-6"
                >
                  <option value="" disabled hidden>
                    Alla åldrar
                  </option>
                  {ages?.map((age) => (
                    <option key={age} value={age}>{age}</option>
                  ))}
                </select>

                <Funnel className="absolute right-2 top-1/2 -translate-y-1/2 text-white/60 pointer-events-none" />
              </div>
              {/* TODO: input type="date" follows os/browser locale/lang - use date picker lib to force swedish format?*/}
              <input
                type="date"
                id="datepicker"
                min={new Date(Date.now()).toLocaleDateString("sv-SE").slice(0, 10)}
                value={date}
                onChange={event => setDate(event.target.value)}
                onClick={(e) => (e.currentTarget as HTMLInputElement).showPicker()}
                className="
                   cursor-pointer
                  hover-red
                  hover:scale-105
                  px-3 py-1 h-fit
                  bg-white/5
                  border border-solid border-stone-700 rounded-2xl
                    " />
            </section>
          </div>
          <div className="flex justify-center">
            <MovieCard date={date} age={age} />
          </div>
        </section>
      </div>
    </div>
  );
}
