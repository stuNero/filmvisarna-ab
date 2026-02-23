import type MovieDetails from "../interfaces/MovieDetails";
import type MovieShowings from "../interfaces/MovieShowings";
import { Link } from "react-router-dom";
import useFetchJson from "../utils/useFetchJson";
import { Clock } from 'lucide-react';

export default function MovieCard() {

  const [movieCard] = useFetchJson<MovieDetails[] | null>('/api/comingFilms');
  const [movieShowings] = useFetchJson<MovieShowings[] | null>('/api/movieShowings');

  console.log(movieShowings);
  function ExtractMovieTimes(movieShowings: MovieShowings) {

  };


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
                  <p className="border border-white rounded-md mr-1 px-1">{film.ageRating} år</p>
                  <p className="flex flex-row"> <Clock className="scale-70" />{FormatLength(film.length)}</p>
                </div>
                <p className="opacity-50 text-sm">{film.genre}</p>
              </section>
            </section>
          </Link>
        </div>
      ))}
    </div>
  );
}