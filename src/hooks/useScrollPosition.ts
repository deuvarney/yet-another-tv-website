import {useEffect, useState} from 'react';

    /**
     * Hook that returns the current scroll position of the window.
     *
     * @return {number} The current scroll position.
     */
const useScrollPosition = () => {
    const [scrollPosition, setScrollPosition] = useState(0);

    useEffect(() => {
        const updatePosition = () => {
            setScrollPosition(window.pageYOffset);
        };
        window.addEventListener('scroll', updatePosition);
        updatePosition();
        return () => window.removeEventListener('scroll', updatePosition);
    }, []);

    return scrollPosition;
};

    /**
     * useScrollPositionExec will call the function `fn` when the scroll position
     * exceeds the given percentage of the window height. The function will be
     * called only once.
     *
     * @param {number} scrollPercentage - a float between 0 and 1, indicating the
     * scroll position as a percentage of the window height
     * @param {() => void} fn - the function to be called when the scroll position
     * exceeds the given percentage
     *
     * @example
     *     useScrollPositionExec(.75, () => {});
     */
export const useScrollPositionExec = (scrollPercentage: number, fn: () => void) => {

    useEffect(() => {
        const abortController = new AbortController();

        const updatePosition = () => {
            const scrollPosition = window.pageYOffset;
            if (scrollPosition + window.screen.availHeight > document.body.scrollHeight * scrollPercentage) {
                fn();
            }
        };
        window.addEventListener('scroll', updatePosition, {signal: abortController.signal});
        updatePosition();
        return () => abortController.abort();
    }, [scrollPercentage, fn]);
}

/**
 * Calculates the root margin as a percentage of the viewport height.
 * This function dynamically adjusts the margin based on the document height.
 *
 * @param {number} documentHeight - The total height of the document.
 * @return {number} The calculated root margin as a percentage.
 */
const calculateRootMargin = (documentHeight: number): number => {
    const viewportHeight = window.innerHeight;

    // Base percentage (starts higher at 35% from bottom)
    const basePercentage = 35;

    // Calculate ratio of document height to viewport height
    const heightRatio = documentHeight / viewportHeight;

    // More aggressive reduction formula:
    // 1. Power function for scaling (heightRatio^0.6)
    // 2. Higher multiplier (8 instead of 5)
    // 3. Lower minimum margin (3% instead of 5%)
    const dynamicPercentage = Math.max(
        3,
        basePercentage - Math.min(32, Math.pow(heightRatio, 0.6) * 8)
    );

    // Return the final root margin as a percentage
    return 1 - (dynamicPercentage * 0.01);
};



/**
 * useDynamicScrollExec triggers a callback function when the scroll position
 * exceeds a dynamically calculated percentage of the document height.
 * The function will be executed only once per scroll event.
 *
 * @param {boolean} enabled - A boolean indicating whether items have been loaded.
 * The function will only execute if this number is greater than zero.
 * @param {() => void} fn - The callback function to be executed when the scroll
 * position exceeds the calculated percentage.
 */
export const useDynamicScrollExec = (enabled: boolean, fn: () => void) => {
    useEffect(() => {
        // Create an AbortController to allow event listener cleanup
        const abortController = new AbortController();

        const updatePosition = () => {
            // Get the total document height
            const documentHeight = document.body.scrollHeight;

            // Calculate the scroll position threshold using the root margin
            const scrollPercentage = calculateRootMargin(documentHeight);

            // Get the current scroll position
            const scrollPosition = window.pageYOffset;

            // Check if the scroll position exceeds the threshold and items are loaded
            if ((scrollPosition + window.screen.availHeight > documentHeight * scrollPercentage)) {
                // Execute the callback function
                fn();
            }
        };

        if (enabled) {
            // Add a scroll event listener to update the scroll position
            window.addEventListener('scroll', updatePosition, { signal: abortController.signal });

            // Initial check to see if the threshold is already exceeded
            updatePosition();
        }

        // Cleanup the event listener on component unmount
        return () => abortController.abort();
    }, [enabled, fn]); // Dependencies for useEffect
}

export default useScrollPosition;
