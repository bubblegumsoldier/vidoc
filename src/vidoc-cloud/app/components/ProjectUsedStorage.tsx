import BytesToString from "../utils/BytesToString";
import ProgressBar from "./ProgressBar";

export default function ProjectUsedStorage({ project }) {
  return (
    <div className="mt-1 flex flex-col sm:mt-0 sm:flex-row sm:flex-wrap sm:space-x-6">
      <div className="mt-2 flex items-center text-sm text-gray-500">
        {BytesToString.convert(project.usedMemory)}
      </div>
      <div className="mt-2 flex flex-1 items-center text-sm text-gray-500">
        <ProgressBar
          progress={project.usedMemory / (project.tier?.maxStorageBytes || 1)}
        />
      </div>
      <div className="mt-2 flex items-center text-sm text-gray-500 mr-4">
        {BytesToString.convert(project.tier?.maxStorageBytes || 0)}
      </div>
    </div>
  );
}
