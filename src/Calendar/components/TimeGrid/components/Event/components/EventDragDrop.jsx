import React, { useState, Fragment, useRef } from 'react';
import PropTypes from 'prop-types';
import { DraggableCore } from 'react-draggable';
import {
  EVENT_TYPE,
  STEP_MINUTES_TYPE,
  COLUMN_WIDTHS_TYPE,
} from '../../../../../types';
import {
  getSelectMinutesHeight,
  getDragVerticalChange,
  getDraggedEventStartEnd,
} from '../utils';
import { makeClass, resetEventFormat } from '../../../../../utils';
import {
  SELECT_MINUTES_DEFAULT,
  STEP_MINUTES_DEFAULT,
} from '../../../../../defaultProps';
import { handleCenterClass } from '../../../constants';

/**
 * Get classes that we're going to attach to an event while we're
 * dragging it
 *
 * @param {Object} params
 * @param {boolean} params.isDragging
 * @param {boolean} params.wasDragged
 */
const getDraggableClasses = ({ isDragging, wasDragged }) => {
  return makeClass(
    'time-grid__draggable-event',
    isDragging && 'time-grid__dragging-event',
    wasDragged && 'time-grid__dragged-event'
  );
};

/**
 * Get the 'left' position of an event when it is dragged
 *
 * @param {Object} params
 * @param {number} params.columnMoves
 * @param {number[]} params.columnWidths
 * @param {number} params.columnIndex
 */
export const getLeftPosition = ({ columnMoves, columnWidths, columnIndex }) => {
  let left = 0;
  for (let i = 1; i <= Math.abs(columnMoves); i += 1) {
    // Moving left
    if (columnMoves < 0) {
      left = left + columnWidths[columnIndex - i] * -1;
    }
    // Moving right
    if (columnMoves > 0) {
      left = left + columnWidths[columnIndex + i - 1];
    }
  }
  return left;
};

const EventDragDrop = ({
  event,
  stepMinutes,
  selectMinutes,
  columnWidths,
  columnIndex,
  isDraggable,
  onDrag,
  onDragEnd,
  children,
  stepHeight,
  getUpdatedDraggedEvent,
}) => {
  const [deltaPosition, setDeltaPosition] = useState({ x: 0, y: 0 });
  const [xPosition, setXPosition] = useState(0);
  const [leftChange, setLeftChange] = useState(0);
  const [currentColumnWidth, setCurrentColumnWidth] = useState(
    columnWidths[columnIndex]
  );
  const [isDragging, setIsDragging] = useState(false);
  const [wasDragged, setWasDragged] = useState(false);
  const [currentColumn, setCurrentColumn] = useState(columnIndex);
  const dragRef = useRef(null);

  const selectMinutesHeight = getSelectMinutesHeight({
    stepHeight,
    stepMinutes,
    selectMinutes,
  });

  const topChange = getDragVerticalChange({
    originalStart: event.start,
    originalEnd: event.end,
    pixelsMoved: deltaPosition.y,
    selectMinutes,
    selectMinutesHeight,
  });

  const columnMoves = currentColumn - columnIndex;

  const changeColumn = () => {
    // Make sure the current column width is actually the current column width
    if (currentColumnWidth !== columnWidths[currentColumn]) {
      setCurrentColumnWidth(columnWidths[currentColumn]);
    }

    const leftPosition = getLeftPosition({
      columnMoves,
      columnWidths,
      columnIndex,
    });

    // Make sure the leftChange is up to date with the position
    if (leftPosition !== leftChange) {
      setLeftChange(leftPosition);
    }

    const leftBound = leftPosition;
    const rightBound = leftPosition + currentColumnWidth;

    // Moving Left
    if (xPosition < leftBound && currentColumn !== 0) {
      setNewColumn({ direction: -1, left: leftPosition });
    }
    // Moving Right
    if (xPosition > rightBound && currentColumn !== columnWidths.length - 1) {
      setNewColumn({ direction: 1, left: leftPosition });
    }
  };

  /**
   * Set the state that we changed columns
   *
   * @param {Object} params - 1 is to the right -1 is to the left
   * @param {1|-1} direction - 1 is to the right -1 is to the left
   * @param {number} left - total left pixels we're moving
   */
  const setNewColumn = ({ direction, left }) => {
    setLeftChange(left);
    setCurrentColumnWidth(columnWidths[currentColumn + direction]);
    setCurrentColumn(currentColumn + direction);
  };

  let updatedEvent = Object.assign({}, event);
  const eventStartEnd = getDraggedEventStartEnd({
    event,
    deltaPosition,
    selectMinutesHeight,
    selectMinutes,
  });
  updatedEvent.start = eventStartEnd.start;
  updatedEvent.end = eventStartEnd.end;

  if (typeof event.paddingTopStart !== 'undefined') {
    updatedEvent.paddingTopStart = eventStartEnd.paddingTopStart;
  }
  if (typeof event.paddingBottomEnd !== 'undefined') {
    updatedEvent.paddingBottomEnd = eventStartEnd.paddingBottomEnd;
  }

  updatedEvent = getUpdatedDraggedEvent({
    event: updatedEvent,
    start: eventStartEnd.start,
    end: eventStartEnd.end,
    columnMoves,
  });

  updatedEvent.top = event.top + topChange;

  changeColumn();

  return (
    <Fragment>
      <DraggableCore
        nodeRef={dragRef}
        onDrag={(e, ui) => {
          if (!isDraggable({ event })) return false;
          const { x, y } = deltaPosition;
          setDeltaPosition({ x: x + ui.deltaX, y: y + ui.deltaY });
          setXPosition(ui.x);
          setIsDragging(true);
          onDrag(e, ui);
        }}
        handle={`.${handleCenterClass}`}
        onStop={(e, ui) => {
          if (!isDragging) return false;
          setDeltaPosition({ x: 0, y: 0 });
          setTimeout(() => setIsDragging(false));
          setWasDragged(true);
          onDragEnd({ e, event: resetEventFormat(updatedEvent) });
        }}
      >
        <span ref={dragRef}>
          {children({
            draggedEvent: updatedEvent,
            leftChange,
            currentColumnWidth,
            isDragging,
            wasDragged,
            isDndPlaceholder: false,
            dndClassName: getDraggableClasses({ isDragging, wasDragged }),
          })}
        </span>
      </DraggableCore>
      {isDragging && (
        <div className={makeClass('time-grid__dragging-placeholder-event')}>
          {children({
            draggedEvent: event,
            isDragging,
            topChange: 0,
            isDndPlaceholder: true,
          })}
        </div>
      )}
    </Fragment>
  );
};

EventDragDrop.defaultProps = {
  isDraggable: () => true,
  getUpdatedDraggedEvent: () => null,
  onDrag: () => null,
  stepHeight: null,
  selectMinutes: SELECT_MINUTES_DEFAULT,
  stepMinutes: STEP_MINUTES_DEFAULT,
};

EventDragDrop.propTypes = {
  children: PropTypes.func.isRequired,
  columnIndex: PropTypes.number.isRequired,
  columnWidths: COLUMN_WIDTHS_TYPE.isRequired,
  event: EVENT_TYPE.isRequired,
  getUpdatedDraggedEvent: PropTypes.func,
  isDraggable: PropTypes.func,
  onDrag: PropTypes.func,
  onDragEnd: PropTypes.func.isRequired,
  selectMinutes: STEP_MINUTES_TYPE,
  stepHeight: PropTypes.number,
  stepMinutes: STEP_MINUTES_TYPE,
};

export default EventDragDrop;
