"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import DefaultProfilePicture from "../DefaultProfilePicture.svg";

export default function UserPreview({ user, light = false }) {
  const [src, setSrc] = useState(null);
  const [imageNotFound, setImageNotFound] = useState(false);

  useEffect(() => {
    setSrc(user.picture);
  }, [user]);

  return (
    <>
      <div className="flex items-center space-x-2">
        {(src && !imageNotFound) ? (
          <div className="flex-shrink-0">
            <Image
              src={src}
              alt="Profile"
              width={32}
              height={32}
              className="rounded-full"
              onError={() => setImageNotFound(true)}
            />
          </div>
        ) : (
          <Image
            src={DefaultProfilePicture}
            width={32}
            height={32}
            alt="Default Profile Picture"
          />
        )}
        <div>
          <div
            className={
              light
                ? `text-black text-base text-left`
                : "text-white text-base text-left"
            }
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
