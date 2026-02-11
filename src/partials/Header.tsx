import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import routes from '../routes';

export default function Header() {
  const [expanded, setExpanded] = useState(false);

  const pathName = useLocation().pathname;
  const currentRoute = routes
    .slice().sort((a, b) => a.path.length > b.path.length ? -1 : 1)
    .find(x => pathName.indexOf(x.path.split(':')[0]) === 0);

  const isActive = (path: string) =>
    path === currentRoute?.path || path === currentRoute?.parent;

  return <header className='w-full bg-opacity-20 backdrop-blur-lg border-b-2 border-solid border-white fixed'>
    <Link to="/" className='flex flex-row w-fit'>
      < img src="/logo-cinesharp.webp" width="50px" height="auto" ></img >
      <h1 className='font-bold content-center pl-[10px] '>
        CineSharp
      </h1>
    </Link >
  </header >;
}