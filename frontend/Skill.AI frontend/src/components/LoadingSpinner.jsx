import React from "react";

const LoadingSpinner = () => {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-white z-50">
      {/* Spinner */}
      <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>

      {/* Logo / Brand */}
      <h2 className="mt-6 text-2xl font-bold text-purple-700">
        Skill.AI Training
      </h2>

      {/* Loading Text */}
      <p className="mt-2 text-gray-500 animate-pulse">
        Loading...
      </p>
    </div>
  );
};

export default LoadingSpinner;