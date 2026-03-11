import { Link, useNavigate } from 'react-router-dom';
import { User } from 'lucide-react';
import LoginPage from '../pages/LoginPage';
import HomePage from '../pages/HomePage';
import { useAuth } from '../pages/AuthProvider';
import fetchJson from '../utils/fetchJson';
import ProfilePage from '../pages/ProfilePage';

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
        className="max-w-7xl mx-auto px-8 sm:px-12 lg:px-16  
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
        <div className="flex space-x-6">
          {/* routing logic for the logedin vs logedout user */}
          {user ? (
            <Link
              to={ProfilePage.route.path}
              className="hover-red my-2.5 w-7.5 h-auto"
            >
              <User className="my-2.5 w-7.5 h-auto" />
            </Link>
          ) : (
            <Link
              to={LoginPage.route.path}
              className="hover-red my-2.5 w-7.5 h-auto"
            >
              <User className="my-2.5 w-7.5 h-auto" />
            </Link>
          )}

          {/* routing logic when logout button is pressed */}
          {user && (
            <button
              className="cursor-pointer"
              onClick={async () => {
                await fetchJson('/api/login', { method: 'DELETE' });

                setUser(null);
                window.location.href = '/logga-in';
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
