import { useState } from 'react';
import { Mail, Lock, User } from 'lucide-react';
import { Link } from 'react-router-dom';

PasswordRecoveryPage.route = {
  path: '/återställ-lösenord'
};

export default function PasswordRecoveryPage() {
  const [email, setEmail] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(email);

    try {
      const response = await fetch('/api/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email
        })
      });

      if (response.ok) {
        setEmail(''); // remove the mail from field when email is sent
      } else {
        alert('Något gick fel å återställnings process');
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
          </div>
        </div>
      </div>
    </>
  );
}
