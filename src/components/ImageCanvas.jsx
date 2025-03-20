import React, { useRef, useEffect, useState } from "react";

export function ImageCanvas({ imageSrcArray }) {
  const canvasRefs = useRef([]);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    imageSrcArray.forEach((imageSrc, index) => {
      const canvas = canvasRefs.current[index];
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      const img = new Image();
      img.src = imageSrc;
      img.onload = () => {
        canvas.width = img.width / 2;
        canvas.height = img.height / 2;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      };
    });
  }, [imageSrcArray]);

  const startDrawing = (e, index) => {
    const { offsetX, offsetY } = e.nativeEvent;
    const ctx = canvasRefs.current[index].getContext("2d");
    ctx.beginPath();
    ctx.moveTo(offsetX, offsetY);
    setIsDrawing(true);
  };

  const draw = (e, index) => {
    if (!isDrawing) return;
    const { offsetX, offsetY } = e.nativeEvent;
    const ctx = canvasRefs.current[index].getContext("2d");
    ctx.lineTo(offsetX, offsetY);
    ctx.strokeStyle = "red";
    ctx.lineWidth = 3;
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const saveImage = () => {
    imageSrcArray.forEach((_, index) => {
      const link = document.createElement("a");
      link.href = canvasRefs.current[index].toDataURL("image/png");
      link.download = `marked-up-image-${index + 1}.png`;
      link.click();
    });
  };

  return (
    <div className="overflow-x-auto w-full bg-gray-800 p-4 rounded-lg">
      <div className="flex space-x-4">
        {imageSrcArray.map((imageSrc, index) => (
          <canvas
            key={index}
            ref={(el) => (canvasRefs.current[index] = el)}
            className="border border-gray-300 rounded-lg"
            onMouseDown={(e) => startDrawing(e, index)}
            onMouseMove={(e) => draw(e, index)}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
          />
        ))}
      </div>
      <button
        onClick={saveImage}
        className="mt-3 bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg text-white text-sm"
      >
        Save All Images
      </button>
    </div>
  );
}
