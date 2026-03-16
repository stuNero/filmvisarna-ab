import { useLocation } from 'react-router-dom';
import Header from './partials/Header';
import Main from './partials/Main';
import Footer from './partials/Footer';
import { useAuthContext } from './pages/AuthProvider';
import fetchJson from './utils/fetchJson';
import { useEffect } from 'react';

export default function App() {
  // scroll to top when the route changes
  useLocation();
  window.scrollTo({ top: 0, left: 0, behavior: 'instant' });

  const { setUser } = useAuthContext();
  // if a user gets loged out in frontend by page relode, not by clicking on logout button then this useeffect restorse the actual state of the user, which is logedin.
  useEffect(() => {
    const checkSession = async () => {
      try {
        const result = await fetchJson('/api/login', { method: 'GET' });
        if (result && !result.error) {
          setUser(result); // restore user from session!
        }
      } catch (error) {
        console.error('Session check failed:', error);
      }
    };

    checkSession();
  }, []); // run once when the app loads

  return (
    <div className="max-w-full overflow-x-hidden">
      <Header />
      <Main />
      <Footer />
    </div>
  );
}
