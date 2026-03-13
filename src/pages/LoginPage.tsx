import { useState } from 'react';
import fetchJson from '../utils/fetchJson';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthProvider';

LoginPage.route = {
  path: '/logga-in'
};

export default function LoginPage() {
  const navigate = useNavigate();
  const [activeBtn, setActiveBtn] = useState('login');
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const { setUser } = useAuth();

  const login = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const result = await fetchJson(`/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email,
          password: pass
        })
      });

      if (result && result.error) {
        alert(result.error);
        return;
      }
      setUser(result);
      navigate('/profil/:id');
    } catch (error) {
      console.error('Fel:', error);
      alert('Något gick fel');
    }
  };

  const register = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (pass != confirmPass) {
      alert('Lösenord matcher inte');
      return;
    }

    try {
      const result = await fetchJson(`/api/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          password: pass
        })
      });

      if (result && result.error) {
        alert(result.error);
        return;
      }
    } catch (error) {
      console.error('Fel:', error);
      alert('Något gick fel');
    }
  };

  return (
    <>
      {/* div for centring the whole page */}
      <div className="min-h-screen  flex justify-center items-center px-4 pt-16">
        {/* div for stopping content stretch to edges */}
        <div className="w-full max-w-md">
          {/* welcome text and logo */}
          <div className="flex flex-col items-center my-8 space-y-2">
            <img
              src="/logo-cinesharp.webp"
              width="60px"
              height="auto"
              alt="cinesharp logo"
            />
            <h1 className="text-4xl">Välkommen tillbaka </h1>
            <h2 className="text-md text-gray-400">
              Logga in för att hantera dina bokningar
            </h2>
          </div>

          <div className="bg-zinc-950 border border-white/10 rounded-3xl p-8 mb-12 ">
            <section className=" flex flex-row bg-black rounded-xl justify-between mb-8">
              <button
                className={`bg-black p-2 rounded-xl flex-1 border-black border-4 cursor-pointer
              ${activeBtn === 'login' ? 'bg-gray-500' : 'bg-black'}`}
                onClick={() => setActiveBtn('login')}
              >
                Login
              </button>
              <button
                className={`bg-black p-2 rounded-xl flex-1 border-black border-4 cursor-pointer
              ${activeBtn === 'medlem' ? 'bg-gray-500' : 'bg-black'}`}
                onClick={() => setActiveBtn('medlem')}
              >
                Bli medlem
              </button>
            </section>

            <form
              onSubmit={activeBtn === 'login' ? login : register}
              className="space-y-8 "
            >
              {/* condition rendering of registering a new user */}
              {activeBtn === 'medlem' && (
                <>
                  {/* firstname */}
                  <div>
                    <label className="text-sm text-gray-400">Förnamn</label>
                    <input
                      type="text"
                      required
                      placeholder="Förnamn"
                      className="w-full bg-black px-4 py-3 rounded-xl border border-white/10"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                  </div>
                  {/* lastname */}
                  <div>
                    <label className="text-sm text-gray-400 ">Efternamn</label>
                    <input
                      type="text"
                      required
                      placeholder="Efternamn"
                      className="w-full bg-black px-4 py-3 rounded-xl"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </div>
                </>
              )}

              {/* email */}
              <div>
                <label className="text-sm text-gray-400">E-postadress</label>
                <input
                  type="email"
                  required
                  placeholder="email@example.com"
                  className="w-full bg-black px-4 py-3 rounded-xl border border-white/10"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              {/* password for login */}
              {activeBtn === 'login' && (
                <div>
                  <div>
                    <label className="text-sm text-gray-400">Lösenord</label>

                    <input
                      type="password"
                      required
                      placeholder="********"
                      className="w-full bg-black px-4 py-3 rounded-xl border border-white/10"
                      value={pass}
                      onChange={(e) => setPass(e.target.value)}
                    />
                  </div>

                  <div className="text-sm flex justify-end">
                    <button className="text-red-700 cursor-pointer">
                      Glömt läsenord?
                    </button>
                  </div>
                </div>
              )}

              {/*  password for signup */}
              {activeBtn === 'medlem' && (
                <div>
                  <label className="text-sm text-gray-400">Lösenord</label>
                  <input
                    type="password"
                    required
                    placeholder="********"
                    className="w-full bg-black px-4 py-3 rounded-xl border border-white/10"
                    value={pass}
                    onChange={(e) => setPass(e.target.value)}
                  />
                </div>
              )}

              {/* Confirm password for signup */}
              {activeBtn === 'medlem' && (
                <div>
                  <label className="text-sm text-gray-400">
                    Bekräfta lösenord
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="********"
                    className="w-full bg-black px-4 py-3 rounded-xl border border-white/10"
                    value={confirmPass}
                    onChange={(e) => setConfirmPass(e.target.value)}
                  />
                </div>
              )}

              {/* logga in button */}
              <div>
                <button
                  type="submit"
                  className="
                  w-full bg-red-800 
                  mb-8
                  px-4 py-3 rounded-xl 
                  cursor-pointer
                  transition-all 
                  duration-150
                  active:scale-95 active:brightness-75"
                >
                  {activeBtn === 'login' ? 'Logga in' : 'Skapa konto'}
                </button>

                {/* logut button for debug puposes */}
                {/* <button
                  className="cursor-pointer border border-1"
                  onClick={async () => {
                    await fetchJson('/api/login', { method: 'DELETE' });

                    setUser(null);
                    window.location.href = '/logga-in';
                  }}
                >
                  Logga ut
                </button> */}
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
