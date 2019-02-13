import React from "react";
import PropTypes from "prop-types";
import get from "lodash/get";
import moment from "moment";
import Times from "../../Times";
import Day from "../../Times/components/Day";
import CurrentTimeIndicator from "../../Times/components/CurrentTimeIndicator";
import { getWeekList } from "./utils";
import { makeClass, cellWidth } from "../../../utils";
import { getTodayClass } from "../../Times/utils";
import { MOMENT_TYPE, FIRST_DAY_TYPE, STEP_MINUTES_TYPE } from "../../../types";

const columnStyles = {
  minWidth: cellWidth
};

const WeekView = ({
  view,
  selectedDate,
  calendars,
  selectedCalendars,
  firstDay,
  stepMinutes,
  onSelectEvent,
  onSelectSlot,
  selectMinutes,
  events
}) => {
  const dateList = getWeekList({ date: selectedDate, firstDay });

  return (
    <Times
      view={view}
      selectedDate={selectedDate}
      calendars={calendars}
      selectedCalendars={selectedCalendars}
      firstDay={firstDay}
      stepMinutes={stepMinutes}
      onSelectEvent={onSelectEvent}
      onSelectSlot={onSelectSlot}
      selectMinutes={selectMinutes}
      renderHeader={() =>
        dateList.map(date => {
          return (
            <h2
              className={`${makeClass("times__header-column")}${getTodayClass(
                date
              )}`}
              key={`dayHeader${date.date()}`}
              style={columnStyles}
            >
              {date.format("dddd, MMM D")}
            </h2>
          );
        })
      }
      renderColumns={({ currentTime }) =>
        dateList.map(date => {
          const eventsForDay = get(events, date.format("YYYY-MM-DD"), []);
          return (
            <Day
              events={eventsForDay}
              date={date}
              onSelectEvent={onSelectEvent}
              onSelectSlot={onSelectSlot}
              selectMinutes={selectMinutes}
              key={`weekColumn${date.day()}`}
              currentTime={currentTime}
              stepMinutes={stepMinutes}
              renderCurrentTimeIndicator={
                date.isSame(moment(), "day") && (
                  <CurrentTimeIndicator
                    stepMinutes={stepMinutes}
                    currentTime={currentTime}
                    isToday
                  />
                )
              }
            />
          );
        })
      }
    />
  );
};

WeekView.propTypes = {
  selectedDate: MOMENT_TYPE.isRequired,
  firstDay: FIRST_DAY_TYPE.isRequired,
  events: PropTypes.object.isRequired,
  stepMinutes: STEP_MINUTES_TYPE.isRequired
};

export default WeekView;
