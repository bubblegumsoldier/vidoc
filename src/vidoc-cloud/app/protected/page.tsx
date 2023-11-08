import { getSession } from "@auth0/nextjs-auth0";
import { redirect } from 'next/navigation';

export default async function Home() {
  const session = await getSession();
  if (session) {
    return redirect("/protected/projects");
  } else {
    return redirect("/api/auth/login");
  }
}
