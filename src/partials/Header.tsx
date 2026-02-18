import { Link } from 'react-router-dom';
import { User } from 'lucide-react';

export default function Header() {

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