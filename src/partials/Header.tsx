import { Link } from 'react-router-dom';
import { User } from 'lucide-react';
import LoginPage from '../pages/LoginPage';
import HomePage from '../pages/HomePage';
import { useAuth } from '../pages/AuthProvider';
import fetchJson from '../utils/fetchJson';
import { useNavigate } from 'react-router-dom';

export default function Header() {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();

  return (
    <header
      className="w-full 
                      bg-opacity-10 backdrop-blur-lg 
                      fixed top-0 left-0 z-5000"
    >
      <div
        className="max-w-7xl mx-auto py-2 px-8 sm:px-12 lg:px-16  
                flex flex-row justify-between items-center
                "
      >
        <Link
          to={HomePage.route.path}
          className="hover-red
          flex flex-row w-fit my-2.5"
        >
          <img src="/logo-cinesharp.webp" width="40px" height="auto"></img>
          <h1 className="font-bold content-center pl-2.5 ">CineSharp</h1>
        </Link>

        {/* user button behaviour */}
        <div className="flex items-center gap-6 ">
          {/* user icon */}
          {/* routing logic for the logedin vs logedout user */}

          <Link
            to={user ? `/profil/${user.id}` : LoginPage.route.path}
            className="hover-red flex items-center gap-2"
          >
            <User className="w-6 h-6 text-red-700" />

            {/* username */}
            {user && <span className="font-bold">{user.firstName}</span>}
          </Link>

          {/* logout button */}
          {/* routing logic when logout button is pressed */}
          {user && (
            <button
              className="cursor-pointer hover-red test-sm text-gray-400"
              onClick={async () => {
                await fetchJson('/api/login', { method: 'DELETE' });

                setUser(null);
                navigate('/logga-in');
              }}
            >
              Logga ut
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
