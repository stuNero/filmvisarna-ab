import { Link, useLocation } from 'react-router-dom';

export default function Footer() {
  return <footer className="relative bg-black border-t-2 border-solid border-white h-[200px]">
    <div className='max-w-7xl mx-auto'>
      <Link to="/" className='hover:text-red-800 transition-colors duration-400 mt-[50px] flex flex-row w-fit'>
        < img src="/logo-cinesharp.webp" width="50px" height="auto" ></img >
        <h1 className='font-bold content-center pl-[10px] '>
          CineSharp
        </h1>
      </Link >
    </div>
  </footer>;
}