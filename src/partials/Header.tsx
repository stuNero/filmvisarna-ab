import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import routes from '../routes';
import { User } from 'lucide-react';

export default function Header() {
  const [expanded, setExpanded] = useState(false);

  const pathName = useLocation().pathname;
  const currentRoute = routes
    .slice().sort((a, b) => a.path.length > b.path.length ? -1 : 1)
    .find(x => pathName.indexOf(x.path.split(':')[0]) === 0);

  const isActive = (path: string) =>
    path === currentRoute?.path || path === currentRoute?.parent;

  return (
    <header className="w-full 
                      bg-opacity-10 backdrop-blur-lg 
                      fixed">
      <div className="max-w-7xl 
                      mx-auto flex flex-row justify-between items-center
                      px-4 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="red_hover flex flex-row w-fit my-[10px]">
          <img src="/logo-cinesharp.webp" width="40px" height="auto"></img>
          <h1 className="font-bold content-center pl-[10px] ">CineSharp</h1>
        </Link>
        <Link
          to="/LoginPage"
          className="red_hover my-[10px] w-[30px] h-auto">
          <User className="my-[10px] w-[30px] h-auto" />
        </Link>
      </div>
    </header>
  );
}