import { useState } from 'react';
import fetchJson from '../utils/fetchJson';
import { useNavigate } from 'react-router-dom';

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
          </div>
        </div>
      </div>
    </>
  );
}
