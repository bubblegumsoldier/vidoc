import { withPageAuthRequired, getSession } from "@auth0/nextjs-auth0";
import { Inter } from "next/font/google";
import { UserProvider } from "@auth0/nextjs-auth0/client";
import ProfileButton from "../components/client/ProfileButton";
import Logo from "../components/Logo.svg";
import Image from "next/image";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default withPageAuthRequired(
  async function ProtectedLayout({ children }: any) {
    const { user } = await getSession();
    return (
      <>
        <html lang="en">
          <UserProvider>
            <body className={inter.className}>
              <div className="w-100  bg-gray-800">
                <div className="mx-auto max-w-7xl ">
                  <div className="relative flex h-16 items-center justify-between">
                    <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                      <div className="hiddensm:block">
                        <div className="flex space-x-4">
                          <Link href="/">
                            <Image
                              priority
                              src={Logo}
                              width={200}
                              height={40}
                              alt="Logo"
                            />
                          </Link>
                        </div>
                      </div>
                    </div>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                      <ProfileButton initialUser={user} />
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-100">{children}</div>
            </body>
          </UserProvider>
        </html>
      </>
    );
  },
  { returnTo: "/protected" }
);
