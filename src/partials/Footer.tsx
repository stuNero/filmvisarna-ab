import { Link } from "react-router-dom";

import LocaleDetailsPage from "../pages/LocaleDetailsPage";
import KioskInfoPage from "../pages/KioskPage";
import CancelBookingPage from "../pages/CancelBookingPage";

export default function Footer() {
  return (
    <footer
      className="
                bg-black border-t-2 border-solid border-stone-600 rounded
                "
    >
      <div
        className="max-w-7xl 
                   mx-auto px-2 sm:px-12 lg:px-4  
                   md:flex flex-row justify-between items-center
                   pb-10"
      >
        <article className="flex flex-col mt-[25px] px-[50px]">
          <Link
            to="/"
            className="bg-green-400 flex flex-row hover-red mb-[10px] w-fit"
          >
            <img src="/logo-cinesharp.webp" width="50px" height="auto"></img>
            <h1 className=" font-bold content-center pl-[10px]  ">CineSharp</h1>
          </Link>
          <p className="opacity-50">
            Din ultimata destination för de senaste filmerna och oförglömliga
            bioupplevelser.
          </p>
        </article>
        <article className="flex flex-col mt-[25px] px-[50px]">
          <h1 className="text-lg">Snabblänkar:</h1>
          <Link
            to={LocaleDetailsPage.route.path}
            className="opacity-50 hover:opacity-100 hover-red"
          >
            {LocaleDetailsPage.route.menuLabel}
          </Link>
          <Link
            to={KioskInfoPage.route.path}
            className="opacity-50 hover:opacity-100 hover-red"
          >
            {KioskInfoPage.route.menuLabel}
          </Link>
        </article>
        <article className="flex flex-col mt-[1px] px-[50px]">
          <h1 className="text-lg">Support:</h1>
          <Link
            to={CancelBookingPage.route.path}
            className="opacity-50 hover:opacity-100 hover-red"
          >
            {CancelBookingPage.route.menuLabel}
          </Link>
        </article>
      </div>
    </footer>
  );
}
