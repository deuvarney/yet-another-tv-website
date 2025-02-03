import { useState, useEffect } from 'react';
import debounce from 'lodash/debounce';

export const useScreenWidth = (mobileWidth: number) => {
  const [width, setWidth] = useState(window.innerWidth);
  const [isMobileSize, setMobileSize] = useState(width < mobileWidth);

  useEffect(() => {
    const handleResize = debounce(() => {
      const newWidth = window.innerWidth;
      setWidth(newWidth);
      const newIsMobileSize = newWidth < mobileWidth;
      if (newIsMobileSize !== isMobileSize) {
        setMobileSize(newIsMobileSize);
      }
    }, 500); // debounce for 500ms

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [mobileWidth, isMobileSize]);

  return isMobileSize;
};