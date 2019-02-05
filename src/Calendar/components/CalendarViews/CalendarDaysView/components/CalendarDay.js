import React from "react";
import PropTypes from "prop-types";
import moment from "moment";
import styles from "./CalendarDay.module.css";
import { EVENT_TYPE, MOMENT_TYPE, STEP_MINUTES_TYPE } from "../../../../types";
// import { getMinutesSinceMidnight } from "../utils";

const CalendarDay = ({
  events,
  date,
  totalStepsPerBlock,
  stepHeight,
  stepMinutes
}) => {
  const borderWidth = 1;
  // We need to remove the height added by borders to get everything to line
  // up correctly
  const extraBorderHeight =
    (totalStepsPerBlock * borderWidth - borderWidth) / totalStepsPerBlock;

  const renderTimeBlocks = () => {
    const times = [];
    for (let i = 0; i < 24 * totalStepsPerBlock; i += 1) {
      times.push(
        <div
          className={styles.time_block}
          key={`timeBlock${i}${date.date()}`}
          style={{
            height: `${stepHeight - extraBorderHeight}px`
          }}
        >
          {moment()
            .hour(i)
            .format("ha")}
        </div>
      );
    }
    return times;
  };

  // const renderEvents = () => {
  //   return events.map(event => {
  //     const minutesSinceMidnight = getMinutesSinceMidnight(event.start);

  //     return false;
  //   });
  // };

  return (
    <div
      className={styles.column}
      key={`weekView${date.day()}`}
      style={{
        minWidth: `${100 / 7}%`
      }}
    >
      {/* {renderEvents()} */}
      {renderTimeBlocks()}
    </div>
  );
};

CalendarDay.propTypes = {
  totalStepsPerBlock: PropTypes.number.isRequired,
  stepHeight: PropTypes.number.isRequired,
  events: PropTypes.arrayOf(EVENT_TYPE).isRequired,
  date: MOMENT_TYPE.isRequired,
  stepMinutes: STEP_MINUTES_TYPE
};

export default CalendarDay;
