import { Outlet } from 'react-router-dom';

export default function Main() {
  return <main className='min-h-full scroll-smooth flex flex-col justify-center content-center container max-w-7xl mx-auto'>
    <Outlet />
  </main>;
}