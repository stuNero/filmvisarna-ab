import { useParams } from "react-router-dom";
import useFetchJson from "../utils/useFetchJson";
import type { MovieDetails } from "../interfaces/MovieDetails";

MovieDetailShowingsPage.route = {
  path: '/moviedetailshowings/:id',
  menuLabel: 'Movie Details And Showings',
  index: 2
};

export default function MovieDetailShowingsPage() {

  const { id } = useParams<{ id: string; }>();
  const movieId = Number(id);

  const [details] = useFetchJson<MovieDetails | null>(`/api/films/${movieId}`);

  return <>
    <div className="min-h-screen flex flex-col justify-center px-4">
      <div className="flex flex-col md:flex-row md:items-start">
        <img src={details?.coverImage} alt={details?.title} className="w-full md:max-w-sm h-auto p-5 rounded-3xl object-cover" />
        <div className="md:ml-8">
          <div className="flex flex-col lg:gap-10 md:flex-row md:items-center md:gap-2 pb-5 pt-5 mb-6 ">
            <h1 className="text-3xl md:text-5xl font-extrabold">{details?.title}</h1>
            <h3 className="text-xl md:text-3xl font-extrabold">{details?.productionYear}</h3>
            <h3 className="text-xl md:text-3xl font-extrabold">{details?.length} minuter</h3>
            <h3 className="text-lg md:text-xl font-extrabold">{details?.genre} </h3>
          </div>
          <div>
            <p className="text-base md:text-xl font-bold">{details?.filmDescription}</p>
          </div>
        </div>
      </div>
    </div>
  </>;
}