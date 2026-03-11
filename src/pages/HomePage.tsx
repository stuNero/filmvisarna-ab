import MovieCard from '../parts/MovieCard.tsx';
import { useState, useEffect, useMemo } from 'react';
import useFetchJson from '../utils/useFetchJson.ts';

HomePage.route = {
  path: '/'
};

export default function HomePage() {
  const [date, setDate] = useState(new Date().toLocaleDateString('sv-SE'));

  const agesRaw = useFetchJson<{ ageRating: number; }[]>('/api/ageRatings');
  const ages = useMemo(() => {
    return agesRaw[0]?.sort((a, b) => b.ageRating - a.ageRating).map((age) => age.ageRating);
  }, [agesRaw]);

  // agesRaw[0]?.sort((a, b) => b.ageRating - a.ageRating).map((age) => age.ageRating);

  const [age, setAge] = useState(ages?.[0]);

  useEffect(() => {
    if (ages?.length && age === undefined) {
      setAge(ages[0]);
    }
  }, [ages]);

  const openDatePicker = () => {
    let dateInput = document.querySelector('.date-field');
    (dateInput as any).showPicker();
  };

  return (
    <div className="container mx-auto">
      <div className="flex flex-col  ">
        <section className="inline-block relative">
          <section
            className="
                        bg-[url('/bg-image.webp')] bg-center
                        bg-cover                       
                        h-[75vh]
                        fit-content
                        "
          >
            <div
              className="absolute inset-0 
                          bg-linear-to-t
                        from-black from-20% via-black/50 via-70% to-transparent to-99%
                        fit-content"
            ></div>

            <div
              className="absolute container 
              px-4 mx-auto mt-10 
              text-shadow-lg
              pt-20
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
          <div id="filters" className='flex justify-around md:justify-end'>
            <select
              className='
              p-1 mb-5
              bg-gray-900
              border border-solid border-stone-700 rounded-2xl'
              value={age}
              onChange={(event: any) => setAge(Number(event.target.value))}
              name="ageRating"
              id="ageRating">
              {ages?.map((age) => (
                <option key={age} value={age}>{age}</option>
              ))}
            </select>
            {/* TODO: input type="date" follows os/browser locale/lang - use date picker lib to force swedish format?*/}
            <div className='inline-block relative ml-5'>
              <input
                placeholder='Filtrera på datum'
                type="date"
                min={new Date(Date.now()).toLocaleDateString("sv-SE")}
                value={date}
                onChange={event => setDate(event.target.value)}
                className="date-field
              p-1 mb-5
              bg-gray-900
              border border-solid border-stone-700 rounded-2xl
            " />
              <div className="date-format-fixer rounded" onClick={openDatePicker}>{date}</div>
            </div>
          </div>
          <div className="flex justify-center">
            <MovieCard date={date} age={age} />
          </div>
        </section>
      </div>
    </div>
  );
}
