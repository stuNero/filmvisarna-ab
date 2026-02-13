import { Outlet } from 'react-router-dom';

export default function Main() {
  return <main className='h-[100vh] flex flex-col justify-center content-center container max-w-7xl mx-auto'>
    <Outlet />
  </main>;
}