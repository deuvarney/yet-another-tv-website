import { useState, useEffect } from 'react';
import debounce from 'lodash/debounce';

/**
 * Custom hook that determines if the current screen width is less than the specified mobile width.
 * It updates the result when the window is resized, with a debounce of 500ms.
 *
 * @param {number} mobileWidth - The breakpoint width to determine mobile size.
 * @returns {boolean} - Returns true if the current screen width is less than the specified mobile width, otherwise false.
 */

export const useScreenWidth = (mobileWidth: number) => {
  const [isMobileSize, setMobileSize] = useState(window.innerWidth < mobileWidth);

  useEffect(() => {
    const abortController = new AbortController();

    const handleResize = debounce(() => {
      const newIsMobileSize = window.innerWidth < mobileWidth;
      if (newIsMobileSize !== isMobileSize) {
        setMobileSize(newIsMobileSize);
      }
    }, 500); // debounce for 500ms

    window.addEventListener('resize', handleResize, {signal: abortController.signal});

    return () => {
      abortController.abort();
    };
  }, [mobileWidth, isMobileSize]);

  return isMobileSize;
};