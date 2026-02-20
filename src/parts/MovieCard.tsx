import type MovieDetails from "../interfaces/MovieDetails";
import { Link } from "react-router-dom";
import useFetchJson from "../utils/useFetchJson";
import { Clock } from 'lucide-react';

export default function MovieCard() {

  const [movieCard] = useFetchJson<MovieDetails[] | null>('/api/films');



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
                     hover:scale-110
                     ">
              <img
                src={film.coverImage}
                alt={film.title}
                className="p-5 rounded-3xl object-cover w-full h-100 "
              />
            </section>

            <section>
              <h3 className="font-medium text-2xl">
                {film.title}
              </h3>
              <section className="flex flex-col font-medium mt-2 mb-5 text-stone-300">
                <div className="flex flex-row">
                  <div className="border border-white rounded-md mr-1 px-1">{film.ageRating} år</div>
                  <div className="flex flex-row"> <Clock className="scale-70" />{FormatLength(film.length)}</div>
                </div>
                <div className="opacity-50 text-sm">{film.genre}</div>
              </section>
            </section>
          </Link>
        </div>
      ))}
    </div>
  );
}