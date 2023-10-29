"use client";

import Image from "next/image";

export default function UserPreview({ user, light = false }) {
  return (
    <>
      <div className="flex items-center space-x-2">
        {user?.picture ? (
          <div className="flex-shrink-0">
            <Image
              src={user?.picture}
              alt="Profile"
              width={32}
              height={32}
              className="rounded-full"
            />
          </div>
        ) : null}
        <div>
          <div
            className={light ? `text-black text-base text-left` : "text-white text-base text-left"}
          >
            {user.name}
          </div>
          {user.email ? (
            <div
              className={
                light
                  ? `text-gray-600 text-xs text-left text-ellipsis max-w-xs	overflow-hidden whitespace-nowrap`
                  : "text-gray-400 text-xs text-left text-ellipsis max-w-xs	overflow-hidden whitespace-nowrap"
              }
            >
              {user.email}
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
}
