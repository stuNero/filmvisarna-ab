import type MovieDetails from "../interfaces/MovieDetails";
import { Link } from "react-router-dom";
import useFetchJson from "../utils/useFetchJson";


export default function MovieCard() {

  const [movieCard] = useFetchJson<MovieDetails[] | null>('/api/comingFilms');


  return (
    <div className="grid gap-8 p-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">

      {movieCard?.map((film) => (
        <div key={film.id}
          className="w-3xs h-min m-5 rounded-lg 
                     hover:inset-shadow-[0_0_20px] 
                     hover:inset-shadow-red-800/50 
                     hover:shadow-[0_0_50px] 
                     hover:shadow-red-800/70
                     hover:scale-110"
        >
          <Link to={`/moviedetailshowings/${film.id}`}>
            <img
              src={film.coverImage}
              alt={film.title}
              className="p-5 rounded-3xl object-cover w-full h-100"
            />
            <h3 className="font-mono font-medium text-3xl text-center">
              {film.title}
            </h3>
            <p className="font-mono font-medium text-2xl text-center mt-2 mb-5">
              {film.productionYear}
            </p>
          </Link>
        </div>
      ))}
    </div>
  );
}