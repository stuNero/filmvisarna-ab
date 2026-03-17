import { useState } from 'react';
import { Lock } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import fetchJson from '../utils/fetchJson';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

ResetPassword.route = {
  path: '/återställ-lösenord'
};

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token'); // getting token from the url

  const [pass, setPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // error validation for confirming password for registration
  useEffect(() => {
    if (pass === '' || confirmPass === '') {
      setConfirmPasswordError('');
    } else if (pass != confirmPass) {
      setConfirmPasswordError('Lösenord matcher inte!');
    } else {
      setConfirmPasswordError('');
    }
  }, [pass, confirmPass]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isLoading) return; //prevent double submit

    setIsLoading(true);
    setError('');

    try {
      const result = await fetchJson('/api/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: token,
          password: pass
        })
      });

      if (result && result.error) {
        setError(result.error);
        setIsLoading(false);
        return;
      }

      setSuccessMessage(
        'Du har återställd ditt lösenord, nu kan du testa och logga in.'
      );
      setIsLoading(false);
    } catch (error) {
      console.error('Fel:', error);
      alert('Kunde inte återställa lösenordet');
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-screen pt-24">
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <div className="flex flex-col gap-8">
            <div className="space-y-2">
              <h1 className="text-center  text-4xl">Återställ lösenord</h1>
              <h2 className="text-center text-md text-gray-400 ">
                Välj ett nytt lösenord
              </h2>
            </div>

            {/* form for sending the link to email to recover password */}
            <form
              onSubmit={handleSubmit}
              className="bg-zinc-950 border border-white/10 rounded-3xl p-8 mb-12 space-y-6
            "
            >
              {/* new password */}
              <label className="text-sm text-gray-400 after:content-['*'] after:ml-1 after:text-red-700">
                Nytt Lösenord
              </label>
              <div className="mt-1 flex items-center bg-black border border-white/10 rounded-xl px-3 focus-within:outline-1 focus-within:outline-red-900 ">
                <Lock className="w-5 h-5 text-gray-500" />
                <input
                  type="password"
                  required
                  placeholder="Skriv Lösenord"
                  className="flex-1 bg-black px-3  py-3 rounded-xl text-white outline-none placeholder:text-gray-500 "
                  value={pass}
                  onChange={(e) => {
                    setPass(e.target.value);
                  }}
                />
              </div>

              {/* confirm password */}
              <label className="text-sm text-gray-400 after:content-['*'] after:ml-1 after:text-red-700">
                Bekräfta Lösenord
              </label>
              <div className="mt-1 flex items-center bg-black border border-white/10 rounded-xl px-3 focus-within:outline-1 focus-within:outline-red-900 ">
                <Lock className="w-5 h-5 text-gray-500" />
                <input
                  type="password"
                  required
                  placeholder="Skriv om Lösenord"
                  className="flex-1 bg-black px-3  py-3 rounded-xl text-white outline-none placeholder:text-gray-500 "
                  value={confirmPass}
                  onChange={(e) => {
                    setConfirmPass(e.target.value);
                  }}
                />
              </div>

              {(error || confirmPasswordError) && (
                <p className="text-red-600 mb-8 text-center animate-pulse">
                  {error || confirmPasswordError}
                </p>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="bg-red-800 hover:bg-red-700 px-5 py-2 rounded-xl font-semibold cursor-pointer w-full active:scale-95 duration-150  "
              >
                {isLoading ? 'återställer...' : 'Återställ Lösenord'}
              </button>
            </form>

            <Link
              to="/logga-in"
              className="block text-center text-gray-400 hover:text-gray-200 "
            >
              Tillbaka till inloggning
            </Link>

            {/* custom pop message for succesfull registeration */}
            {successMessage && (
              <div className="fixed bottom-40 inset-0 flex items-center justify-center bg-black/50 z-50 backdrop-blur-sm ">
                <div className="bg-zinc-900 text-white p-8 rounded-2xl shadow-xl w-80 text-center border border-gray-300">
                  <p className="mb-7">{successMessage}</p>

                  <button
                    onClick={() => {
                      setSuccessMessage('');
                      navigate('/logga-in');
                    }}
                    className="bg-red-800 hover:bg-red-700 px-5 py-2 rounded-xl font-semibold cursor-pointer w-full"
                  >
                    OK
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
