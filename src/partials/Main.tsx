import { Outlet } from 'react-router-dom';

export default function Main() {
  return (
    <main className="min-h-screen lg:px-8 
                    container 
                    mx-auto max-w-7xl
                    justify-center
                    content-center">
      <Outlet />
    </main>
  );
}