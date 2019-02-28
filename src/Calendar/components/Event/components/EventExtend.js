import React, { useState, useMemo, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { DraggableCore } from 'react-draggable';
import { extendHandleClass } from '..';
import { EVENT_TYPE, STEP_MINUTES_TYPE } from '../../../types';
import {
  getSelectMinutesHeight,
  getDragVerticalChange,
  getDraggedEventStartEnd,
} from '../utils';
import {
  SELECT_MINUTES_DEFAULT,
  STEP_MINUTES_DEFAULT,
} from '../../../defaultProps';
import { resetEventFormat } from '../../../utils';

const EventExtend = ({
  children,
  event,
  onExtend,
  onExtendEnd,
  selectMinutes,
  stepMinutes,
}) => {
  const timeout = useRef(null);
  const [isExtending, setIsExtending] = useState(false);
  const [deltaPosition, setDeltaPosition] = useState({ x: 0, y: 0 });

  const selectMinutesHeight = useMemo(
    () =>
      getSelectMinutesHeight({
        stepMinutes,
        selectMinutes,
      }),
    [stepMinutes, selectMinutes]
  );

  const eventStartEnd = getDraggedEventStartEnd({
    event,
    deltaPosition,
    selectMinutesHeight,
    selectMinutes,
    isDurationOnly: true,
  });

  const heightChange = getDragVerticalChange({
    lastY: deltaPosition.y,
    selectMinutes,
    event,
    selectMinutesHeight,
  });

  const newEvent = Object.assign({}, event);
  newEvent.start = eventStartEnd.start;
  newEvent.end = eventStartEnd.end;
  newEvent.height = event.height + heightChange;

  useEffect(() => {
    return () => {
      clearTimeout(timeout.current);
    };
  });

  return (
    <DraggableCore
      handle={`.${extendHandleClass}`}
      onDrag={(e, ui) => {
        const { x, y } = deltaPosition;
        setDeltaPosition({ x: x + ui.deltaX, y: y + ui.deltaY });
        setIsExtending(true);
        onExtend(resetEventFormat(newEvent));
      }}
      onStop={() => {
        if (!isExtending) return false;
        timeout.current = setTimeout(() => setIsExtending(false));
        setDeltaPosition({ x: 0, y: 0 });
        onExtendEnd(newEvent);
      }}
    >
      <span>{children({ isExtending, extendedEvent: newEvent })}</span>
    </DraggableCore>
  );
};

EventExtend.defaultProps = {
  onExtend: () => null,
  selectMinutes: SELECT_MINUTES_DEFAULT,
  stepMinutes: STEP_MINUTES_DEFAULT,
};

EventExtend.propTypes = {
  children: PropTypes.func.isRequired,
  event: EVENT_TYPE.isRequired,
  onExtend: PropTypes.func,
  onExtendEnd: PropTypes.func.isRequired,
  selectMinutes: STEP_MINUTES_TYPE,
  stepMinutes: STEP_MINUTES_TYPE,
};

export default EventExtend;
