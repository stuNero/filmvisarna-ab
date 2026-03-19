import type MovieDetails from '../interfaces/MovieDetails';
import type MovieShowings from '../interfaces/MovieShowings';
import { Link } from 'react-router-dom';
import useFetchJson from '../utils/useFetchJson';
import { Clock } from 'lucide-react';

export default function MovieCard(props: any) {

  let selectedDate = props.date;
  let selectedAge = props.age;
  if (props.age == "") {
    selectedAge = 100;
  }
  const dateNow = new Date(Date.now()).toLocaleDateString('sv-SE');
  const timeNow = new Date(Date.now()).toLocaleTimeString('sv-SE');
  const movieCard: MovieDetails[] = [];

  const [movieCardRaw] = useFetchJson<MovieDetails[] | null>(`${selectedDate === "" ? "/api/comingSoon" : "/api/films"}`);
  const [showingsTemp] = useFetchJson<MovieShowings[] | null>(`/api/movieShowings${selectedDate === "" ? "" : `?WHERE=date=${selectedDate}`}`);

  // needs to be refactored
  if (movieCardRaw != null && showingsTemp != null) {
    for (let movie of movieCardRaw) {
      for (let showing of showingsTemp) {
        if (movie.id == showing.id) {
          if (movieCard != null && !movieCard.includes(movie))
            movieCard.push(movie);
        }
      }
    }
  }

  function GetShowings(filmID: number) {

    const showingsSelectedDate = showingsTemp
      ?.filter((s) => s.id === filmID)
      ?.filter(
        (s) => s.time.toString() >= timeNow && s.date.toString().slice(0, 10) == (selectedDate === "" ? dateNow : selectedDate)
      )
      // And then sorted the times so the earliest would be first and the latest last.
      // In order to do so it was necessary to convert the 'time' propery from number to string,
      // slice it to take away the seconds and remove the ':', and then convert to number again to
      // be able to sort the values.
      .sort(
        (a, b) =>
          Number(a.time.toString().slice(0, 5).replace(':', '')) -
          Number(b.time.toString().slice(0, 5).replace(':', ''))
      );
    return showingsSelectedDate;
  };

  function FormatLength(length: number) {
    let inHours = Math.floor(length / 60);
    let inMinutes = length % 60;
    const movieLength = `${inHours}t ${inMinutes}m`;
    return movieLength;
  }

  return (
    <div
      className="grid gap-8 
                grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 
                w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 
                justify-items-center"
    >
      {(selectedDate === "" ? movieCardRaw : movieCard)
        ?.filter((m) => m.ageRating <= selectedAge)
        .map((film) => (
          <div key={film.id} className="w-full h-full">
            <Link to={`/visningar/${film.id}`}>
              <section
                className="rounded-lg 
                  overflow-hidden
                  relative
                  w-full
                  aspect-2/3                    
              "
              >
                <img
                  src={film.coverImage}
                  alt={film.title}
                  className="absolut inset-0 h-full object-cover w-full
          duration-300 hover:scale-110 "
                />
              </section>

              <section>
                <h3 className="font-medium text-2xl">{film.title}</h3>
                <section className="flex flex-col font-medium mt-2 mb-5 text-stone-300">
                  <div className="flex flex-row ">
                    <p className="opacity-70 border border-stone-300 rounded-md mr-1 px-1">
                      {film.ageRating === 1 ? 'Barntillåten' : `${film.ageRating} år`}
                    </p>
                    <p className="flex flex-row opacity-70">
                      {' '}
                      <Clock className="scale-70" />
                      {FormatLength(film.length)}
                    </p>
                  </div>
                  <p className="opacity-50 text-sm pb-5">{film.genre}</p>
                  <div>
                    <p className="text-sm opacity-70">Dagens visningar:</p>
                    <div className="flex flex-row text-sm gap-2">
                      {GetShowings(film.id)?.length === 0 ? (
                        <div className="border rounded border-black bg-white/5 px-3 py-1.5">
                          Inga visningar idag
                        </div>
                      )
                        :
                        (
                          GetShowings(film.id)?.map((showing) => (
                            <div
                              className="border rounded border-black bg-white/5 px-3 py-1.5"
                              key={showing.showingId}
                            >
                              {/* add 'slice' the remove the seconds */}
                              {showing.time.toString().slice(0, 5)}
                            </div>
                          ))
                        )}
                    </div>
                  </div>
                </section>
              </section>
            </Link>
          </div>
        ))}
    </div>
  );
}
