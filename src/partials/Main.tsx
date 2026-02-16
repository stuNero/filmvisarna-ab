import { Outlet } from 'react-router-dom';

export default function Main() {
  return (
    <main
      className="min-h-screen px-4 sm:px-6 lg:px-8 py-8 container mx-auto max-w-7xl"
    >
      <Outlet />
    </main>
  );
}