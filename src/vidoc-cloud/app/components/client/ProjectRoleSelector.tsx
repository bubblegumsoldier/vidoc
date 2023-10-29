// ProjectRoleSelector.js
import { Fragment, useEffect, useState } from "react";
import { Menu, Transition } from "@headlessui/react";
import ProjectRoleBadge from "./ProjectRoleBadge";
import { ChevronDownIcon } from "@heroicons/react/20/solid";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function ProjectRoleSelector({
  defaultRole,
  onRoleSelect = (_) => {},
}) {
  const [selectedRole, setSelectedRole] = useState("ADMIN");

  useEffect(() => {
    setSelectedRole(defaultRole || "ADMIN");
  }, [defaultRole]);

  const handleRoleClick = (role) => {
    setSelectedRole(role);
    if (onRoleSelect) onRoleSelect(role);
  };

  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-transparent hover:ring-gray-300 hover:bg-gray-50">
          <div className="flex items-center">
            <ProjectRoleBadge role={selectedRole} />
            <ChevronDownIcon className="text-gray-600 w-4 h-4 ml-2"></ChevronDownIcon>
          </div>
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
        <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            {["ADMIN", "CONTRIBUTOR"].map((role) => (
              <Menu.Item key={role}>
                {({ active }) => (
                  <button
                    onClick={() => handleRoleClick(role)}
                    className={classNames(
                      active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                      "block w-full px-4 py-2 text-left text-sm"
                    )}
                  >
                    <ProjectRoleBadge role={role} key={role} />
                  </button>
                )}
              </Menu.Item>
            ))}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
