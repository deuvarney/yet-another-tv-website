import { useEffect, useRef } from 'react';

/**
 * Hook that returns the previous value of a given `value`.
 *
 * @param {T} value - The value to get the previous value of.
 * @returns {T | undefined} The previous value of `value`, or `undefined` if it is the first time the hook is ran.
 */
function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}

export default usePrevious;