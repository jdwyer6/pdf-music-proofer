import React from "react";

export function UploadButtons({ onUpload }) {
  return (
    <div className="flex gap-4">
      {[0, 1].map((index) => (
        <div key={index} className="flex flex-col items-center">
          <input
            type="file"
            accept="image/*,application/pdf"
            className="hidden"
            id={`upload-${index}`}
            onChange={(e) => onUpload(index, e.target.files[0])}
          />
          <label
            htmlFor={`upload-${index}`}
            className="cursor-pointer bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg text-white text-sm"
          >
            Upload Image/PDF {index + 1}
          </label>
        </div>
      ))}
    </div>
  );
}
