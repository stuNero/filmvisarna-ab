import { useParams } from 'react-router-dom';
import useFetchJson from '../utils/useFetchJson';
import type UserDetails from '../interfaces/userDetails';

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
        className="top-0 bottom-0 left-0 h-[75vh] content-center justify-center"
      >
        <h2>Detta är profilsidan.</h2>
        <p>{userData?.firstName}</p>
      </div>
    </>
  );
}
