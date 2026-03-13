import { useParams } from "react-router-dom";
import useFetchJson from "../utils/useFetchJson";
import { useState } from "react";
import type MovieDetails from "../interfaces/MovieDetails";
import NotFoundPage from "./NotFoundPage";
import type MovieShowings from "../interfaces/MovieShowings";
import { Link } from "react-router-dom";

MovieDetailShowingsPage.route = {
  path: "/visningar/:id",
};

export default function MovieDetailShowingsPage() {
  const { id } = useParams<{ id: string }>();
  const [showTrailer, setShowTrailer] = useState(false);
  const movieId = Number(id);

  const [details] = useFetchJson<MovieDetails | null>(
    `/api/comingFilms/${movieId}`,
  );
  const [actors] = useFetchJson<{ name: string }[]>(
    `/api/movieActors?WHERE=id=${movieId}`,
  );

  const [reviews] = useFetchJson<
    {
      source: string;
      quote: string;
      stars: string;
      filmId: number;
    }[]
  >(`/api/reviews?WHERE=filmId=${movieId}`);

  const today = new Date(Date.now()).toLocaleDateString("sv-SE");
  const now = new Date(Date.now()).toLocaleTimeString("sv-SE");

  const [showingsRaw] = useFetchJson<MovieShowings[] | null>(
    `/api/movieShowings/?WHERE=id=${movieId}&ORDERBY=date,time`,
  );
  const showingsPerDate = [
    ...new Set(
      showingsRaw
        ?.map((x) => x.date)
        .filter((x) => x.toString() >= today.toString()),
    ),
  ].map((x) => ({ date: x, showings: [] as any }));
  for (let showing of showingsPerDate) {
    // Only adds showings that are after the current time
    if (showing.date.toString().slice(0, 10) == today) {
      showing.showings = showingsRaw?.filter(
        (x) => x.date === showing.date && x.time.toString() >= now,
      );
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
    return (
      <>
        <section>
          <div className="min-h-screen flex flex-col justify-center px-4 bg-[url('/cinema.webp')] bg-no-repeat bg-center ">
            <div
              className={`flex flex-col md:flex-row md:items-start max-w-7xl mx-auto px-8 sm:px-12 lg:px-16 ${showTrailer ? "blur-[2px]" : ""}`}
            >
              <img
                src={details?.coverImage}
                alt={details?.title}
                className="w-full max-w-sm md:max-w-sm aspect-[2/3] h-auto md:max-h-[550px] p-5 rounded-3xl object-contain md:object-cover"
              />
              <div className="md:ml-8 ">
                <div className="flex flex-col lg:gap-10 md:gap-2 pb-5 pt-5 mb-6 w-full">
                  <div className="w-full block">
                    <h1 className="text-3xl md:text-5xl font-extrabold w-full mb-4">
                      {details?.title}
                    </h1>
                  </div>
                  <div className="w-full block">
                    <div className="flex flex-row flex-wrap gap-4 w-full mb-2">
                      <span className="px-3 py-1 border border-gray-600 rounded text-white">
                        {details?.ageRating} år
                      </span>
                      <h3 className="text-xl md:text-2xl font-extrabold">
                        {details?.productionYear}
                      </h3>
                      <h3 className="text-xl md:text-2xl font-extrabold">
                        {details?.length} minuter
                      </h3>
                      <span className="px-3 py-1 bg-white/5 rounded">
                        {details?.genre}
                      </span>
                      <button
                        className="flex items-center gap-2 px-4 py-1.5 bg-red-800 text-white rounded transition-colors"
                        onClick={() => setShowTrailer(true)}
                      >
                        <p className="font-medium">Se trailer</p>
                      </button>
                    </div>
                  </div>
                </div>
                <div className="mb-6  text-base md:text-xl font-medium">
                  <h3 className="text-sm text-gray-400 mb-1">Regissör</h3>
                  <h5>{details.director}</h5>
                </div>
                <div className="mb-6 md:mb-0">
                  <h3 className="text-sm text-gray-400 mb-1">Skådespelare</h3>
                  <div className="flex flex-row gap-5 h-12.5 text-base md:text-xl font-medium">
                    {actors?.map((a, index) => (
                      <h5 key={index}>{a.name}</h5>
                    ))}
                  </div>
                </div>
                <div className="mb-6 md:mb-4">
                  <h3 className="text-sm text-gray-400 mb-1">Sammanfattning</h3>
                  <p className="text-base md:text-xl font-bold">
                    {details?.filmDescription}
                  </p>
                </div>
              </div>
            </div>
            <div className="mb-6 md:mb-4 max-w-7xl mx-auto px-10">
              <h3 className="text-sm text-gray-400 mb-1">Reviews</h3>
              <h1>{reviews?.[0]?.source}</h1>
              <p className="text-base md:text-base font-bold">
                {reviews?.[0]?.quote}
              </p>
            </div>
          </div>
        </section>

        <section
          className={`flex flex-col 
              bg-stone-950
              pt-2.5 pb-2.5 rounded-lg mb-16 px-2 sm:px-4 mx-2 max-w-7xl mx-auto ${showTrailer ? "blur-[2px]" : ""}`}
        >
          <div className="flex justify-center pt-5 pb-5">
            <h2 className="text-2xl font-bold">Välj en visning</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6 justify-center items-center ">
            {/* Renders Date */}
            {showingsPerDate?.map(({ date, showings }) => (
              <article
                key={date}
                className="border rounded-xl border-stone-500 p-4 bg-black text-center place-self-center w-full max-w-xs mx-auto"
              >
                <div className="flex flex-col w-full justify-center items-center pb-2 pt-2 text-center">
                  <h2 className="font-medium">
                    {new Date(date).toLocaleDateString("sv-SE", {
                      weekday: "long",
                    })}
                  </h2>
                  <h3 className="font-extralight text-stone-300">
                    {new Date(date).getDate()}/{new Date(date).getMonth() + 1}
                  </h3>
                </div>
                <div className="flex justify-center">
                  <hr className="text-stone-700 w-4/5 " />
                </div>
                {/* Renders Showing */}
                {showings.map(({ showingId, time, name }: any) => (
                  <div key={showingId} className="flex flex-col gap-2 p-5">
                    <Link
                      to={`/boka/${showingId}`}
                      className="bg-stone-950 border rounded-xl border-stone-600 pt-3 pb-3 hover:bg-stone-800 transition-ease-in-out duration-300"
                    >
                      <p>{time.toString().slice(0, 5)}</p>
                      <p>{name}</p>
                    </Link>
                  </div>
                ))}
              </article>
            ))}
          </div>
        </section>
        {showTrailer && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center "
            onClick={() => setShowTrailer(false)}
          >
            <div className="flex flex-col md:w-[593px] md:h-[400px] justify-center items-center text-white px-4 py-3 rounded-lg ">
              <button
                className="flex items-center gap-2 px-4 py-1.5 bg-red-800 text-white rounded transition-colors self-end mb-2"
                onClick={() => setShowTrailer(false)}
              >
                <p className="font-medium">Stäng trailer</p>
              </button>
              {details?.youtube && (
                <iframe
                  src={`https://www.youtube.com/embed/${details.youtube}?autoplay=1`}
                  title={`${details.title} Trailer`}
                  className="w-full h-full border-0 mb-4 rounded-lg"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                ></iframe>
              )}
            </div>
          </div>
        )}
      </>
    );
  } else {
    return <NotFoundPage />;
  }
}
