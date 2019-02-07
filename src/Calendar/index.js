import React, { Fragment, useMemo } from "react";
import PropTypes from "prop-types";
import {
  CalendarMonthView,
  CalendarDaysView
} from "./components/CalendarViews";
import CalendarToolbar from "./components/CalendarToolbar";
import { CALENDAR_VIEWS } from "./constants";
import {
  FIRST_DAY_TYPE,
  MOMENT_TYPE,
  CALENDAR_VIEW_TYPE,
  STEP_MINUTES_TYPE,
  CALENDAR_TYPE
} from "./types";
import { getMungedEvents, getEventsWithSelectedCalendars } from "./utils";

const Calendar = ({
  events,
  view,
  calendars,
  selectedCalendars,
  setSelectedCalendars,
  onViewChange,
  selectedDate,
  onNavigate,
  firstDay,
  onSelectEvent,
  onSelecting,
  onSelectSlot,
  stepMinutes,
  selectMinutes
}) => {
  const getView = () => {
    const { month, week, day } = CALENDAR_VIEWS;
    const views = {
      [month]: CalendarMonthView,
      [week]: CalendarDaysView,
      [day]: CalendarDaysView
    };
    return views[view];
  };

  const View = getView();

  const mungedEvents = useMemo(() => getMungedEvents({ events, stepMinutes }), [
    events,
    stepMinutes
  ]);

  const eventsWithSelectedCalendars = useMemo(
    () =>
      getEventsWithSelectedCalendars({
        mungedEvents,
        selectedCalendars
      }),
    [mungedEvents, selectedCalendars]
  );

  return (
    <Fragment>
      <CalendarToolbar
        view={view}
        onViewChange={onViewChange}
        selectedDate={selectedDate}
        onNavigate={onNavigate}
        firstDay={firstDay}
        calendars={calendars}
        selectedCalendars={selectedCalendars}
        setSelectedCalendars={setSelectedCalendars}
      />
      <View
        view={view}
        events={eventsWithSelectedCalendars}
        selectedDate={selectedDate}
        onSelectEvent={onSelectEvent}
        onSelecting={onSelecting}
        onSelectSlot={onSelectSlot}
        firstDay={firstDay}
        stepMinutes={stepMinutes}
        selectMinutes={selectMinutes}
      />
    </Fragment>
  );
};

Calendar.propTypes = {
  events: PropTypes.arrayOf(
    PropTypes.shape({
      start: PropTypes.string.isRequired,
      end: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired
    })
  ).isRequired,
  calendars: PropTypes.arrayOf(CALENDAR_TYPE),
  view: CALENDAR_VIEW_TYPE.isRequired,
  selectedCalendars: PropTypes.arrayOf(PropTypes.number).isRequired,
  setSelectedCalendars: PropTypes.func.isRequired,
  onViewChange: PropTypes.func.isRequired,
  selectedDate: MOMENT_TYPE.isRequired,
  onNavigate: PropTypes.func.isRequired,
  firstDay: FIRST_DAY_TYPE.isRequired,
  onSelectEvent: PropTypes.func.isRequired,
  onSelecting: PropTypes.func.isRequired,
  onSelectSlot: PropTypes.func.isRequired,
  stepMinutes: STEP_MINUTES_TYPE.isRequired,
  selectMinutes: STEP_MINUTES_TYPE.isRequired
};

export default Calendar;
