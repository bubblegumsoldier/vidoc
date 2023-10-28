"use client";

import { useUser } from "@auth0/nextjs-auth0/client";
import { Menu, Transition } from "@headlessui/react";
import Image from "next/image";
import { Fragment } from "react";

export default function ProfileButton({initialUser}) {
  const { user, error, isLoading } = useUser();
  const errorMsg = error?.message;

  function getUser() {
    return user || initialUser;
  }

  return (
    <>
      {/* Profile dropdown */}
      <Menu as="div" className="relative ml-3">
        <div>
          <Menu.Button className="relative flex rounded items-center text-gray-300 hover:bg-gray-700 hover:text-white space-x-2 flex-row bg-gray-800 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:ring-offset-gray-800">
            {getUser()?.picture && (
              <Image
                src={getUser()?.picture}
                alt="Profile"
                width={32}
                height={32}
                className="rounded-full"
              />
            )}
            <span>{getUser()?.name}</span>
          </Menu.Button>
        </div>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            <Menu.Item>
              <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:text-black hover:bg-gray-100">
                Your Profile
              </a>
            </Menu.Item>
            <Menu.Item>
              <a
                href="/api/auth/logout"
                className="block px-4 py-2 text-sm text-gray-700 hover:text-black hover:bg-gray-100"
              >
                Logout
              </a>
            </Menu.Item>
          </Menu.Items>
        </Transition>
      </Menu>
    </>
  );
}
