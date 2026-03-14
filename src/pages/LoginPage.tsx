import { useEffect, useState } from 'react';
import fetchJson from '../utils/fetchJson';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthProvider';
import { Mail, Lock, User } from 'lucide-react';

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
  const { user, setUser } = useAuth();
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [duplicateEmailError, setDuplicateEmailError] = useState('');
  const [loginError, setLoginError] = useState('');
  const [registerMessage, setRegisterMessage] = useState('');

  const switchToLogin = () => {
    setActiveBtn('login');
    // Clear all fields when switching to login
    setEmail('');
    setPass('');
    setConfirmPass('');
    setFirstName('');
    setLastName('');
    setDuplicateEmailError('');
  };

  const switchToRegister = () => {
    setActiveBtn('medlem');
    // Clear all fields when switiching to register
    setEmail('');
    setPass('');
    setConfirmPass('');
    setFirstName('');
    setLastName('');
    setDuplicateEmailError('');
  };

  useEffect(() => {
    if (email === '') {
      setLoginError('');
    }
  }, [email, setEmail]);

  // user login function using fetchJson post method
  const login = async (e: React.FormEvent<HTMLFormElement>) => {
    // this line is to prevent the page to refresh, we only want render the component not the whole page
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
        setLoginError(result.error);
        return;
      }
      setUser(result);

      navigate(`/profil/${result?.id}`);
    } catch (error) {
      console.error('Fel:', error);
      alert('Något gick fel');
    }
  };

  // error validation for registration
  useEffect(() => {
    if (pass === '' || confirmPass === '') {
      setConfirmPasswordError('');
    } else if (pass != confirmPass) {
      setConfirmPasswordError('Lösenord matcher inte!');
    } else {
      setConfirmPasswordError('');
    }
  }, [pass, confirmPass]);

  // user registeration function using fetchjson post method
  const register = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (pass !== confirmPass) {
      setConfirmPasswordError('Lösenord matcher inte!');
      return;
    }

    try {
      // checking if the user alreday has an account with this email
      const checkUserExsistens = await fetchJson(
        `/api/users?WHERE=email=${email}`,
        {
          method: 'GET'
        }
      );

      // if the user exists, show en error and stop
      if (checkUserExsistens?.length > 0) {
        setDuplicateEmailError('Användaren finns redan!');
        return;
      }

      // if no user exists with this email continue with registration
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

      // if account creation was successful navigate user to login
      switchToLogin();
      setRegisterMessage('Konto skapat! Du kan nu logga in.');
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
              ${activeBtn === 'login' ? 'bg-zinc-800' : 'bg-black text-gray-500 hover:text-gray-300'}`}
                onClick={switchToLogin}
              >
                Login
              </button>
              <button
                className={`bg-black p-2 rounded-xl flex-1 border-black border-4 cursor-pointer
              ${activeBtn === 'medlem' ? 'bg-zinc-800' : 'bg-black  text-gray-500 hover:text-gray-300'}`}
                onClick={switchToRegister}
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
                    <label className="text-sm text-gray-400 ">Förnamn</label>
                    <div className="mt-1 flex items-center bg-black border border-white/10 rounded-xl px-3 focus-within:outline-1 focus-within:outline-red-900 ">
                      <User className="w-5 h-5 text-gray-500" />
                      <input
                        type="text"
                        placeholder="Förnamn"
                        className="flex-1 bg-transparent px-3 py-3 outline-none"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                      />
                    </div>
                  </div>
                  {/* lastname */}
                  <div>
                    <label className="text-sm text-gray-400 ">Efternamn</label>
                    <div className="mt-1 flex items-center bg-black border border-white/10 rounded-xl px-3 focus-within:outline-1 focus-within:outline-red-900 ">
                      <User className="w-5 h-5 text-gray-500" />
                      <input
                        type="text"
                        placeholder="Efternamn"
                        className="flex-1 bg-transparent px-3 py-3 outline-none"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                      />
                    </div>
                  </div>
                </>
              )}

              {/* email */}
              <div>
                <label className="text-sm text-gray-400 after:content-['*'] after:ml-1 after:text-red-700">
                  E-postadress
                </label>
                <div className="mt-1 flex items-center bg-black border border-white/10 rounded-xl px-3 focus-within:outline-1 focus-within:outline-red-900 ">
                  <Mail className="w-5 h-5 text-gray-500" />
                  <input
                    type="email"
                    required
                    placeholder="email@example.com"
                    className="flex-1 bg-black px-3 py-3 rounded-xl text-white outline-none "
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              {/* password for login */}
              {activeBtn === 'login' && (
                <div>
                  <div>
                    <label className="text-sm text-gray-400 after:content-['*'] after:ml-1 after:text-red-700">
                      Lösenord
                    </label>
                    <div className="mt-1 flex items-center bg-black border border-white/10 rounded-xl px-3 focus-within:outline-1 focus-within:outline-red-900 ">
                      <Lock className="w-5 h-5 text-gray-500" />
                      <input
                        type="password"
                        required
                        placeholder="********"
                        className="flex-1 bg-transparent px-3 py-3 outline-none"
                        value={pass}
                        onChange={(e) => {
                          setPass(e.target.value);
                        }}
                      />
                    </div>
                  </div>

                  <div className="text-sm flex justify-end">
                    <button className="text-red-700 cursor-pointer mt-1">
                      Glömt läsenord?
                    </button>
                  </div>
                </div>
              )}

              {/*  password for signup */}
              {activeBtn === 'medlem' && (
                <div>
                  <label className="text-sm text-gray-400 after:content-['*'] after:ml-1 after:text-red-700">
                    Lösenord
                  </label>
                  <div className="mt-1 flex items-center bg-black border border-white/10 rounded-xl px-3 focus-within:outline-1 focus-within:outline-red-900 ">
                    <Lock className="w-5 h-5 text-gray-500" />
                    <input
                      type="password"
                      required
                      placeholder="********"
                      className="flex-1 bg-transparent px-3 py-3 outline-none"
                      value={pass}
                      onChange={(e) => setPass(e.target.value)}
                    />
                  </div>
                </div>
              )}

              {/* Confirm password for signup */}
              {activeBtn === 'medlem' && (
                <div>
                  <label className="text-sm text-gray-400 after:content-['*'] after:ml-1 after:text-red-700">
                    Bekräfta lösenord
                  </label>
                  <div className="mt-1 flex items-center bg-black border border-white/10 rounded-xl px-3 focus-within:outline-1 focus-within:outline-red-900 ">
                    <Lock className="w-5 h-5 text-gray-500" />
                    <input
                      type="password"
                      required
                      placeholder="********"
                      className="flex-1 bg-transparent px-3 py-3 outline-none"
                      value={confirmPass}
                      onChange={(e) => setConfirmPass(e.target.value)}
                    />
                  </div>
                </div>
              )}

              {/* logga in and register account button */}
              <div>
                {(confirmPasswordError ||
                  loginError ||
                  duplicateEmailError) && (
                  <p className="text-red-600 mb-8 text-center animate-pulse">
                    {confirmPasswordError || loginError || duplicateEmailError}
                  </p>
                )}

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

                {registerMessage && (
                  <div className="fixed bottom-40 inset-0 flex items-center justify-center bg-black/50 z-50 ">
                    <div className="bg-zinc-900 text-white p-8 rounded-2xl shadow-xl w-80 text-center border border-gray-300">
                      <p className="mb-7">{registerMessage}</p>

                      <button
                        onClick={() => setRegisterMessage('')}
                        className="bg-red-700 hover:bg-red-600 px-5 py-2 rounded-xl font-semibold cursor-pointer"
                      >
                        OK
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
