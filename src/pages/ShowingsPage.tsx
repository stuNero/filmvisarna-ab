import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import useFetchJson from "../utils/useFetchJson";
import NotFoundPage from "./NotFoundPage";
import type MovieDetails from "../interfaces/MovieDetails";
import type MovieShowings from "../interfaces/MovieShowings";
import MobileShowingsPage from "./MobileShowingsPage";
import DesktopShowingsPage from "./DesktopShowingsPage";

ShowingsPage.route = {
  path: "/visningar/:id",
};

export default function ShowingsPage() {
  const { id } = useParams<{ id: string; }>();
  const movieId = Number(id);

  const [viewing, setViewing] = useState("");

  useEffect(() => {
    function actOnResizing() {
      if (window.innerWidth < 400) {
        setViewing("mobile");
      } else {
        setViewing("desktop");
      }
    }
    // when the components mounts act on current size once
    actOnResizing();
    // add event listeners
    window.addEventListener('resize', actOnResizing);
    window.addEventListener('orientationchange', actOnResizing);
    // return a clean up function that runs when the component unmounts
    return () => {
      // remove the event listeners
      window.removeEventListener('resize', actOnResizing);
      window.removeEventListener('orientationchange', actOnResizing);
    };
  }, []);

  const [details] = useFetchJson<MovieDetails | null>(
    `/api/comingFilms/${movieId}`,
  );
  const [actors] = useFetchJson<{ name: string; }[]>(
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
    if (viewing == "mobile") {
      return (
        <MobileShowingsPage
          details={details}
          actors={actors}
          showingsPerDate={showingsPerDate}
          reviews={reviews}
        />
      );
    } else if (viewing == "desktop") {
      return (
        <DesktopShowingsPage
          details={details}
          actors={actors}
          showingsPerDate={showingsPerDate}
          reviews={reviews}
        />
      );
    }
  } else {
    return <NotFoundPage />;
  }
}
