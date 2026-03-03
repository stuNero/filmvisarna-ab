import { useParams } from "react-router-dom";
import useFetchJson from "../utils/useFetchJson";
import type MovieDetails from "../interfaces/MovieDetails";
import NotFoundPage from "./NotFoundPage";
import type MovieShowings from "../interfaces/MovieShowings";
import { Link } from "react-router-dom";

MovieDetailShowingsPage.route = {
  path: '/moviedetailshowings/:id',
  menuLabel: 'Movie Details And Showings',
  index: 2
};


export default function MovieDetailShowingsPage() {

  const { id } = useParams<{ id: string; }>();
  const movieId = Number(id);

  const [details] = useFetchJson<MovieDetails | null>(`/api/comingFilms/${movieId}`);
  const [actors] = useFetchJson<{ name: string; }[]>(`/api/movieActors?WHERE=id=${movieId}`);

  const today = new Date(Date.now()).toLocaleDateString('sv-SE');
  const now = new Date(Date.now()).toLocaleTimeString('sv-SE');

  const [showingsRaw] = useFetchJson<MovieShowings[] | null>(`/api/movieShowings/?WHERE=id=${movieId}&ORDERBY=date,time`);
  const showingsPerDate = [...new Set(showingsRaw?.map((x) => x.date)
    .filter((x) => x.toString() >= today.toString()))]
    .map((x) => ({ date: x, showings: [] as any }));
  for (let showing of showingsPerDate) {
    // Only adds showings that are after the current time
    if (showing.date.toString().slice(0, 10) == today) {
      showing.showings = showingsRaw?.filter((x) => x.date === showing.date && x.time.toString() >= now);
    }
    // Adds showing if date is correct
    else {
      showing.showings = showingsRaw?.filter((x) => x.date === showing.date);
    }
  }
  // Removes dates that has no showings
  for (let showing of showingsPerDate) {
    if (showing.showings.length == 0) {
      let idx = showingsPerDate.indexOf(showing);
      showingsPerDate.splice(idx, 1);
    }
  }

  if (details?.id === movieId) {
    return <>
      <section>
        <div className="min-h-screen flex flex-col justify-center px-4 bg-[url('/cinema.webp')] bg-no-repeat bg-center ">
          <div className="flex flex-col md:flex-row md:items-start">
            <img src={details?.coverImage} alt={details?.title} className="w-full md:max-w-sm max-h-137.5 p-5 rounded-3xl object-cover" />
            <div className="md:ml-8 backdrop-blur-xs">
              <div className="flex flex-col lg:gap-10 md:gap-2 pb-5 pt-5 mb-6 w-full">
                <div className="w-full block">
                  <h1 className="text-3xl md:text-5xl font-extrabold w-full mb-4">{details?.title}</h1>
                </div>
                <div className="w-full block">
                  <div className="flex flex-row flex-wrap gap-4 w-full mb-2">
                    <span className="px-3 py-1 border border-gray-600 rounded text-white">
                    {details?.ageRating} år
                    </span>
                    <h3 className="text-xl md:text-2xl font-extrabold">{details?.productionYear}</h3>
                    <h3 className="text-xl md:text-2xl font-extrabold">{details?.length} minuter</h3>
                    <span className="px-3 py-1 bg-white/5 rounded">
                    {details?.genre}
                    </span>
                    <button
                   className="flex items-center gap-2 px-4 py-1.5 bg-red-800 text-white rounded transition-colors"
                    >
                    <p className="font-medium">Se trailer</p>
                    </button>
                  </div>
                </div>
              </div>
              <div className="flex flex-row gap-5 h-12.5 text-base md:text-xl font-medium">
                {actors?.map((a, index) => (
                  <h5 key={index}>{a.name}</h5>
                ))}
              </div>
              <div>
                <h3 className="text-sm text-gray-400 mb-1">
                  Sammanfattning
                </h3>
                <p className="text-base md:text-xl font-bold">{details?.filmDescription}</p>
              </div>
            </div>
          </div>
        </div>
      </section>


      <section className="flex flex-col 
              bg-stone-950 border border-white
              pt-2.5 pb-2.5 rounded-lg mb-16">
        <div className="flex justify-center pt-5 pb-5">
          <h2 className="text-2xl font-bold">Välj en visning</h2>
        </div>
        <div className="flex flex-col md:flex-row gap-6 p-5 justify-center items-center">
          {/* Renders Date */}
          {showingsPerDate?.map(({ date, showings }) => (
            <article key={date} className="border rounded-xl border-stone-500 p-4 w-60 bg-black text-center">
              <div className="flex flex-col w-full justify-center items-center pb-2 pt-2 text-center">
                <h2 className="font-medium">{new Date(date).toLocaleDateString('sv-SE', { weekday: 'long' })}</h2>
                <h3 className="font-extralight text-stone-500">
                  {new Date(date).getDate()}/{(new Date(date).getMonth() + 1)}
                </h3>
              </div>
              <div className="flex justify-center">
                <hr className="text-stone-700 w-4/5 " />
              </div>
              {/* Renders Showing */}
              {showings.map(({ showingId, time, name }: any) => (
                <div key={showingId} className="flex flex-col gap-2 p-5 text-center">
                  <Link to={`/seatselection/${showingId}`} className="bg-stone-950 border rounded-xl border-stone-600 pt-3 pb-3 hover:bg-stone-800 transition-ease-in-out duration-300">

                    <p>{time.toString().slice(0, 5)}</p>
                    <p>{name}</p>

                  </Link>
                </div>
              ))}
            </article>
          ))}
        </div>
      </section >

    </>;
  }
  else {
    return <NotFoundPage />;
  };
}