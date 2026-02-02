import { Outlet } from 'react-router-dom';

export default function Main() {
  return <main>
    <div>
      <Outlet />
    </div>
  </main>;
}