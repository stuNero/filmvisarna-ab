import { Link } from 'react-router-dom';

import LocaleDetailsPage from '../pages/LocaleDetailsPage';
import KioskInfoPage from '../pages/KioskPage';
import CancelBookingPage from '../pages/CancelBookingPage';

export default function Footer() {
  return <footer className="w-full 
                            flex flex-col relative
                            md:flex-row
                            mb-10
                            bg-black border-t-2 border-solid border-stone-600
                            h-[200px] container max-w-7xl mx-auto">

    <article className='flex flex-col mt-[25px] px-[50px]'>
      <h1 className='text-lg'>Snabblänkar:</h1>
      <Link to={LocaleDetailsPage.route.path} className='opacity-50 hover:opacity-100 hover:text-red-800 transition-colors duration-250'>
        {LocaleDetailsPage.route.menuLabel}</Link>
      <Link to={KioskInfoPage.route.path} className='opacity-50 hover:opacity-100 hover:text-red-800 transition-colors duration-250'>
        {KioskInfoPage.route.menuLabel}</Link>
    </article>
    <article className='flex flex-col mt-[25px] px-[50px]'>
      <h1 className='text-lg'>Support:</h1>
      <Link to={CancelBookingPage.route.path} className='opacity-50 hover:opacity-100 hover:text-red-800 transition-colors duration-250'>
        {CancelBookingPage.route.menuLabel}</Link>
    </article>
    <article className='flex flex-col mt-[25px] px-[50px]'>
      <Link to="/" className='flex flex-row hover:text-red-800 transition-colors duration-400 mb-[10px]'>
        < img src="/logo-cinesharp.webp" width="50px" height="auto" ></img >
        <h1 className='font-bold content-center pl-[10px] '>
          CineSharp
        </h1>
      </Link >
      <p className='opacity-50'>Din ultimata destination för de senaste filmerna och oförglömliga bioupplevelser.</p>
    </article>

  </footer>;
}