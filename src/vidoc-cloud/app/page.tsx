import Image from 'next/image'
import ProfileServer from './components/ProfileServer';
import Projects from './components/Projects';

export default function Home() {
  return (
    <main>
      <h1>Home Auth0 Login Test</h1>
      <a href="/api/auth/login">Login</a>
      <a href="/api/auth/logout">Logout</a>
      {/* <ProfileServer /> */}
      <Projects />
    </main>
  )
}
