import type MovieDetails from "../interfaces/MovieDetails";
import type MovieShowings from "../interfaces/MovieShowings";
import { Link } from "react-router-dom";
import useFetchJson from "../utils/useFetchJson";
import { Clock } from 'lucide-react';

export default function MovieCard() {

  const [movieCard] = useFetchJson<MovieDetails[] | null>('/api/comingFilms');
  const [showingsTemp] = useFetchJson<MovieShowings[] | null>(`/api/movieShowings`);

  function getShowingsByMovie(title: string) {
    const showings = showingsTemp?.filter((s) => s.title === title);
    const now = new Date(Date.now()).toLocaleDateString('sv-SE');
    let dayShowings = showings?.filter((s) => s.timeSlot.toString().slice(0, 10) === now);
    return dayShowings;
  }

  function FormatLength(length: number) {
    let inHours = Math.floor(length / 60);
    let inMinutes = length % 60;
    const movieLength = `${inHours}t ${inMinutes}m`;
    return movieLength;
  };
  return (
    <div className="grid gap-8 p-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">


      {movieCard?.map((film) => (
        <div key={film.id}
        >
          <Link to={`/moviedetailshowings/${film.id}`}>
            <section className="w-3xs h-min  rounded-lg 
                     overflow-hidden
                     ">
              <img
                src={film.coverImage}
                alt={film.title}
                className=" object-cover w-full h-100
                duration-300 hover:scale-110 "
              />
            </section>

            <section>
              <h3 className="font-medium text-2xl">
                {film.title}
              </h3>
              <section className="flex flex-col font-medium mt-2 mb-5 text-stone-300">
                <div className="flex flex-row">
                  <p className="opacity-70 border border-stone-300 rounded-md mr-1 px-1">{film.ageRating} år</p>
                  <p className="flex flex-row opacity-70"> <Clock className="scale-70" />{FormatLength(film.length)}</p>
                </div>
                <p className="opacity-50 text-sm pb-5">{film.genre}</p>
                <div>
                  <p className="text-sm opacity-70">Dagens visningar:</p>
                  <div>
                    {getShowingsByMovie(film.title)?.map((showing) => (
                      <div key={showing.showingId}>{showing.timeSlot.toString().slice(11, 16)}</div>
                    ))}
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