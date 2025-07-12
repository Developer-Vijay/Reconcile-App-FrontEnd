import React from "react";

export default function LoadingSpinner({ message = "Loading..." }) {
  return (
    <div className="flex justify-center items-center mt-10">
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-opacity-60"></div>
      <p className="ml-4 text-blue-700 font-medium text-lg">{message}</p>
    </div>
  );
}
