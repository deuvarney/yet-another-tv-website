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

export default useScrollPosition;
