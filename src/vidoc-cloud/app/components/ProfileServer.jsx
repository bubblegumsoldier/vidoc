import { getSession } from '@auth0/nextjs-auth0';

export default async function ProfileServer() {
  const session = await getSession();

  return (
      session && (
          <div>
            <img src={session.user.picture} alt={session.user.name} />
            <h2>{session.user.name}</h2>
            <p>{session.user.email}</p>
          </div>
      )
  );
}
