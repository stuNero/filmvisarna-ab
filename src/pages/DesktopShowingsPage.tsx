import { Link } from "react-router-dom";
import { useState } from "react";
import HomePage from "./HomePage";
import { MoveLeft, Clock, ArrowLeft, ArrowRight, Star, StarHalf } from "lucide-react";
import type MovieDetails from "../interfaces/MovieDetails";
import type MovieShowings from "../interfaces/MovieShowings";

export default function DesktopShowingsPage(props: any) {
  const details: MovieDetails = props.details;
  const actors = props.actors;
  const showingsPerDate: { date: string; showings: MovieShowings[] }[] =
    props.showingsPerDate;
  const reviews = props.reviews;

  

  const [date, setDate] = useState("");

  const [showTrailer, setShowTrailer] = useState(false);

  const [reviewIndex, setReviewIndex] = useState(0);
  const reviewCount = reviews?.length ?? 0;
  const activeReview = reviewCount > 0 ? reviews?.[reviewIndex] : null;

  const starsAmount = activeReview?.stars ? parseFloat(activeReview.stars) : null;
  function FilterDates() {
    let newArray: { date: string; showings: MovieShowings[] }[] = [];
    if (date != "") {
      newArray = showingsPerDate.filter(
        (showingDate) => showingDate.date.split("T")[0] == date,
      );
    } else {
      newArray = showingsPerDate;
    }
    return newArray;
  }

  const goToNextReview = () => {
    if (!reviewCount) return;
    setReviewIndex((prev) => (prev + 1) % reviewCount);
  };
  const goToPrevReview = () => {
    if (!reviewCount) return;
    setReviewIndex((prev) => (prev - 1 + reviewCount) % reviewCount);
  };

  return (
    <>
      <section>
        <div className="md:mt-10 flex flex-col justify-center items-center px-4 bg-[url('/cinema.webp')] bg-no-repeat bg-center ">
          <div className="mt-20 flex flex-row justify-between">
            <Link
              className="flex row items-center w-170"
              to={HomePage.route.path}
            >
              <MoveLeft className="mx-5" />
              Tillbaka till filmer
            </Link>
            <h1 className="flex items-center bg-stone-800  p-5 ml-10 scale-120 w-70 rounded-l-2xl h-10 mask-r-from-50">
              {details?.title}
            </h1>
          </div>
          <div
            className={`flex flex-col md:flex-row md:items-start max-w-7xl mx-auto px-8 sm:px-12 lg:px-16`}
          >
            <img
              src={details?.coverImage}
              alt={details?.title}
              className="w-full max-w-sm md:max-w-sm aspect-2/3 h-auto md:max-h-137.5 p-5 rounded-3xl object-contain md:object-cover"
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
                    <h3 className="text-xl md:text-lg py-1">
                      {details?.productionYear}
                    </h3>
                    <div className="flex items-center gap-2">
                      <Clock size={16} className="-mb-0.5" />
                      <h3 className="text-lg md:text-lg ">
                        {details?.length} min
                      </h3>
                    </div>

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
                <h5>{details?.director}</h5>
              </div>
              <div className="grid grid-cols-3 gap-4 mb-6 text-base md:text-xl font-medium">
                <div>
                  <h3 className="text-sm text-gray-400 mb-1">Distributör</h3>
                  <h5>{details?.distributor}</h5>
                </div>
                <div>
                  <h3 className="text-sm text-gray-400 mb-1">Ljud</h3>
                  <h5>{details?.audio}</h5>
                </div>
                <div>
                  <h3 className="text-sm text-gray-400 mb-1">Undertexter</h3>
                  <h5>{details?.subtitles}</h5>
                </div>
              </div>

              <div className="mb-6 md:mb-4">
                <h3 className="text-sm text-gray-400 mb-1">Skådespelare</h3>
                <div className="flex flex-row gap-5 h-12.5 text-base md:text-xl font-medium">
                  {actors?.map((a: { name: string }, index: number) => (
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

          {/* REVIEW   S E C T I O N */}
          <div>
          <div className="mb-6 md:mb-4 max-w-7xl px:4 lg:px-10 md:px-14 flex items-center ">
            <button
              type="button"
              onClick={goToPrevReview}
              className="p-2 rounded border border-stone-600 hover:bg-stone-900 "
            >
              <ArrowLeft className="" />
            </button>

            <div className="min-h-24 max-w-7xl mt-20 px-8 sm:px-12 lg:px-16 w-200 items-center justify-center">
              <h3 className="text-sm text-gray-400 mb-1 ">Recensioner</h3>
              <div className="relative h-50 w-full overflow-hidden">
                {activeReview ? (
                  <div className="absolute ">
                    <h4 className="text-lg font-bold">{activeReview.source}</h4>
                    <p className="text-base md:text-base italic">
                      {activeReview.quote}
                    </p>
                    {starsAmount !== null ? (
                      <>
                        <p className="text-yellow-400 font-bold text-lg mt-2">
                          {starsAmount} / 5
                        </p>
                        <div className="flex flex-row items-center mt-1">
                          {Array.from({ length: 5 }).map((_, i) => {
                            if (starsAmount >= i + 1) {
                              return <Star key={i} size={20} className="text-yellow-400 fill-yellow-400" />;
                            } else if (starsAmount >= i + 0.5) {
                              return <StarHalf key={i} size={20} className="text-yellow-400 fill-yellow-400" />;
                            } else {
                              return <Star key={i} size={20} className="text-gray-400" />;
                            }
                          })}
                        </div>
                      </>
                    ) : (
                      <p className="text-gray-400 font-bold text-lg mt-2">
                        Inga betyg tillgängliga
                      </p>
                    )}
                    <p className="text-xs text-gray-400 mt-2">
                      {reviewIndex + 1} / {reviewCount}
                    </p>
                  </div>
                ) : (
                  <p className="text-base text-gray-300">
                    Inga Recensioner tillgängliga.
                  </p>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={goToNextReview}
              className="p-2 rounded border border-stone-600 hover:bg-stone-900"
            >
              <ArrowRight size={20} />
            </button>
          </div>
          </div>
        </div>
      </section>
      <section
        className={`flex flex-col 
              bg-stone-950
              pt-2.5 pb-2.5 rounded-lg mb-16 px-2 sm:px-4 max-w-7xl mx-auto`}
      >
        <div className="flex justify-center items-center pt-5 pb-5 flex-col">
          <h2 className="text-2xl font-bold mb-2">Välj en visning</h2>
          <input
            type="date"
            id="datepicker"
            min={new Date(Date.now()).toLocaleDateString("sv-SE").slice(0, 10)}
            value={date}
            onChange={(event) => setDate(event.target.value)}
            onClick={(e) => (e.currentTarget as HTMLInputElement).showPicker()}
            className="
                  hover-red
                  hover:scale-105
                  px-3 py-1 h-fit w-fit
                  bg-white/5
                  border border-solid border-stone-700 rounded-2xl
                  "
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6 justify-center items-center ">
          {FilterDates()?.map(({ date, showings }) => (
            <article
              key={date}
              className="border rounded-xl border-stone-500 p-4 bg-black text-center place-self-center w-full max-w-xs mx-auto flex flex-col min-h-[300px] h-full"
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
              <div className="flex flex-col flex-1 ">
                {showings.map(({ showingId, time, name }: any) => (
                  <div key={showingId} className="flex flex-col gap-2 px-5 pt-5">
                    <Link
                      to={`/boka/${showingId}`}
                      className="bg-stone-950 border rounded-xl border-stone-600 pt-3 pb-3 hover:bg-stone-800 transition-ease-in-out duration-300"
                    >
                      <p>{time.toString().slice(0, 5)}</p>
                      <p>{name}</p>
                    </Link>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>
      {/* T R A I L E R   S E C T I O N */}
      {showTrailer && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-xs "
          onClick={() => setShowTrailer(false)}
        >
          <div className="flex flex-col md:w-148.25 md:h-100 justify-center items-center text-white px-4 py-3 rounded-lg ">
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
