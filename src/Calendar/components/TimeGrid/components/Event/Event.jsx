import React, { useRef, useEffect, useLayoutEffect, useState } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import './Event.scss';
import EventWrapper from '../../../EventWrapper';
import { getDisplayTime } from '../../utils';
import { makeClass } from '../../../../utils';
import { EVENT_TYPE } from '../../../../types';
import { extendHandleClass, handleCenterClass } from '../../constants';

const Event = ({
  children,
  className,
  event,
  isSelectable,
  onSelect,
  isExtendable,
  onContentMeasured,
  ...restProps
}) => {
  const wrapperRef = useRef(null);
  const contentRef = useRef(null);
  const extenderRef = useRef(null);
  const [dragHandleCenterHeight, setDragHandleCenterHeight] = useState(0);

  // Set the height of the inner handler for drag and drop
  useEffect(() => {
    if (wrapperRef.current !== null && extenderRef.current !== null) {
      const wrapperHeight = wrapperRef.current.clientHeight;
      const extenderHeight = extenderRef.current.clientHeight;
      const height = `${wrapperHeight - extenderHeight}px`;
      if (dragHandleCenterHeight !== height) {
        setDragHandleCenterHeight(height);
      }
    }
  });

  // Report the natural content height upstream so the grid can grow its rows
  // if the inner content is taller than the duration-derived event box.
  useLayoutEffect(() => {
    if (!onContentMeasured || !contentRef.current) return undefined;
    const report = () => {
      if (!contentRef.current) return;
      const naturalHeight = contentRef.current.offsetHeight;
      const durationMinutes = moment(event.end).diff(
        moment(event.start),
        'minutes'
      );
      onContentMeasured({
        id: event.id,
        scrollHeight: naturalHeight,
        durationMinutes,
      });
    };
    report();
    if (typeof ResizeObserver === 'undefined') return undefined;
    const observer = new ResizeObserver(report);
    observer.observe(contentRef.current);
    return () => observer.disconnect();
  }, [event.id, event.start, event.end, onContentMeasured]);

  return (
    <EventWrapper
      ref={wrapperRef}
      event={event}
      onSelect={onSelect}
      isSelectable={isSelectable}
      {...restProps}
    >
      <div
        className={handleCenterClass}
        style={{
          height: dragHandleCenterHeight,
        }}
      />
      <div ref={contentRef} className={makeClass('time-grid__event-content')}>
        {children ? (
          children(event)
        ) : (
          <div className={makeClass('time-grid__event-details-wrapper')}>
            <span className={makeClass('time-grid__event-title')}>
              {event.title}
            </span>
            <span className={makeClass('time-grid__event-time')}>
              {getDisplayTime(event)}
            </span>
          </div>
        )}
      </div>
      <div
        className={`${extendHandleClass} ${
          isExtendable({ event }) && makeClass('time-grid__event-handle-bottom')
        }`}
        ref={extenderRef}
      />
    </EventWrapper>
  );
};

Event.defaultProps = {
  children: null,
  className: null,
  isSelectable: true,
  isExtendable: () => true,
  onContentMeasured: null,
};

Event.propTypes = {
  children: PropTypes.func,
  className: PropTypes.string,
  event: EVENT_TYPE.isRequired,
  isExtendable: PropTypes.func,
  isSelectable: PropTypes.bool,
  onContentMeasured: PropTypes.func,
  onSelect: PropTypes.func.isRequired,
};

export default Event;
