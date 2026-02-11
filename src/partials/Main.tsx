import { Outlet } from 'react-router-dom';

export default function Main() {
  return <main className='h-[100vh] flex flex-row justify-center container max-w-7xl mx-auto'>
    <div>
      <Outlet />
    </div>
  </main>;
}