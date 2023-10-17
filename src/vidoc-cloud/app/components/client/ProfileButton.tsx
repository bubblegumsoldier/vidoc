"use client";

import { useUser } from "@auth0/nextjs-auth0/client";
import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";

export default function ProfileButton() {
  const { user, error, isLoading } = useUser();
  const errorMsg = error?.message;

  return (
    <>
      {/* Profile dropdown */}
      <Menu as="div" className="relative ml-3">
        <div>
          <Menu.Button className="relative flex rounded-full bg-gray-800 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
            <span className="text-white">
              {isLoading ? "Loading..." : user?.name || errorMsg}
            </span>
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
              <a href="#" className="block px-4 py-2 text-sm text-gray-700">
                Your Profile
              </a>
            </Menu.Item>
            <Menu.Item>
              <a
                href="/api/auth/logout"
                className="block px-4 py-2 text-sm text-gray-700"
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
