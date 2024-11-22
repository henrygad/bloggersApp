import { useEffect, useState } from "react";


const useResizeWindow = () => {
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  const handleResizeWindow = () => {
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  };

  useEffect(() => {
    handleResizeWindow();
    
    window.addEventListener('resize', handleResizeWindow);
    return () => {
      window.addEventListener('resize', handleResizeWindow);
    };
  }, []);

  return { windowSize };
};

export default useResizeWindow;
