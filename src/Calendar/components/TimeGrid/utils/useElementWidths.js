import { useRef, useEffect, useState } from 'react';
import isEqual from 'react-fast-compare';
import { addListener, removeListener } from 'resize-detector';
import throttle from 'lodash.throttle';

/**
 * Create the ref Map for all the elements and get the widths
 * of said elements when the refs have propagated
 */
const useElementWidths = (props) => {
  const elementRefs = useRef(new Map()).current;
  const TimeGridRef = useRef(null);
  const [elementWidths, setElementWidths] = useState([]);

  // Store resize handler in a ref to maintain reference across renders
  const resizeHandlerRef = useRef(null);

  const getElementsMeasurements = () => {
    const widths = [];
    elementRefs.forEach((element, day) => {
      if (element && typeof element.offsetWidth === 'number') {
        widths.push(element.offsetWidth);
      }
    });
    return widths;
  };

  const setAllWidths = () => {
    const measurements = getElementsMeasurements();
    if (!isEqual(measurements, elementWidths)) {
      setElementWidths(measurements);
    }
  };

  // Create throttled resize handler only once
  useEffect(() => {
    resizeHandlerRef.current = throttle(() => {
      setAllWidths();
    }, 300);
  }, []);

  useEffect(() => {
    const currentElement = TimeGridRef.current;
    const resizeHandler = resizeHandlerRef.current;

    if (currentElement && resizeHandler) {
      try {
        addListener(currentElement, resizeHandler);
      } catch (error) {
        console.warn('Failed to add resize listener:', error);
      }

      // Initial width calculation
      setAllWidths();
    }

    return () => {
      if (currentElement && resizeHandler) {
        try {
          removeListener(currentElement, resizeHandler);
        } catch (error) {
          console.warn('Failed to remove resize listener:', error);
        }
      }
    };
  }, [TimeGridRef.current]); // Only re-run if the ref changes

  // A function used to assign to the element for multiple refs
  // used like this ref={assignRef(key)}
  const assignRef = (key) => (inst) => {
    if (inst === null) {
      elementRefs.delete(key);
    } else {
      elementRefs.set(key, inst);
    }
  };

  return {
    TimeGridRef,
    elementWidths,
    assignRef,
  };
};

export default useElementWidths;
