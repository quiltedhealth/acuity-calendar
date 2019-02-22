import React, { useMemo } from "react";
import PropTypes from "prop-types";
import moment from "moment";
import { MOMENT_TYPE, STEP_MINUTES_TYPE } from "../../../types";
import { STEP_HEIGHTS, STEP_BORDER_WIDTH } from "../constants";
import { getTodayClass, getTopOffset } from "../utils";
import "./Day.scss";
import { makeClass } from "../../../utils";
import Event from "../../Event";
import EventDragDrop from "../../Event/components/EventDragDrop";

const Day = ({
  events,
  stepDetails,
  date,
  currentTime,
  stepMinutes,
  onSelectEvent,
  onSelectSlot,
  selectMinutes,
  renderCurrentTimeIndicator,
  renderEvent
}) => {
  const totalHeight = useMemo(() => {
    const totalStepsPerBlock = 60 / stepMinutes;
    const aggregateBorderHeight = totalStepsPerBlock * STEP_BORDER_WIDTH * 24;
    return (
      STEP_HEIGHTS[stepMinutes] * totalStepsPerBlock * 24 +
      (aggregateBorderHeight - 1 * STEP_BORDER_WIDTH * 25)
    );
  }, [stepMinutes]);

  const getClickedTime = e => {
    const rect = e.target.getBoundingClientRect();
    const verticalClick = e.clientY - rect.top;

    const stepHeight = STEP_HEIGHTS[stepMinutes];
    const pixelsPerMinute = stepHeight / stepMinutes;
    const minutesFromMidnight = verticalClick / pixelsPerMinute;
    const selectedTime = date
      .clone()
      .startOf("day")
      .add(minutesFromMidnight, "minutes");

    const rounded =
      Math.round(selectedTime.clone().minute() / selectMinutes) * selectMinutes;

    return selectedTime
      .clone()
      .minute(rounded)
      .second(0);
  };

  const totalColumns = Object.keys(events).length || 1;
  const minWidth = `${totalColumns * 190}px`;
  const percentWidth = 100 / totalColumns - 1;
  const currentTimeIndicatorClass = makeClass(
    "step-grid__current-time-indicator"
  );

  return (
    <div
      className={`${makeClass("step-grid__column")}${getTodayClass(date)}`}
      key={`weekView${date.day()}`}
      style={{
        height: `${totalHeight}px`,
        minWidth
      }}
      onClick={e => {
        onSelectSlot(getClickedTime(e));
      }}
    >
      {date.isSame(moment(), "day") && (
        <div
          className={currentTimeIndicatorClass}
          style={{
            top: `${getTopOffset({ stepMinutes, date: currentTime })}px`
          }}
        >
          <div className={`${currentTimeIndicatorClass}__line-today`} />
        </div>
      )}
      {Object.keys(events).map(column => {
        const thisColumnEvents = events[column];
        return thisColumnEvents.map(event => {
          return (
            <EventDragDrop
              key={event.id}
              event={event}
              stepMinutes={stepMinutes}
              selectMinutes={selectMinutes}
            >
              {draggedEvent => (
                <Event
                  event={draggedEvent}
                  style={{
                    top: `${event.top}px`,
                    height: `${event.height}px`,
                    width: `${percentWidth}%`,
                    left: `${percentWidth * (column - 1)}%`
                  }}
                  onSelectEvent={onSelectEvent}
                >
                  {renderEvent}
                </Event>
              )}
            </EventDragDrop>
          );
        });
      })}
      {stepDetails &&
        stepDetails.map(stepDetail => {
          return (
            <div
              key={stepDetail.id}
              className={makeClass("step-grid__step-detail-wrapper")}
              style={{
                top: `${stepDetail.top}px`,
                height: `${stepDetail.height}px`
              }}
            />
          );
        })}
    </div>
  );
};

Day.defaultProps = {
  renderEvent: null
};

Day.propTypes = {
  events: PropTypes.object.isRequired,
  date: MOMENT_TYPE.isRequired,
  stepMinutes: STEP_MINUTES_TYPE,
  onSelectEvent: PropTypes.func.isRequired,
  onSelectSlot: PropTypes.func.isRequired,
  selectMinutes: STEP_MINUTES_TYPE,
  renderEvent: PropTypes.func,
  currentTime: MOMENT_TYPE.isRequired
};

export default Day;