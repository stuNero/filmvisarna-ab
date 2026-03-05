import { Outlet } from 'react-router-dom';

export default function Main() {
  return (
    <main
      className="min-h-screen lg:px-8 
                    container 
                    mx-auto 
                    my-auto
                    justify-center
                    pt-20
                    "
    >
      <Outlet />
    </main>
  );
}
