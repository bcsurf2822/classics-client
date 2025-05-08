import React, { useState, ChangeEvent } from "react";

type StatusType = "success" | "error" | "info" | null;

interface StatusMessage {
  message: string;
  type: StatusType;
}

const UploadBook: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [status, setStatus] = useState<StatusMessage | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [indexName, setIndexName] = useState<string>("");

  const handleFileSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setSelectedFile(file);
  };

  const handleSelectFileClick = () => {
    document.getElementById("file-input")?.click();
  };

  const handleIndexNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setIndexName(event.target.value);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setStatus({
        message: "Please select a file first.",
        type: "error",
      });
      return;
    }

    if (!selectedFile.name.endsWith(".txt")) {
      setStatus({
        message: "Only .txt files are supported.",
        type: "error",
      });
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    // Add the optional index_name if provided
    if (indexName.trim()) {
      formData.append("index_name", indexName.trim());
    }

    try {
      setIsUploading(true);
      setStatus({
        message: "Uploading file...",
        type: "info",
      });

      const response = await fetch("/api/upload-book", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        setStatus({
          message: `File uploaded successfully! Processing started for index: ${result.index_name}`,
          type: "success",
        });
        // Reset the form
        setSelectedFile(null);
        setIndexName("");
      } else {
        setStatus({
          message: `Error: ${result.detail || "Unknown error"}`,
          type: "error",
        });
      }
    } catch (error) {
      setStatus({
        message: `Error: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
        type: "error",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div>
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-5 text-center my-5 bg-gray-50 hover:border-gray-500">
        <h2 className="text-xl font-bold text-gray-700">Upload a Text File</h2>
        <p className="mb-4">Select a .txt file to add to the search index</p>

        <input
          type="file"
          id="file-input"
          accept=".txt"
          style={{ display: "none" }}
          onChange={handleFileSelect}
        />
        <button
          className="bg-green-500 hover:bg-green-600 hover:cursor-pointer text-white py-2 px-4 rounded text-base transition-colors"
          onClick={handleSelectFileClick}
          disabled={isUploading}
        >
          Select File
        </button>

        {selectedFile && (
          <div className="mt-2 italic text-gray-600">
            Selected: {selectedFile.name}
          </div>
        )}

        {selectedFile && (
          <div className="mt-4">
            <div className="mb-3">
              <label
                htmlFor="index-name"
                className="block text-left text-gray-700 mb-1"
              >
                Index Name (optional):
              </label>
              <input
                type="text"
                id="index-name"
                value={indexName}
                onChange={handleIndexNameChange}
                placeholder="Enter custom index name"
                className="w-full p-2 border border-gray-300 rounded"
              />
              <p className="text-xs text-left text-gray-500 mt-1">
                Leave blank to generate automatically
              </p>
            </div>

            <button
              className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded text-base transition-colors"
              onClick={handleUpload}
              disabled={isUploading}
            >
              {isUploading ? "Uploading..." : "Upload to Search Index"}
            </button>
          </div>
        )}
      </div>

      {status && (
        <div
          className={`mt-4 p-3 rounded ${
            status.type === "success"
              ? "bg-green-100 text-green-800"
              : status.type === "error"
              ? "bg-red-100 text-red-800"
              : "bg-blue-100 text-blue-800"
          }`}
        >
          {status.message}
        </div>
      )}

      {/* Help area for users without a document */}
      <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded text-center">
        <p className="text-yellow-800 text-base">
          Don&apos;t have a text file to upload? Visit{" "}
          <a
            href="https://www.gutenberg.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-700 underline hover:text-blue-900"
          >
            Project Gutenberg
          </a>
          .
        </p>
      </div>
    </div>
  );
};

export default UploadBook;
