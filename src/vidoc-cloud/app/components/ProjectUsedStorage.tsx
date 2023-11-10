"use client";
import { useEffect, useState } from "react";
import BytesToString from "../utils/BytesToString";
import ProgressBar from "./ProgressBar";
import { toast } from "react-toastify";
import CustomToastContainer from "./client/CustomToastContainer";
import { Spinner } from "@material-tailwind/react";
import { ArrowPathIcon } from "@heroicons/react/20/solid";

async function refreshProject(projectId: string) {
  console.log({projectId});
  const response = await fetch(
    `/api/projects/${projectId}?updateStorage=true`,
    { next: { revalidate: 0 } }
  );
  if (response.status !== 200) {
    throw new Error((await response.json()).message);
  }
  const project = await response.json();
  return project;
}

export default function ProjectUsedStorage({ project, autoRefresh }) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshedProject, setRefreshedProject] = useState(project);

  const refresh = async () => {
    setIsRefreshing(true);
    try {
      await refreshProject(project.id);
      setRefreshedProject(refreshedProject);
    } catch (e) {
      toast.error(e.message, {
        type: "error",
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    setRefreshedProject(project);
    if (autoRefresh) {
      refresh();
    }
  }, []);

  return (
    <div className="mt-1 flex flex-col sm:mt-0 sm:flex-row sm:flex-wrap sm:space-x-6">
      <div className="mt-2 flex items-center text-sm text-gray-500">
        {BytesToString.convert(refreshedProject.usedMemory)}
      </div>
      <div className="mt-2 flex flex-1 items-center text-sm text-gray-500">
        <ProgressBar
          progress={
            refreshedProject.usedMemory /
            (refreshedProject.tier?.maxStorageBytes || 1)
          }
        />
      </div>
      <div className="mt-2 flex items-center text-sm text-gray-500 mr-4">
        {BytesToString.convert(refreshedProject.tier?.maxStorageBytes || 0)}
      </div>
      <div className="mt-2 flex items-center text-sm text-gray-500">
        {isRefreshing ? (
          <Spinner className="w-4 h-4" />
        ) : (
          <button onClick={async () => await refresh()}>
            <ArrowPathIcon className="w-4 h-4" />
          </button>
        )}
      </div>
      <CustomToastContainer />
    </div>
  );
}
