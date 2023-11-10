"use client";
import React from "react";

interface ProgressBarProps {
  progress: number; // Expected to be between 0 and 1
}

export default function ProgressBar({ progress }) {
  // Ensure progress is between 0 and 1
  const validProgress = Math.min(Math.max(progress, 0), 1);
  const widthPercentage = validProgress * 100;

  return (
    <div className="flex-start flex h-1.5 w-full overflow-hidden rounded-sm bg-gray-300 font-sans text-xs font-medium">
      <div
        className="flex h-full items-baseline rounded justify-center overflow-hidden break-all bg-blue-500 text-white"
        style={{ width: `${widthPercentage}%` }}
      ></div>
    </div>
  );
}

// Usage:
// <ProgressBar progress={0.5} />  // This will render the bar filled to 50%
