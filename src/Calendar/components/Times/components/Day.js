import React, { useMemo } from "react";
import PropTypes from "prop-types";
import { MOMENT_TYPE, STEP_MINUTES_TYPE, EVENT_TYPE } from "../../../types";
import Event from "../../Event";
import { STEP_HEIGHTS, STEP_BORDER_WIDTH } from "../constants";
import { getTodayClass, getEventColumns } from "../utils";
import "./Day.scss";
import { makeClass, cellWidth } from "../../../utils";

const Day = ({
  events,
  date,
  stepMinutes,
  onSelectEvent,
  onSelectSlot,
  selectMinutes,
  renderCurrentTimeIndicator
}) => {
  const eventsWithColumns = useMemo(() => getEventColumns(events), [events]);

  const renderEvents = () => {
    return Object.keys(eventsWithColumns).map(column => {
      const thisColumnEvents = eventsWithColumns[column];
      return (
        <div className={makeClass("times__event-column")} key={column}>
          {thisColumnEvents.map(event => {
            return (
              <Event
                key={event.id}
                event={event}
                style={{ top: `${event.top}px`, height: `${event.height}px` }}
                onSelectEvent={onSelectEvent}
              />
            );
          })}
        </div>
      );
    });
  };

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

  return (
    <div
      className={`${makeClass("times__column")}${getTodayClass(date)}`}
      key={`weekView${date.day()}`}
      style={{
        minWidth: cellWidth,
        height: `${totalHeight}px`
      }}
      onClick={e => {
        onSelectSlot(getClickedTime(e));
      }}
    >
      {renderCurrentTimeIndicator}
      <div className={makeClass("times__event-columns")}>{renderEvents()}</div>
    </div>
  );
};

Day.defaultProps = {
  renderCurrentTimeIndicator: null
};

Day.propTypes = {
  events: PropTypes.arrayOf(EVENT_TYPE).isRequired,
  date: MOMENT_TYPE.isRequired,
  stepMinutes: STEP_MINUTES_TYPE,
  onSelectEvent: PropTypes.func.isRequired,
  onSelectSlot: PropTypes.func.isRequired,
  selectMinutes: STEP_MINUTES_TYPE,
  renderCurrentTimeIndicator: PropTypes.node
};

export default Day;
