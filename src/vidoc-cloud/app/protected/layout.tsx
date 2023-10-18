import { withPageAuthRequired, getSession } from "@auth0/nextjs-auth0";
import { Inter } from "next/font/google";
import { UserProvider } from "@auth0/nextjs-auth0/client";
import ProfileButton from "../components/client/ProfileButton";

const inter = Inter({ subsets: ["latin"] });

const navigation = [{ name: "Projects", href: "#", current: true }];

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
                <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
                  <div className="relative flex h-16 items-center justify-between">
                    <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                      <div className="hiddensm:block">
                        <div className="flex space-x-4">
                          {navigation.map((item) => (
                            <a
                              key={item.name}
                              href={item.href}
                              className={classNames(
                                item.current
                                  ? "bg-gray-900 text-white"
                                  : "text-gray-300 hover:bg-gray-700 hover:text-white",
                                "rounded-md px-3 py-2 text-sm font-medium"
                              )}
                              aria-current={item.current ? "page" : undefined}
                            >
                              {item.name}
                            </a>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                      <ProfileButton />
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-100">
                <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8 h-16">
                  <div className="body">{children}</div>
                </div>
              </div>
            </body>
          </UserProvider>
        </html>
      </>
    );
  },
  { returnTo: "/profile" }
);
