import React, { useState, useRef, useEffect } from "react";
import { UploadButtons } from "./components/UploadButtons";
import { ImageCanvas } from "./components/ImageCanvas";
import * as pdfjsLib from "pdfjs-dist/build/pdf";

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export default function App() {
  const [images, setImages] = useState([[], []]); // Store multiple images per index
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleImageUpload = async (index, file) => {
    if (file.type === "application/pdf") {
      const pdfImages = await convertPdfToImages(file);
      updateImageState(index, pdfImages);
    } else {
      updateImageState(index, [URL.createObjectURL(file)]);
    }
  };

  const updateImageState = (index, imageSrcArray) => {
    const newImages = [...images];
    newImages[index] = imageSrcArray;
    setImages(newImages);
  };

  const handleKeyPress = (event) => {
    if (event.key === "t" || event.key === "T") {
      setCurrentIndex((prev) => (prev === 0 ? 1 : 0));
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

  const convertPdfToImages = async (pdfFile) => {
    const fileReader = new FileReader();
    fileReader.readAsArrayBuffer(pdfFile);

    return new Promise((resolve) => {
      fileReader.onload = async () => {
        const pdfData = new Uint8Array(fileReader.result);
        const pdf = await pdfjsLib.getDocument({ data: pdfData }).promise;
        const numPages = pdf.numPages;
        const imageUrls = [];

        for (let i = 1; i <= numPages; i++) {
          const page = await pdf.getPage(i);
          const scale = 2;
          const viewport = page.getViewport({ scale });

          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          canvas.width = viewport.width;
          canvas.height = viewport.height;

          const renderContext = { canvasContext: ctx, viewport };
          await page.render(renderContext).promise;

          imageUrls.push(canvas.toDataURL("image/png"));
        }

        resolve(imageUrls);
      };
    });
  };

  return (
    <div className="flex flex-col items-start justify-center min-h-screen bg-gray-900 text-white p-4">
      <h1 className="text-3xl font-bold mb-4">Image & PDF Markup App</h1>
      <p>Press T to switch between images</p>
      <UploadButtons onUpload={handleImageUpload} />
      <div className="mt-4 w-full">
        {images[currentIndex].length > 0 ? (
          <ImageCanvas imageSrcArray={images[currentIndex]} />
        ) : (
          <p className="text-gray-400 text-center">Upload an image or PDF</p>
        )}
      </div>
    </div>
  );
}
