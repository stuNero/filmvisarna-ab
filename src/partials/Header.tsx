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

  return <header className='w-full bg-opacity-20 backdrop-blur-lg border-b-2 border-solid border-stone-800 fixed '>
    <div className='max-w-7xl mx-auto flex flex-row justify-between'>
      <Link to="/" className='hover:text-red-800 transition-colors duration-400 flex flex-row w-fit my-[10px]'>
        < img src="/logo-cinesharp.webp" width="40px" height="auto" ></img >
        <h1 className='font-bold content-center pl-[10px] '>
          CineSharp
        </h1>
      </Link >
      <Link to="/LoginPage" className='hover:text-red-800 transition-colors duration-400 my-[10px] w-[30px] h-auto'>
        <User className='my-[10px] w-[30px] h-auto' />
      </Link>
    </div>
  </header >;
}