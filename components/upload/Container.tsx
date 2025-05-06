"use client";

import UploadBook from "./UploadBook";

const UploadContainer: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
        Upload Book To Azure Search Index
      </h1>
      <div className="border border-gray-300 rounded-lg p-4 bg-white">
        <UploadBook />
      </div>
    </div>
  );
};

export default UploadContainer;
