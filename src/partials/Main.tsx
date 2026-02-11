import { Outlet } from 'react-router-dom';

export default function Main() {
  return <main className='h-[100vh]'>
    <div>
      <Outlet />
    </div>
  </main>;
}