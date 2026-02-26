import { Link } from "react-router-dom";
import { User } from "lucide-react";

export default function Header() {
  return (
    <header
      className="w-full 
                      bg-opacity-10 backdrop-blur-lg 
                      fixed top-0 left-0 z-[5000]"
    >
      <div
        className="max-w-7xl mx-auto px-8 sm:px-12 lg:px-16  
                flex flex-row justify-between items-center
                "
      >
        <Link
          to="/"
          className="hover-red
          flex flex-row w-fit my-[10px]"
        >
          <img src="/logo-cinesharp.webp" width="40px" height="auto"></img>
          <h1 className="font-bold content-center pl-[10px] ">CineSharp</h1>
        </Link>
        <Link to="/LoginPage" className="hover-red my-[10px] w-[30px] h-auto">
          <User className="my-[10px] w-[30px] h-auto" />
        </Link>
      </div>
    </header>
  );
}
