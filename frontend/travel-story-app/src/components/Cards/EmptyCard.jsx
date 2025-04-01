import React, { useState, useEffect } from "react";

const EmptyCard = ({ imgSrcList, message }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === imgSrcList.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000); // Change image every 3 seconds

    return () => clearInterval(interval);
  }, [imgSrcList.length]);

  return (
    <div className="flex flex-col items-center justify-center mt-38">
      <img src={imgSrcList[currentIndex]} alt="Slideshow" className="w-24 transition-opacity duration-500" />
      <p className="w-1/2 text-sm font-medium text-slate-700 text-center leading-7 mt-5">
        {message}
      </p>
    </div>
  );
};

export default EmptyCard;
