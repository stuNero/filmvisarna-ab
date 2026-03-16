import { useState } from 'react';
import { Mail, Lock, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import fetchJson from '../utils/fetchJson';
import { useNavigate } from 'react-router-dom';

ForgotPassword.route = {
  path: '/glömt-lösenord'
};

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [emailSentMessage, setEmailSentMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const result = await fetchJson('/api/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email
        })
      });

      if (result && result.message) {
        setEmailSentMessage(result.message);
        setEmail('');

        navigate('/logga-in');
      } else {
        alert('Något gick fel i Endpoint');
      }
    } catch (error) {
      console.error('Fel:', error);
      alert('Kunde inte skicka återställnings email');
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
                Ange din e-postadress för att få en återställningslänk
              </h2>
            </div>

            {/* form for sending the link to email to recover password */}
            <form
              onSubmit={handleSubmit}
              className="bg-zinc-950 border border-white/10 rounded-3xl p-8 mb-12 space-y-6
            "
            >
              {/* email */}
              <label className="text-sm text-gray-400 after:content-['*'] after:ml-1 after:text-red-700">
                E-postadress
              </label>
              <div className="mt-1 flex items-center bg-black border border-white/10 rounded-xl px-3 focus-within:outline-1 focus-within:outline-red-900 ">
                <Mail className="w-5 h-5 text-gray-500" />
                <input
                  type="email"
                  required
                  placeholder="User@mail.com"
                  className="flex-1 bg-black px-3  py-3 rounded-xl text-white outline-none placeholder:text-gray-500 "
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value.trim());
                  }}
                />
              </div>
              <button
                type="submit"
                className="bg-red-800 hover:bg-red-700 px-5 py-2 rounded-xl font-semibold cursor-pointer w-full active:scale-95 duration-150  "
              >
                Skicka
              </button>
            </form>

            <Link
              to="/logga-in"
              className="block text-center text-gray-400 hover:text-gray-200 "
            >
              Tillbaka till inloggning
            </Link>

            {/* custom pop message for succesfull registeration */}
            {emailSentMessage && (
              <div className="fixed bottom-40 inset-0 flex items-center justify-center bg-black/50 z-50 ">
                <div className="bg-zinc-900 text-white p-8 rounded-2xl shadow-xl w-80 text-center border border-gray-300">
                  <p className="mb-7">{emailSentMessage}</p>

                  <button
                    onClick={() => setEmailSentMessage('')}
                    className="bg-red-800 hover:bg-red-700 px-5 py-2 rounded-xl font-semibold cursor-pointer"
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
