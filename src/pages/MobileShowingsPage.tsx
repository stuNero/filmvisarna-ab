import { Link } from "react-router-dom";
import { useState } from "react";
import { MoveLeft, Clock, ArrowRight } from "lucide-react";
import HomePage from "./HomePage";
import type MovieShowings from "../interfaces/MovieShowings";
import type MovieDetails from "../interfaces/MovieDetails";

export default function MobileShowingsPage(props: any) {
  const details: MovieDetails = props.details;
  const actors = props.actors;
  const showingsPerDate: { date: string, showings: MovieShowings[]; }[] = props.showingsPerDate;
  const reviews = props.reviews;

  const [switchSections, setSwitchSections] = useState(true);
  const [showTrailer, setShowTrailer] = useState(false);

  const [reviewIndex, setReviewIndex] = useState(0);
  const reviewCount = reviews?.length ?? 0;
  const activeReview = reviewCount > 0 ? reviews?.[reviewIndex] : null;
  const goToNextReview = () => {
    if (!reviewCount) return;
    setReviewIndex((prev) => (prev + 1) % reviewCount);
  };
  return (
    <>
      <div className="mt-20 flex flex-row">
        <Link
          className="flex row items-center w-130"
          to={HomePage.route.path}
        >
          <MoveLeft className="mx-2" />
          Tillbaka till filmer
        </Link>
        <h1 className="flex items-center content-center bg-stone-800 pl-5 scale-120 w-full rounded-l-2xl h-10 mask-r-from-20">
          {details.title}
        </h1>
      </div>
      <div className="md:hidden flex flex-row mt-5 mb-0 w-screen">
        <button
          onClick={() => setSwitchSections(true)}
          className={
            switchSections
              ? `rounded-tl-2xl border border-l-0 border-solid border-stone-600
                h-10 w-[50%] mb-0
                bg-black border-b-0 font-extrabold`
              : `rounded-tl-2xl border border-l-0 border-solid border-stone-600
                h-10 w-[50%] mb-0
                bg-black`
          }
        >
          Detaljer
        </button>
        <button
          onClick={() => setSwitchSections(false)}
          className={
            switchSections
              ? `rounded-tr-2xl border border-r-0 border-solid border-stone-600
                h-10 w-[50%] mb-0
                bg-black`
              : `rounded-tr-2xl border border-r-0 border-solid border-stone-600
            h-10 w-[50%] mb-0 font-extrabold
            bg-stone-950 border-b-0`
          }
        >
          Visningar
        </button>
      </div>
      {switchSections ? (
        <section>
          <div className="flex flex-col justify-center px-4 bg-[url('/cinema.webp')] bg-no-repeat bg-center ">
            <div
              className={`flex flex-col max-w-7xl mx-auto px-1`}
            >
              <img
                src={details?.coverImage}
                alt={details?.title}
                className="w-full max-w-sm aspect-2/3 h-auto p-5 rounded-3xl object-contain"
              />
              <div>
                <div className="flex flex-col pb-5 pt-5 w-full">
                  <div className="w-full block">
                    <h1 className="text-3xl font-extrabold w-full mb-4">
                      {details?.title}
                    </h1>
                  </div>
                  <div className="w-full block">
                    <div className="flex flex-row flex-wrap gap-4 w-full mb-2">
                      <span className="px-3 py-1 border border-gray-600 rounded text-white">
                        {details?.ageRating} år
                      </span>
                      <h3 className="text-xl py-1">
                        {details?.productionYear}
                      </h3>
                      <div className="flex items-center gap-2">
                        <Clock size={16} className="-mb-0.5" />
                        <h3 className="text-lg ">
                          {details?.length} min
                        </h3>
                      </div>

                      <span className="px-3 py-1 bg-white/5 rounded">
                        {details?.genre}
                      </span>
                      <button
                        className="flex w-full h-20 border-4 border-red-800 justify-center items-center gap-2 bg-red-900 text-white rounded transition-colors"
                        onClick={() => setShowTrailer(true)}
                      >
                        <h1 className="text-3xl font-semibold">Se trailer</h1>
                      </button>
                    </div>
                  </div>
                </div>
                <div className="mb-6 text-base font-medium">
                  <h3 className="text-sm text-gray-400 mb-1">Regissör</h3>
                  <h5>{details.director}</h5>
                </div>
                <div>
                  <h3 className="text-sm text-gray-400 mb-1">
                    Skådespelare
                  </h3>
                  <div className="flex flex-row gap-5 h-12.5 text-base font-medium">
                    {actors?.map((a: { name: string; }, index: number) => (
                      <h5 key={index}>{a.name}</h5>
                    ))}
                  </div>
                </div>
                <div className="mb-6">
                  <h3 className="text-sm text-gray-400 mb-1">
                    Sammanfattning
                  </h3>
                  <p className="text-base font-bold">
                    {details?.filmDescription}
                  </p>
                </div>
              </div>
            </div>

            {/* R E V I E W   S E C T I O N */}
            <div className="mb-6 max-w-7xl flex px-1 items-center ">
              <div className="min-h-24 max-w-7xl  items-center justify-center">
                <h3 className="text-sm text-gray-400 mb-1 relative">
                  Recensioner
                </h3>
                <div className="h-60">
                  {activeReview ? (
                    <div className="w-65 p-1">
                      <h4 className="text-lg font-bold italic">
                        {activeReview.source}
                      </h4>
                      <p className="text-md italic w-60">
                        {activeReview.quote}
                      </p>
                      <p className="text-xs text-gray-400 mt-2">
                        {reviewIndex + 1} / {reviewCount}
                      </p>
                    </div>
                  ) : (
                    <p className="text-gray-300">
                      Inga recensioner tillgängliga.
                    </p>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={goToNextReview}
                className="flex p-5 rounded border justify-end border-stone-600 "
              >
                <ArrowRight size={20} />
              </button>
            </div>
          </div>
        </section>
      ) : (
        <section
          className={`flex flex-col 
              bg-stone-950
              pt-2.5 pb-2.5 rounded-lg mb-16 px-2 sm:px-4 max-w-7xl mx-auto`}
        >
          <div className="flex justify-center pt-5 pb-5">
            <h2 className="text-2xl font-bold">Välj en visning</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-6 justify-center items-center ">
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
                    {new Date(date).getDate()}/
                    {new Date(date).getMonth() + 1}
                  </h3>
                </div>
                <div className="flex justify-center">
                  <hr className="text-stone-700 w-4/5 " />
                </div>
                {showings.map(({ showingId, time, name }: any) => (
                  <div key={showingId} className="flex flex-col gap-2 p-5">
                    <Link
                      to={`/boka/${showingId}`}
                      className="bg-stone-950 border rounded-xl border-stone-600 pt-3 pb-3 transition-ease-in-out duration-300"
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
      )}

      {/* T R A I L E R   S E C T I O N */}
      {showTrailer && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-xs "
          onClick={() => setShowTrailer(false)}
        >
          <div className="flex flex-col justify-center items-center text-white px-4 py-3 rounded-lg ">
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
}