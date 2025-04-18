import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { DraggableCore } from 'react-draggable';
import {
  getSelectMinutesHeight,
  getDragVerticalChange,
  getDraggedEventStartEnd,
} from '../utils';
import { resetEventFormat } from '../../../../../utils';
import {
  SELECT_MINUTES_DEFAULT,
  STEP_MINUTES_DEFAULT,
} from '../../../../../defaultProps';
import { EVENT_TYPE, STEP_MINUTES_TYPE } from '../../../../../types';
import { extendHandleClass } from '../../../constants';

const EventExtend = ({
  children,
  event,
  isExtendable,
  onExtend,
  onExtendEnd,
  selectMinutes,
  stepHeight,
  stepMinutes,
}) => {
  const [isExtending, setIsExtending] = useState(false);
  const [deltaPosition, setDeltaPosition] = useState({ x: 0, y: 0 });
  const dragRef = useRef(null);

  const selectMinutesHeight = getSelectMinutesHeight({
    stepMinutes,
    selectMinutes,
    stepHeight,
  });

  const eventStartEnd = getDraggedEventStartEnd({
    event,
    deltaPosition,
    selectMinutesHeight,
    selectMinutes,
    isDurationOnly: true,
  });

  const heightChange = getDragVerticalChange({
    pixelsMoved: deltaPosition.y,
    selectMinutes,
    originalStart: event.start,
    originalEnd: event.end,
    selectMinutesHeight,
  });

  const newEvent = { ...event };
  newEvent.start = eventStartEnd.start;
  newEvent.end = eventStartEnd.end;
  newEvent.height = event.height + heightChange;
  if (typeof eventStartEnd.paddingTopStart !== 'undefined') {
    newEvent.paddingTopStart = eventStartEnd.paddingTopStart;
  }
  if (typeof eventStartEnd.paddingBottomEnd !== 'undefined') {
    newEvent.paddingBottomEnd = eventStartEnd.paddingBottomEnd;
  }

  return (
    <DraggableCore
      nodeRef={dragRef}
      handle={`.${extendHandleClass}`}
      onDrag={(e, ui) => {
        if (!isExtendable({ event })) {
          return false;
        }
        const { x, y } = deltaPosition;
        setDeltaPosition({ x: x + ui.deltaX, y: y + ui.deltaY });
        onExtend(resetEventFormat(newEvent));
        setIsExtending(true);
      }}
      onStop={(e, ui) => {
        if (!isExtending) {
          return false;
        }
        setDeltaPosition({ x: 0, y: 0 });
        setTimeout(() => setIsExtending(false));
        onExtendEnd({ e, ui, event: newEvent });
      }}
    >
      <span ref={dragRef}>{children({ isExtending, extendedEvent: newEvent })}</span>
    </DraggableCore>
  );
};

EventExtend.defaultProps = {
  onExtend: () => null,
  isExtendable: () => true,
  selectMinutes: SELECT_MINUTES_DEFAULT,
  stepMinutes: STEP_MINUTES_DEFAULT,
  stepHeight: null,
};

EventExtend.propTypes = {
  children: PropTypes.func.isRequired,
  event: EVENT_TYPE.isRequired,
  isExtendable: PropTypes.func,
  onExtend: PropTypes.func,
  onExtendEnd: PropTypes.func.isRequired,
  selectMinutes: STEP_MINUTES_TYPE,
  stepHeight: PropTypes.number,
  stepMinutes: STEP_MINUTES_TYPE,
};

export default EventExtend;
