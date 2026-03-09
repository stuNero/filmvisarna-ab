import { useParams } from 'react-router-dom';
import useFetchJson from '../utils/useFetchJson';
import type UserDetails from '../interfaces/userDetails';
import { User } from 'lucide-react';

ProfilePage.route = {
  path: '/profil/:id'
};

export default function ProfilePage() {

  //TODO: Should be replaced with proper user handling, not using params
  const { id } = useParams<{ id: string; }>();
  const userId = Number(id);
  // Fetch from userId table in DB
  const [userDataRaw] = useFetchJson<UserDetails[] | null>(
    `/api/users?where=id=${userId}`
  );

  //Gets first entry, aka the data, allows avoiding constant checks for null
  const userData = userDataRaw?.[0];

  return (
    <>
      <div
        className="top-0 bottom-0 left-0 content-center justify-center md:mt-30 mt-20">
        <div className="bg-zinc-950 rounded-2xl border-2 border-white/20 p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-24 h-24 bg-red-800 rounded-full flex items-center justify-center shadow-lg shadow-red-800/20">
              <User className="w-12 h-12 text-white" />
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-3xl font-bold text-white mb-2">{userData?.firstName} {userData?.lastName}</h1>
              <p>{userData?.email}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
